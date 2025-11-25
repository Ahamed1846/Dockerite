const express = require("express");
const router = express.Router();
const volumeController = require("../controllers/volumeController");

router.get("/", volumeController.listVolumes);
router.get("/:name", volumeController.inspectVolume);
router.post("/create", volumeController.createVolume);
router.delete("/:name", volumeController.removeVolume);
router.post("/prune", volumeController.pruneVolumes);

module.exports = router;
