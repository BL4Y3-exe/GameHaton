const libraryService = require("./library.service");
const demoService = require("./demo.service");

const DAY_MS = 24 * 60 * 60 * 1000;

function getRevivalQueue(user, limit = 6) {
  const saleAppIds = new Set(demoService.getSales().map((deal) => deal.appid));

  return libraryService
    .getUserLibrary(user)
    .map((game) => scoreGame(game, saleAppIds.has(game.appid)))
    .filter((game) => game.days_since_played >= 60)
    .sort((a, b) => b.revival_score - a.revival_score)
    .slice(0, limit);
}

function scoreGame(game, isDiscounted) {
  const daysSincePlayed = Math.max(
    0,
    Math.floor((Date.now() - new Date(game.last_played_at).getTime()) / DAY_MS),
  );
  const playtimeWeight = Math.min(game.playtime_hours / 2, 40);
  const inactivityWeight = Math.min(daysSincePlayed / 20, 35);
  const popularityWeight = Math.min(game.popularity / 10, 10);
  const discountBoost = isDiscounted ? 15 : 0;
  const revivalScore = Math.round(
    playtimeWeight + inactivityWeight + popularityWeight + discountBoost,
  );

  const reasons = [
    `${game.playtime_hours} hours played`,
    `not played for about ${daysSincePlayed} days`,
  ];

  if (game.popularity >= 93) {
    reasons.push("a highly recognizable community favorite");
  }

  if (isDiscounted) {
    reasons.push("currently discounted");
  }

  return {
    ...game,
    days_since_played: daysSincePlayed,
    is_discounted: isDiscounted,
    revival_score: revivalScore,
    reason: `Come back because you have ${reasons.join(", ")}.`,
  };
}

module.exports = { getRevivalQueue };
