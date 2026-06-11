const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function parseBoolean(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === "true";
}

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  jwtSecret: process.env.JWT_SECRET || "change_me",
  steamApiKey: process.env.STEAM_API_KEY || "",
  steamReturnUrl:
    process.env.STEAM_RETURN_URL ||
    "http://localhost:5000/api/auth/steam/callback",
  useMockSteam: parseBoolean(process.env.USE_MOCK_STEAM, true),
};

if (env.nodeEnv === "production" && env.jwtSecret === "change_me") {
  throw new Error("JWT_SECRET must be set to a secure value in production");
}

module.exports = env;
