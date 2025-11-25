const express = require("express");
const router = express.Router();
const networkController = require("../controllers/networkController");

router.get("/", networkController.listNetworks);
router.get("/:id", networkController.inspectNetwork);
router.post("/create", networkController.createNetwork);
router.delete("/:id", networkController.removeNetwork);
router.post("/prune", networkController.pruneNetworks);

module.exports = router;
