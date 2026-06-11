const express = require("express");
const dealsController = require("../controllers/deals.controller");

const router = express.Router();

router.get("/free-games", dealsController.getFreeGames);
router.get("/sales", dealsController.getSales);

module.exports = router;
