const demoService = require("./demo.service");
const steamService = require("./steam.service");
const supabase = require("../config/supabase");

function getDemoLibrary() {
  return demoService.getLibrary().map(normalizeDemoGame);
}

async function getSavedUserLibrary(user, options = {}) {
  if (user.is_demo) {
    return getDemoLibrary();
  }

  const database = options.supabase || supabase;
  const rows = await database.getUserGames(user.id, options);
  return rows.map(normalizeSavedGame);
}

async function syncUserLibrary(user, options = {}) {
  if (user.is_demo) {
    const games = getDemoLibrary();
    return buildSyncResult(games, "demo");
  }

  if (!user.steam_id) {
    throw createError(
      "Authenticated user does not have a Steam ID",
      "STEAM_ID_MISSING",
      400,
    );
  }

  const steam = options.steamService || steamService;
  const database = options.supabase || supabase;
  const games = await steam.getOwnedGames(user.steam_id, options);
  await database.upsertUserGames(user.id, games, options);

  return buildSyncResult(games, "steam");
}

function getUserLibrary(user) {
  return user.is_demo ? getDemoLibrary() : [];
}

function normalizeDemoGame(game) {
  return {
    appid: game.appid,
    name: game.name,
    image: game.image,
    playtimeMinutes: game.playtime_minutes,
    playtimeHours: game.playtime_hours,
    lastPlayedAt: game.last_played_at,
    genres: game.genres || [],
    tags: game.tags || [],
    storeUrl: game.store_url,
  };
}

function normalizeSavedGame(row) {
  const metadata = row.metadata || {};

  return {
    appid: row.appid,
    name: row.name,
    image: row.image,
    playtimeMinutes: row.playtime_minutes,
    playtimeHours: Number(row.playtime_hours),
    lastPlayedAt: row.last_played_at,
    genres: Array.isArray(metadata.genres) ? metadata.genres : [],
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    storeUrl:
      metadata.storeUrl ||
      `https://store.steampowered.com/app/${row.appid}`,
  };
}

function buildSyncResult(games, source) {
  return {
    games,
    syncedCount: games.length,
    syncedAt: new Date().toISOString(),
    source,
  };
}

function createError(message, code, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  getUserLibrary,
  getSavedUserLibrary,
  syncUserLibrary,
  normalizeDemoGame,
  normalizeSavedGame,
};
