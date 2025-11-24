const express = require("express");
const router = express.Router();
const containerController = require("../controllers/containerController");

// List all containers
router.get("/", containerController.list);

// Inspect container
router.get("/:id", containerController.inspect);

// Start container
router.post("/:id/start", containerController.start);

// Stop container
router.post("/:id/stop", containerController.stop);

// Restart container
router.post("/:id/restart", containerController.restart);

// Remove container
router.delete("/:id", containerController.remove);

// Create new container
router.post("/create", containerController.create);

module.exports = router;
