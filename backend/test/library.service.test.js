const test = require("node:test");
const assert = require("node:assert/strict");
const libraryService = require("../src/services/library.service");

test("demo sync returns normalized mock games", async () => {
  const result = await libraryService.syncUserLibrary({
    id: "demo-user",
    is_demo: true,
  });

  assert.equal(result.source, "demo");
  assert.ok(result.syncedCount >= 12);
  assertNormalizedGames(result.games);
});

test("real Steam sync fetches and saves normalized games", async () => {
  const games = [
    {
      appid: 620,
      name: "Portal 2",
      image: "https://example.com/portal.jpg",
      playtimeMinutes: 1200,
      playtimeHours: 20,
      lastPlayedAt: "2025-01-01T00:00:00.000Z",
      genres: [],
      tags: [],
      storeUrl: "https://store.steampowered.com/app/620",
    },
  ];
  let savedGames;

  const result = await libraryService.syncUserLibrary(
    {
      id: "00000000-0000-4000-8000-000000000099",
      steam_id: "76561198000000000",
      is_demo: false,
    },
    {
      steamService: {
        getOwnedGames: async (steamId) => {
          assert.equal(steamId, "76561198000000000");
          return games;
        },
      },
      supabase: {
        upsertUserGames: async (userId, values) => {
          assert.equal(userId, "00000000-0000-4000-8000-000000000099");
          savedGames = values;
        },
      },
    },
  );

  assert.deepEqual(savedGames, games);
  assert.equal(result.source, "steam");
  assert.equal(result.syncedCount, 1);
});

test("loads and normalizes saved Supabase games", async () => {
  const games = await libraryService.getSavedUserLibrary(
    {
      id: "00000000-0000-4000-8000-000000000099",
      is_demo: false,
    },
    {
      supabase: {
        getUserGames: async () => [
          {
            appid: 620,
            name: "Portal 2",
            image: "https://example.com/portal.jpg",
            playtime_minutes: 1200,
            playtime_hours: "20.0",
            last_played_at: "2025-01-01T00:00:00.000Z",
            metadata: {
              genres: ["Puzzle"],
              tags: ["Co-op"],
              storeUrl: "https://store.steampowered.com/app/620",
            },
          },
        ],
      },
    },
  );

  assertNormalizedGames(games);
  assert.equal(
    games[0].image,
    "https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg",
  );
  assert.deepEqual(games[0].genres, ["Puzzle"]);
  assert.deepEqual(games[0].tags, ["Co-op"]);
});

function assertNormalizedGames(games) {
  assert.ok(games.length > 0);

  for (const game of games) {
    assert.deepEqual(Object.keys(game), [
      "appid",
      "name",
      "image",
      "playtimeMinutes",
      "playtimeHours",
      "lastPlayedAt",
      "genres",
      "tags",
      "storeUrl",
    ]);
  }
}
