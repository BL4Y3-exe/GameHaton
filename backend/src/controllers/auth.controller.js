const jwt = require("jsonwebtoken");
const env = require("../config/env");
const demoService = require("../services/demo.service");
const { sendSuccess, sendError } = require("../utils/response");

function demoLogin(req, res) {
  const user = demoService.getOrCreateDemoUser();
  const token = jwt.sign(
    {
      sub: user.id,
      displayName: user.display_name,
      isDemo: true,
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  );

  return sendSuccess(res, { token, user });
}

function startSteamLogin(req, res) {
  return sendError(
    res,
    "Steam login is not configured in the mock MVP yet",
    "STEAM_NOT_CONFIGURED",
    501,
  );
}

function steamCallback(req, res) {
  return sendError(
    res,
    "Steam callback is not configured in the mock MVP yet",
    "STEAM_NOT_CONFIGURED",
    501,
  );
}

module.exports = { demoLogin, startSteamLogin, steamCallback };
