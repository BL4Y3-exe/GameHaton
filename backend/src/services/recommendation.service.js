const libraryService = require("./library.service");
const dealsService = require("./deals.service");

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_INACTIVITY_DAYS = 60;
const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 10;

function getRevivalQueue(user, limit = DEFAULT_LIMIT) {
  const saleAppIds = new Set(dealsService.getSales().map((deal) => deal.appid));
  const freeAppIds = new Set(
    dealsService.getFreeGames().map((deal) => deal.appid),
  );
  const resultLimit = clamp(Math.floor(Number(limit) || DEFAULT_LIMIT), 1, MAX_LIMIT);

  return libraryService
    .getUserLibrary(user)
    .filter(hasPlayHistory)
    .map((game) =>
      scoreGame(game, {
        isDiscounted: saleAppIds.has(game.appid),
        isFree: freeAppIds.has(game.appid),
      }),
    )
    .filter((game) => game.days_since_played >= MIN_INACTIVITY_DAYS)
    .sort(
      (a, b) =>
        b.revivalScore - a.revivalScore ||
        b.days_since_played - a.days_since_played ||
        b.playtime_minutes - a.playtime_minutes,
    )
    .slice(0, resultLimit);
}

function scoreGame(game, availability = {}) {
  const daysSincePlayed = getDaysSincePlayed(game.last_played_at);
  const playtimeHours = getPlaytimeHours(game);
  const popularity = clamp(Number(game.popularity) || 0, 0, 100);
  const isDiscounted = Boolean(availability.isDiscounted);
  const isFree = Boolean(availability.isFree);

  const scoreBreakdown = {
    playtime: Math.min(playtimeHours / 200, 1) * 40,
    inactivity: Math.min(daysSincePlayed / 365, 1) * 35,
    popularity: (popularity / 100) * 15,
    availability: isDiscounted || isFree ? 10 : 0,
  };
  const revivalScore = clamp(
    Math.round(Object.values(scoreBreakdown).reduce((sum, score) => sum + score, 0)),
    0,
    100,
  );

  return {
    ...game,
    days_since_played: daysSincePlayed,
    is_discounted: isDiscounted,
    is_free: isFree,
    revivalScore,
    revival_score: revivalScore,
    reason: buildReason({
      playtimeHours,
      daysSincePlayed,
      popularity,
      isDiscounted,
      isFree,
    }),
  };
}

function hasPlayHistory(game) {
  return (
    Number(game.playtime_minutes) > 0 &&
    Boolean(game.last_played_at) &&
    Number.isFinite(new Date(game.last_played_at).getTime())
  );
}

function getDaysSincePlayed(lastPlayedAt) {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(lastPlayedAt).getTime()) / DAY_MS),
  );
}

function getPlaytimeHours(game) {
  const hours = Number(game.playtime_hours);

  if (Number.isFinite(hours)) {
    return Math.max(0, hours);
  }

  return Math.max(0, Number(game.playtime_minutes) || 0) / 60;
}

function buildReason(details) {
  const years = details.daysSincePlayed / 365;
  const inactivity =
    years >= 1
      ? `you have not played it for about ${years.toFixed(1)} years`
      : `you have not played it for about ${details.daysSincePlayed} days`;
  const reasons = [
    `you previously invested ${formatHours(details.playtimeHours)} hours`,
    inactivity,
  ];

  if (details.popularity >= 90) {
    reasons.push("it is a recognizable community favorite");
  }

  if (details.isFree) {
    reasons.push("it is currently free");
  } else if (details.isDiscounted) {
    reasons.push("it is currently discounted");
  }

  return `Worth another look because ${reasons.join(", ")}.`;
}

function formatHours(hours) {
  return Number.isInteger(hours) ? hours : Number(hours.toFixed(1));
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

module.exports = {
  getRevivalQueue,
  scoreGame,
};
