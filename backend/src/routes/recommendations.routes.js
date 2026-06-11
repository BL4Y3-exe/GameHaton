const express = require("express");
const recommendationsController = require("../controllers/recommendations.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/",
  requireAuth,
  recommendationsController.getRevivalQueue,
);

module.exports = router;
