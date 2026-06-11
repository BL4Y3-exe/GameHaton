const { sendError } = require("../utils/response");

function notFoundHandler(req, res) {
  return sendError(
    res,
    `Route ${req.method} ${req.originalUrl} not found`,
    "ROUTE_NOT_FOUND",
    404,
  );
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);

  return sendError(
    res,
    error.message || "Unexpected server error",
    error.code || "INTERNAL_SERVER_ERROR",
    error.statusCode || 500,
  );
}

module.exports = { notFoundHandler, errorHandler };
