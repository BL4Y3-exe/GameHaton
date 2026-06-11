const dealsService = require("../services/deals.service");
const { sendSuccess } = require("../utils/response");

function getFreeGames(req, res) {
  const games = dealsService.getFreeGames();
  return sendSuccess(res, { games, count: games.length, source: "demo" });
}

function getSales(req, res) {
  const sales = dealsService.getSales();
  return sendSuccess(res, { sales, count: sales.length, source: "demo" });
}

module.exports = { getFreeGames, getSales };
