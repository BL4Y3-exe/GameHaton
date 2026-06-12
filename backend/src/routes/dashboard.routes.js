const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/summary",
  requireAuth,
  asyncHandler(dashboardController.getSummary),
);

module.exports = router;
