const env = require("./env");

function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

async function upsertSteamUser(profile, options = {}) {
  ensureConfigured();

  const fetchImpl = options.fetchImpl || global.fetch;
  const endpoint = new URL("/rest/v1/users", env.supabaseUrl);
  endpoint.searchParams.set("on_conflict", "steam_id");

  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: getHeaders({
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify({
      steam_id: profile.steamId,
      display_name: profile.displayName,
      avatar_url: profile.avatarUrl,
      is_demo: false,
      updated_at: new Date().toISOString(),
    }),
  });

  const users = await parseResponse(response, "upsert Steam user");
  const user = users[0];

  if (!user) {
    throw createError("Supabase did not return the saved user", "SUPABASE_ERROR");
  }

  return user;
}

async function getUserById(userId, options = {}) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const fetchImpl = options.fetchImpl || global.fetch;
  const endpoint = new URL("/rest/v1/users", env.supabaseUrl);
  endpoint.searchParams.set("id", `eq.${userId}`);
  endpoint.searchParams.set("select", "*");
  endpoint.searchParams.set("limit", "1");

  const response = await fetchImpl(endpoint, {
    headers: getHeaders(),
  });
  const users = await parseResponse(response, "load user");
  return users[0] || null;
}

async function upsertUserGames(userId, games, options = {}) {
  ensureConfigured();

  if (games.length === 0) {
    return [];
  }

  const fetchImpl = options.fetchImpl || global.fetch;
  const endpoint = new URL("/rest/v1/user_games", env.supabaseUrl);
  endpoint.searchParams.set("on_conflict", "user_id,appid");
  const timestamp = new Date().toISOString();
  const rows = games.map((game) => ({
    user_id: userId,
    appid: game.appid,
    name: game.name,
    image: game.image,
    playtime_minutes: game.playtimeMinutes,
    playtime_hours: game.playtimeHours,
    last_played_at: game.lastPlayedAt,
    metadata: {
      genres: game.genres,
      tags: game.tags,
      storeUrl: game.storeUrl,
    },
    updated_at: timestamp,
  }));

  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: getHeaders({
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify(rows),
  });

  return parseResponse(response, "save Steam library");
}

async function getUserGames(userId, options = {}) {
  ensureConfigured();

  const fetchImpl = options.fetchImpl || global.fetch;
  const endpoint = new URL("/rest/v1/user_games", env.supabaseUrl);
  endpoint.searchParams.set("user_id", `eq.${userId}`);
  endpoint.searchParams.set("select", "*");
  endpoint.searchParams.set("order", "playtime_minutes.desc");

  const response = await fetchImpl(endpoint, {
    headers: getHeaders(),
  });

  return parseResponse(response, "load saved library");
}

function getHeaders(extraHeaders = {}) {
  return {
    apikey: env.supabaseServiceRoleKey,
    Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
    ...extraHeaders,
  };
}

async function parseResponse(response, action) {
  if (!response.ok) {
    const details = await response.text();
    throw createError(
      `Could not ${action}: Supabase returned HTTP ${response.status}${
        details ? ` (${details})` : ""
      }`,
      "SUPABASE_ERROR",
    );
  }

  return response.json();
}

function ensureConfigured() {
  if (!isSupabaseConfigured()) {
    throw createError(
      "Supabase is not configured",
      "SUPABASE_NOT_CONFIGURED",
      503,
    );
  }
}

function createError(message, code, statusCode = 502) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  isSupabaseConfigured,
  upsertSteamUser,
  getUserById,
  upsertUserGames,
  getUserGames,
};
