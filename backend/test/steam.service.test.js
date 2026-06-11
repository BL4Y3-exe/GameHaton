const test = require("node:test");
const assert = require("node:assert/strict");
const steamService = require("../src/services/steam.service");

test("builds a Steam OpenID login URL", () => {
  const url = new URL(steamService.getLoginUrl());

  assert.equal(url.origin, "https://steamcommunity.com");
  assert.equal(url.pathname, "/openid/login");
  assert.equal(url.searchParams.get("openid.mode"), "checkid_setup");
  assert.equal(
    url.searchParams.get("openid.return_to"),
    "http://localhost:5000/api/auth/steam/callback",
  );
});

test("extracts only a valid 64-bit Steam ID", () => {
  assert.equal(
    steamService.extractSteamId(
      "https://steamcommunity.com/openid/id/76561198000000000",
    ),
    "76561198000000000",
  );
  assert.equal(steamService.extractSteamId("https://example.com/123"), null);
});

test("verifies a Steam OpenID callback", async () => {
  const steamId = await steamService.verifyOpenIdCallback(
    {
      "openid.mode": "id_res",
      "openid.op_endpoint": "https://steamcommunity.com/openid/login",
      "openid.return_to":
        "http://localhost:5000/api/auth/steam/callback",
      "openid.claimed_id":
        "https://steamcommunity.com/openid/id/76561198000000000",
      "openid.identity":
        "https://steamcommunity.com/openid/id/76561198000000000",
      "openid.sig": "signature",
    },
    {
      fetchImpl: async (url, options) => {
        assert.equal(url, "https://steamcommunity.com/openid/login");
        assert.match(String(options.body), /openid.mode=check_authentication/);

        return {
          ok: true,
          text: async () => "ns:http://specs.openid.net/auth/2.0\nis_valid:true\n",
        };
      },
    },
  );

  assert.equal(steamId, "76561198000000000");
});

test("rejects an invalid Steam verification response", async () => {
  await assert.rejects(
    steamService.verifyOpenIdCallback(
      {
        "openid.mode": "id_res",
        "openid.op_endpoint": "https://steamcommunity.com/openid/login",
        "openid.return_to":
          "http://localhost:5000/api/auth/steam/callback",
        "openid.claimed_id":
          "https://steamcommunity.com/openid/id/76561198000000000",
      },
      {
        fetchImpl: async () => ({
          ok: true,
          text: async () => "is_valid:false\n",
        }),
      },
    ),
    { code: "STEAM_AUTH_INVALID" },
  );
});
