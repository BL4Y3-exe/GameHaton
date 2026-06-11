const express = require("express");
const libraryController = require("../controllers/library.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, libraryController.getLibrary);
router.post("/sync", requireAuth, libraryController.syncLibrary);

module.exports = router;
