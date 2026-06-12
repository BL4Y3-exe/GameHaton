const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function parseBoolean(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === "true";
}

function normalizeUrl(value) {
  return value.replace(/\/+$/, "");
}

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: normalizeUrl(
    process.env.FRONTEND_URL || "http://localhost:5173",
  ),
  backendUrl: normalizeUrl(
    process.env.BACKEND_URL || "http://localhost:5000",
  ),
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  jwtSecret: process.env.JWT_SECRET || "change_me",
  steamApiKey: process.env.STEAM_API_KEY || "",
  steamReturnUrl: normalizeUrl(
    process.env.STEAM_RETURN_URL ||
      "http://localhost:5000/api/auth/steam/callback",
  ),
  useMockSteam: parseBoolean(process.env.USE_MOCK_STEAM, true),
};

if (env.nodeEnv === "production" && env.jwtSecret === "change_me") {
  throw new Error("JWT_SECRET must be set to a secure value in production");
}

if (env.nodeEnv === "production") {
  validateProductionUrl("FRONTEND_URL", env.frontendUrl);
  validateProductionUrl("BACKEND_URL", env.backendUrl);
  validateProductionUrl("STEAM_RETURN_URL", env.steamReturnUrl);

  const expectedSteamReturnUrl = `${env.backendUrl.replace(/\/$/, "")}/api/auth/steam/callback`;

  if (env.steamReturnUrl !== expectedSteamReturnUrl) {
    throw new Error(
      `STEAM_RETURN_URL must be ${expectedSteamReturnUrl} in production`,
    );
  }
}

function validateProductionUrl(name, value) {
  const url = new URL(value);

  if (url.protocol !== "https:") {
    throw new Error(`${name} must use HTTPS in production`);
  }

  if (
    (name === "FRONTEND_URL" || name === "BACKEND_URL") &&
    value !== url.origin
  ) {
    throw new Error(`${name} must be an origin without a path`);
  }
}

module.exports = env;
