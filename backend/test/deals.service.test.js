const test = require("node:test");
const assert = require("node:assert/strict");
const dealsService = require("../src/services/deals.service");

test("normalizes a CheapShark sale", () => {
  const deal = dealsService.normalizeCheapSharkDeal({
    steamAppID: "292030",
    title: "The Witcher 3",
    normalPrice: "39.99",
    salePrice: "7.99",
    savings: "80.020005",
    thumb: "https://example.com/witcher.jpg",
    dealID: "deal/123",
  });

  assert.deepEqual(deal, {
    appid: 292030,
    name: "The Witcher 3",
    image: "https://example.com/witcher.jpg",
    originalPrice: 39.99,
    currentPrice: 7.99,
    discountPercent: 80,
    isFree: false,
    source: "CheapShark",
    storeUrl: "https://www.cheapshark.com/redirect?dealID=deal%2F123",
  });
});

test("normalizes a GamerPower giveaway", () => {
  const game = dealsService.normalizeGamerPowerGame({
    id: 42,
    title: "Free Weekend Game",
    worth: "$19.99",
    image: "https://example.com/game.jpg",
    open_giveaway_url: "https://store.steampowered.com/app/12345/example",
  });

  assert.deepEqual(game, {
    appid: 12345,
    name: "Free Weekend Game",
    image: "https://example.com/game.jpg",
    originalPrice: 19.99,
    currentPrice: 0,
    discountPercent: 100,
    isFree: true,
    source: "GamerPower",
    storeUrl: "https://store.steampowered.com/app/12345/example",
  });
});

test("returns normalized mock sales when CheapShark fails", async () => {
  dealsService.clearCache();
  const result = await dealsService.getCurrentSales({
    forceRefresh: true,
    fetchImpl: async () => {
      throw new Error("network unavailable");
    },
  });

  assert.equal(result.source, "mock");
  assert.ok(result.items.length > 0);
  assert.ok(
    result.items.every(
      (game) =>
        game.appid &&
        game.name &&
        "originalPrice" in game &&
        "currentPrice" in game &&
        "discountPercent" in game &&
        game.isFree === false &&
        game.source === "mock" &&
        game.storeUrl,
    ),
  );
});

test("returns normalized mock free games when GamerPower fails", async () => {
  dealsService.clearCache();
  const result = await dealsService.getCurrentFreeGames({
    forceRefresh: true,
    fetchImpl: async () => {
      throw new Error("network unavailable");
    },
  });

  assert.equal(result.source, "mock");
  assert.ok(result.items.length > 0);
  assert.ok(result.items.every((game) => game.isFree === true));
});
