const libraryService = require("../services/library.service");
const { sendSuccess } = require("../utils/response");

function getLibrary(req, res) {
  const games = libraryService.getUserLibrary(req.user);
  return sendSuccess(res, { games, count: games.length });
}

function syncLibrary(req, res) {
  return sendSuccess(res, libraryService.syncUserLibrary(req.user));
}

module.exports = { getLibrary, syncLibrary };
