const demoService = require("./demo.service");

const CACHE_TTL_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 5000;
const CHEAPSHARK_URL =
  "https://www.cheapshark.com/api/1.0/deals?storeID=1&sortBy=Savings&pageSize=20";
const GAMERPOWER_URL =
  "https://www.gamerpower.com/api/giveaways?type=game&sort-by=popularity";

const cache = {
  freeGames: null,
  sales: null,
};

function getFreeGames() {
  return cache.freeGames?.items || getMockFreeGames();
}

function getSales() {
  return cache.sales?.items || getMockSales();
}

async function getCurrentFreeGames(options = {}) {
  return getCurrentDeals({
    cacheKey: "freeGames",
    url: GAMERPOWER_URL,
    normalize: normalizeGamerPowerGame,
    fallback: getMockFreeGames,
    externalSource: "GamerPower",
    options,
  });
}

async function getCurrentSales(options = {}) {
  return getCurrentDeals({
    cacheKey: "sales",
    url: CHEAPSHARK_URL,
    normalize: normalizeCheapSharkDeal,
    fallback: getMockSales,
    externalSource: "CheapShark",
    options,
  });
}

async function getCurrentDeals(config) {
  const cached = cache[config.cacheKey];
  const now = Date.now();

  if (
    !config.options.forceRefresh &&
    cached &&
    now - cached.cachedAt < CACHE_TTL_MS
  ) {
    return { items: cached.items, source: cached.source, cached: true };
  }

  try {
    const payload = await fetchJson(config.url, config.options.fetchImpl);
    const items = payload
      .map(config.normalize)
      .filter(Boolean)
      .slice(0, 20);

    if (items.length === 0) {
      throw new Error(`${config.externalSource} returned no usable games`);
    }

    cache[config.cacheKey] = {
      items,
      source: config.externalSource,
      cachedAt: now,
    };

    return { items, source: config.externalSource, cached: false };
  } catch (error) {
    const items = config.fallback();
    cache[config.cacheKey] = {
      items,
      source: "mock",
      cachedAt: now,
    };

    return {
      items,
      source: "mock",
      cached: false,
      fallbackReason: error.message,
    };
  }
}

async function fetchJson(url, fetchImpl = global.fetch) {
  if (typeof fetchImpl !== "function") {
    throw new Error("Fetch API is unavailable");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetchImpl(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Encore/0.1",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`External API returned HTTP ${response.status}`);
    }

    const payload = await response.json();

    if (!Array.isArray(payload)) {
      throw new Error("External API returned an invalid response");
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeCheapSharkDeal(deal) {
  const appid = toInteger(deal.steamAppID);

  if (!appid || !deal.title) {
    return null;
  }

  const originalPrice = toPrice(deal.normalPrice);
  const currentPrice = toPrice(deal.salePrice);

  return {
    appid,
    name: deal.title,
    image:
      deal.thumb ||
      `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
    originalPrice,
    currentPrice,
    discountPercent: clamp(
      Math.round(Number(deal.savings) || calculateDiscount(originalPrice, currentPrice)),
      0,
      100,
    ),
    isFree: currentPrice === 0,
    source: "CheapShark",
    storeUrl: deal.dealID
      ? `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(deal.dealID)}`
      : `https://store.steampowered.com/app/${appid}`,
  };
}

function normalizeGamerPowerGame(game) {
  if (!game.id || !game.title) {
    return null;
  }

  const steamAppId = extractSteamAppId(
    game.open_giveaway_url,
    game.gamerpower_url,
  );
  const originalPrice = toPrice(game.worth);

  return {
    appid: steamAppId || `gamerpower-${game.id}`,
    name: game.title,
    image: game.image || game.thumbnail || null,
    originalPrice,
    currentPrice: 0,
    discountPercent: originalPrice > 0 ? 100 : 0,
    isFree: true,
    source: "GamerPower",
    storeUrl:
      game.open_giveaway_url ||
      game.gamerpower_url ||
      `https://www.gamerpower.com/open/giveaway/${game.id}`,
  };
}

function getMockFreeGames() {
  return demoService.getFreeGames().map((deal) =>
    normalizeMockDeal(deal, true),
  );
}

function getMockSales() {
  return demoService.getSales().map((deal) => normalizeMockDeal(deal, false));
}

function normalizeMockDeal(deal, isFree) {
  return {
    appid: deal.appid,
    name: deal.name,
    image: deal.image,
    originalPrice: toPrice(deal.normal_price),
    currentPrice: toPrice(deal.sale_price),
    discountPercent: clamp(Number(deal.savings_percent) || 0, 0, 100),
    isFree,
    source: "mock",
    storeUrl: deal.store_url,
  };
}

function extractSteamAppId(...urls) {
  for (const url of urls) {
    const match = String(url || "").match(/store\.steampowered\.com\/app\/(\d+)/i);

    if (match) {
      return Number(match[1]);
    }
  }

  return null;
}

function toInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function toPrice(value) {
  const number = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) && number >= 0
    ? Number(number.toFixed(2))
    : 0;
}

function calculateDiscount(originalPrice, currentPrice) {
  if (originalPrice <= 0 || currentPrice >= originalPrice) {
    return 0;
  }

  return ((originalPrice - currentPrice) / originalPrice) * 100;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function clearCache() {
  cache.freeGames = null;
  cache.sales = null;
}

module.exports = {
  getFreeGames,
  getSales,
  getCurrentFreeGames,
  getCurrentSales,
  normalizeCheapSharkDeal,
  normalizeGamerPowerGame,
  clearCache,
};
