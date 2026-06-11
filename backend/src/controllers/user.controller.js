const { sendSuccess } = require("../utils/response");

function getCurrentUser(req, res) {
  return sendSuccess(res, { user: req.user });
}

module.exports = { getCurrentUser };
