const express = require("express");
const recommendationsController = require("../controllers/recommendations.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(recommendationsController.getRevivalQueue),
);

module.exports = router;
