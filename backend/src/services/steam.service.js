const env = require("../config/env");

const STEAM_OPENID_ENDPOINT = "https://steamcommunity.com/openid/login";
const STEAM_ID_PATTERN =
  /^https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/;
const REQUEST_TIMEOUT_MS = 8000;

function getLoginUrl() {
  const url = new URL(STEAM_OPENID_ENDPOINT);
  url.searchParams.set("openid.ns", "http://specs.openid.net/auth/2.0");
  url.searchParams.set("openid.mode", "checkid_setup");
  url.searchParams.set("openid.return_to", env.steamReturnUrl);
  url.searchParams.set("openid.realm", new URL(env.backendUrl).origin);
  url.searchParams.set(
    "openid.identity",
    "http://specs.openid.net/auth/2.0/identifier_select",
  );
  url.searchParams.set(
    "openid.claimed_id",
    "http://specs.openid.net/auth/2.0/identifier_select",
  );
  return url.toString();
}

async function verifyOpenIdCallback(query, options = {}) {
  if (query["openid.mode"] !== "id_res") {
    throw createError(
      "Steam authentication was cancelled",
      "STEAM_AUTH_CANCELLED",
      401,
    );
  }

  if (
    query["openid.op_endpoint"] !== STEAM_OPENID_ENDPOINT ||
    query["openid.return_to"] !== env.steamReturnUrl
  ) {
    throw createError(
      "Steam returned an unexpected callback target",
      "STEAM_AUTH_INVALID",
      401,
    );
  }

  const claimedId = query["openid.claimed_id"];
  const steamId = extractSteamId(claimedId);

  if (!steamId) {
    throw createError(
      "Steam returned an invalid claimed ID",
      "INVALID_STEAM_ID",
      401,
    );
  }

  const verificationParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith("openid.") && typeof value === "string") {
      verificationParams.set(key, value);
    }
  }

  verificationParams.set("openid.mode", "check_authentication");

  const response = await fetchWithTimeout(
    STEAM_OPENID_ENDPOINT,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verificationParams,
    },
    options.fetchImpl,
  );
  const verification = await response.text();

  if (!response.ok || !/^is_valid:true$/m.test(verification)) {
    throw createError(
      "Steam could not verify this login",
      "STEAM_AUTH_INVALID",
      401,
    );
  }

  return steamId;
}

async function getPlayerProfile(steamId, options = {}) {
  const fallback = {
    steamId,
    displayName: `Steam User ${steamId.slice(-4)}`,
    avatarUrl: null,
  };

  if (!env.steamApiKey) {
    return fallback;
  }

  try {
    const url = new URL(
      "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/",
    );
    url.searchParams.set("key", env.steamApiKey);
    url.searchParams.set("steamids", steamId);

    const response = await fetchWithTimeout(url, {}, options.fetchImpl);

    if (!response.ok) {
      return fallback;
    }

    const payload = await response.json();
    const player = payload.response?.players?.[0];

    if (!player) {
      return fallback;
    }

    return {
      steamId,
      displayName: player.personaname || fallback.displayName,
      avatarUrl: player.avatarfull || player.avatarmedium || null,
    };
  } catch (error) {
    return fallback;
  }
}

async function getOwnedGames(steamId, options = {}) {
  if (!env.steamApiKey) {
    throw createError(
      "STEAM_API_KEY is required to sync a Steam library",
      "STEAM_API_KEY_MISSING",
      503,
    );
  }

  const url = new URL(
    "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/",
  );
  url.searchParams.set("key", env.steamApiKey);
  url.searchParams.set("steamid", steamId);
  url.searchParams.set("include_appinfo", "true");
  url.searchParams.set("include_played_free_games", "true");
  url.searchParams.set("format", "json");

  let response;

  try {
    response = await fetchWithTimeout(url, {}, options.fetchImpl);
  } catch (error) {
    throw createError(
      "Could not reach the Steam Web API",
      "STEAM_API_UNAVAILABLE",
      502,
    );
  }

  if (!response.ok) {
    throw createError(
      `Steam Web API returned HTTP ${response.status}`,
      "STEAM_API_ERROR",
      502,
    );
  }

  let payload;

  try {
    payload = await response.json();
  } catch (error) {
    throw createError(
      "Steam Web API returned an invalid response",
      "STEAM_API_ERROR",
      502,
    );
  }

  const games = payload.response?.games;

  if (!Array.isArray(games)) {
    throw createError(
      "Steam library is private or unavailable",
      "STEAM_LIBRARY_UNAVAILABLE",
      403,
    );
  }

  return games.map(normalizeOwnedGame).filter(Boolean);
}

function normalizeOwnedGame(game) {
  const appid = Number(game.appid);

  if (!Number.isInteger(appid) || appid <= 0 || !game.name) {
    return null;
  }

  const playtimeMinutes = Math.max(0, Number(game.playtime_forever) || 0);

  return {
    appid,
    name: game.name,
    image: getSteamHeaderUrl(appid),
    playtimeMinutes,
    playtimeHours: Number((playtimeMinutes / 60).toFixed(1)),
    lastPlayedAt: game.rtime_last_played
      ? new Date(Number(game.rtime_last_played) * 1000).toISOString()
      : null,
    genres: [],
    tags: [],
    storeUrl: `https://store.steampowered.com/app/${appid}`,
  };
}

function getSteamHeaderUrl(appid) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;
}

function extractSteamId(claimedId) {
  const match = String(claimedId || "").match(STEAM_ID_PATTERN);
  return match ? match[1] : null;
}

async function fetchWithTimeout(url, options = {}, fetchImpl = global.fetch) {
  if (typeof fetchImpl !== "function") {
    throw createError("Fetch API is unavailable", "STEAM_REQUEST_FAILED");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetchImpl(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function getSteamStatus() {
  return {
    openIdConfigured: Boolean(env.steamReturnUrl && env.backendUrl),
    profileApiConfigured: Boolean(env.steamApiKey),
  };
}

function createError(message, code, statusCode = 502) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  getLoginUrl,
  verifyOpenIdCallback,
  getPlayerProfile,
  getOwnedGames,
  normalizeOwnedGame,
  getSteamHeaderUrl,
  extractSteamId,
  getSteamStatus,
};
