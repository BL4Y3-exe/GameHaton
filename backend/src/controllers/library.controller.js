const libraryService = require("../services/library.service");
const { sendSuccess } = require("../utils/response");

async function getLibrary(req, res) {
  const games = await libraryService.getSavedUserLibrary(req.user);
  return sendSuccess(res, { games, count: games.length });
}

async function syncLibrary(req, res) {
  const result = await libraryService.syncUserLibrary(req.user);
  return sendSuccess(res, result);
}

module.exports = { getLibrary, syncLibrary };
