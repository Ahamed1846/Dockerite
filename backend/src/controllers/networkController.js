const networkService = require("../services/networkService");

module.exports = {
  listNetworks: async (req, res) => {
    try {
      const networks = await networkService.listNetworks();
      res.json(networks);
    } catch (err) {
      console.error("Error listing networks:", err);
      res.status(500).json({ error: "Failed to list networks" });
    }
  },

  inspectNetwork: async (req, res) => {
    try {
      const { id } = req.params;
      const net = await networkService.inspectNetwork(id);
      res.json(net);
    } catch (err) {
      console.error("Error inspecting network:", err);
      res.status(500).json({ error: "Failed to inspect network" });
    }
  },

  createNetwork: async (req, res) => {
    try {
      const data = await networkService.createNetwork(req.body);
      res.json({ message: "Network created", data });
    } catch (err) {
      console.error("Error creating network:", err);
      res.status(500).json({ error: "Failed to create network" });
    }
  },

  removeNetwork: async (req, res) => {
    try {
      const { id } = req.params;
      await networkService.removeNetwork(id);
      res.json({ message: "Network removed" });
    } catch (err) {
      console.error("Error removing network:", err);
      res.status(500).json({ error: "Failed to remove network" });
    }
  },

  pruneNetworks: async (req, res) => {
    try {
      const data = await networkService.pruneNetworks();
      res.json(data);
    } catch (err) {
      console.error("Error pruning networks:", err);
      res.status(500).json({ error: "Failed to prune networks" });
    }
  }
};
