const env = require("../config/env");

function getSteamStatus() {
  return {
    configured: Boolean(env.steamApiKey),
    mock_mode: env.useMockSteam,
  };
}

module.exports = { getSteamStatus };
