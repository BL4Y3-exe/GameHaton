const test = require("node:test");
const assert = require("node:assert/strict");
const env = require("../src/config/env");
const supabase = require("../src/config/supabase");

test("upserts a Steam user through Supabase REST", async () => {
  const originalUrl = env.supabaseUrl;
  const originalKey = env.supabaseServiceRoleKey;
  env.supabaseUrl = "https://example.supabase.co";
  env.supabaseServiceRoleKey = "service-role-key";

  try {
    const user = await supabase.upsertSteamUser(
      {
        steamId: "76561198000000000",
        displayName: "Test Player",
        avatarUrl: "https://example.com/avatar.jpg",
      },
      {
        fetchImpl: async (url, options) => {
          assert.equal(
            url.toString(),
            "https://example.supabase.co/rest/v1/users?on_conflict=steam_id",
          );
          assert.equal(options.method, "POST");
          assert.equal(options.headers.apikey, "service-role-key");
          assert.equal(
            options.headers.Prefer,
            "resolution=merge-duplicates,return=representation",
          );

          const body = JSON.parse(options.body);
          assert.equal(body.steam_id, "76561198000000000");
          assert.equal(body.display_name, "Test Player");
          assert.equal(body.is_demo, false);

          return {
            ok: true,
            json: async () => [
              {
                id: "00000000-0000-4000-8000-000000000099",
                ...body,
              },
            ],
          };
        },
      },
    );

    assert.equal(user.steam_id, "76561198000000000");
  } finally {
    env.supabaseUrl = originalUrl;
    env.supabaseServiceRoleKey = originalKey;
  }
});
