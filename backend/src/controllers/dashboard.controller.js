const libraryService = require("../services/library.service");
const recommendationService = require("../services/recommendation.service");
const dealsService = require("../services/deals.service");
const { sendSuccess } = require("../utils/response");

function getSummary(req, res) {
  const games = libraryService.getUserLibrary(req.user);
  const recommendations = recommendationService.getRevivalQueue(req.user);
  const freeGames = dealsService.getFreeGames();
  const sales = dealsService.getSales();
  const totalPlaytimeHours = games.reduce(
    (total, game) => total + game.playtime_minutes / 60,
    0,
  );

  return sendSuccess(res, {
    total_games: games.length,
    total_playtime_hours: Number(totalPlaytimeHours.toFixed(1)),
    comeback_recommendations: recommendations.length,
    free_games: freeGames.length,
    sales: sales.length,
    top_recommended_game: recommendations[0] || null,
  });
}

module.exports = { getSummary };
