const express = require("express");
const authController = require("../controllers/auth.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/demo", authController.demoLogin);
router.get("/steam", authController.startSteamLogin);
router.get("/steam/callback", asyncHandler(authController.steamCallback));

module.exports = router;
