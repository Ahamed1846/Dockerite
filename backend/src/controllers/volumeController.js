const volumeService = require("../services/volumeService");

module.exports = {
  listVolumes: async (req, res) => {
    try {
      const volumes = await volumeService.listVolumes();
      res.json(volumes);
    } catch (err) {
      console.error("Error listing volumes:", err);
      res.status(500).json({ error: "Failed to list volumes" });
    }
  },

  inspectVolume: async (req, res) => {
    try {
      const { name } = req.params;
      const data = await volumeService.inspectVolume(name);
      res.json(data);
    } catch (err) {
      console.error("Error inspecting volume:", err);
      res.status(500).json({ error: "Failed to inspect volume" });
    }
  },

  createVolume: async (req, res) => {
    try {
      const data = await volumeService.createVolume(req.body);
      res.json({ message: "Volume created", data });
    } catch (err) {
      console.error("Error creating volume:", err);
      res.status(500).json({ error: "Failed to create volume" });
    }
  },

  removeVolume: async (req, res) => {
    try {
      const { name } = req.params;
      await volumeService.removeVolume(name);
      res.json({ message: "Volume removed" });
    } catch (err) {
      console.error("Error removing volume:", err);
      res.status(500).json({ error: "Failed to remove volume" });
    }
  },

  pruneVolumes: async (req, res) => {
    try {
      const data = await volumeService.pruneVolumes();
      res.json(data);
    } catch (err) {
      console.error("Error pruning volumes:", err);
      res.status(500).json({ error: "Failed to prune volumes" });
    }
  }
};
