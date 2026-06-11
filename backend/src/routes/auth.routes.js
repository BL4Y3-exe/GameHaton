const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/demo", authController.demoLogin);
router.get("/steam", authController.startSteamLogin);
router.get("/steam/callback", authController.steamCallback);

module.exports = router;
