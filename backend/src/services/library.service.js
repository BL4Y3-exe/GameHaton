const demoService = require("./demo.service");

function getUserLibrary(user) {
  if (user.is_demo) {
    return demoService.getLibrary();
  }

  return [];
}

function syncUserLibrary(user) {
  const games = getUserLibrary(user);

  return {
    games,
    synced_count: games.length,
    synced_at: new Date().toISOString(),
    source: user.is_demo ? "demo" : "steam",
  };
}

module.exports = { getUserLibrary, syncUserLibrary };
