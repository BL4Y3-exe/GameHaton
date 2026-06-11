const jwt = require("jsonwebtoken");
const env = require("../config/env");
const supabase = require("../config/supabase");
const demoService = require("../services/demo.service");
const steamService = require("../services/steam.service");
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
  if (!supabase.isSupabaseConfigured()) {
    return sendError(
      res,
      "Steam login requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_NOT_CONFIGURED",
      503,
    );
  }

  return res.redirect(steamService.getLoginUrl());
}

async function steamCallback(req, res) {
  try {
    if (!supabase.isSupabaseConfigured()) {
      throw createError(
        "Steam login requires Supabase configuration",
        "SUPABASE_NOT_CONFIGURED",
        503,
      );
    }

    const steamId = await steamService.verifyOpenIdCallback(req.query);
    const profile = await steamService.getPlayerProfile(steamId);
    const user = await supabase.upsertSteamUser(profile);
    const token = jwt.sign(
      {
        sub: user.id,
        steamId: user.steam_id,
        displayName: user.display_name,
        isDemo: false,
      },
      env.jwtSecret,
      { expiresIn: "7d" },
    );
    const redirectUrl = new URL(env.frontendUrl);
    redirectUrl.searchParams.set("token", token);

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    const redirectUrl = new URL(env.frontendUrl);
    redirectUrl.searchParams.set(
      "steam_error",
      error.code || "STEAM_AUTH_FAILED",
    );
    return res.redirect(redirectUrl.toString());
  }
}

function createError(message, code, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  demoLogin,
  startSteamLogin,
  steamCallback,
};
