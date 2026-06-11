function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

function sendError(
  res,
  message,
  code = "INTERNAL_SERVER_ERROR",
  statusCode = 500,
) {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
    },
  });
}

module.exports = { sendSuccess, sendError };
