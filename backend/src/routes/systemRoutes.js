const express = require("express");
const router = express.Router();
const systemController = require("../controllers/systemController");

// Detailed docker info
router.get("/info", systemController.getInfo);

// Docker version
router.get("/version", systemController.getVersion);

// Dashboard summary
router.get("/summary", systemController.getSummary);

module.exports = router;
