const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

// List all images
router.get("/", imageController.list);

// Remove an image
router.delete("/:id", imageController.remove);

module.exports = router;
