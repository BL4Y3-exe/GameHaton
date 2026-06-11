const express = require("express");
const { sendSuccess } = require("../utils/response");

const router = express.Router();

router.get("/", (req, res) =>
  sendSuccess(res, {
    status: "ok",
    service: "gamehaton-backend",
    timestamp: new Date().toISOString(),
  }),
);

module.exports = router;
