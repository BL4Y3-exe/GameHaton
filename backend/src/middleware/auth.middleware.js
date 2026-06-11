const jwt = require("jsonwebtoken");
const env = require("../config/env");
const userService = require("../services/user.service");
const { sendError } = require("../utils/response");

async function requireAuth(req, res, next) {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return sendError(
      res,
      "Authentication token is required",
      "AUTH_REQUIRED",
      401,
    );
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await userService.getUserById(payload.sub);

    if (!user) {
      return sendError(res, "User not found", "USER_NOT_FOUND", 401);
    }

    req.auth = payload;
    req.user = user;
    return next();
  } catch (error) {
    if (error.code === "SUPABASE_ERROR") {
      return next(error);
    }

    const code =
      error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN";
    return sendError(res, "Invalid or expired token", code, 401);
  }
}

module.exports = { requireAuth };
