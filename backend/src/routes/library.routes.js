const express = require("express");
const libraryController = require("../controllers/library.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", requireAuth, asyncHandler(libraryController.getLibrary));
router.post("/sync", requireAuth, asyncHandler(libraryController.syncLibrary));

module.exports = router;
