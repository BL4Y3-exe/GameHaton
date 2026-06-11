const dealsService = require("../services/deals.service");
const { sendSuccess } = require("../utils/response");

async function getFreeGames(req, res) {
  const result = await dealsService.getCurrentFreeGames();
  return sendSuccess(res, {
    games: result.items,
    count: result.items.length,
    source: result.source,
    cached: result.cached,
  });
}

async function getSales(req, res) {
  const result = await dealsService.getCurrentSales();
  return sendSuccess(res, {
    sales: result.items,
    count: result.items.length,
    source: result.source,
    cached: result.cached,
  });
}

module.exports = { getFreeGames, getSales };
