const express = require("express");
const dealsController = require("../controllers/deals.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/free-games", asyncHandler(dealsController.getFreeGames));
router.get("/sales", asyncHandler(dealsController.getSales));

module.exports = router;
