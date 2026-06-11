const recommendationService = require("../services/recommendation.service");
const { sendSuccess } = require("../utils/response");

function getRevivalQueue(req, res) {
  const recommendations = recommendationService.getRevivalQueue(req.user);
  return sendSuccess(res, {
    recommendations,
    count: recommendations.length,
  });
}

module.exports = { getRevivalQueue };
