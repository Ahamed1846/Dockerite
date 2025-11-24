const systemService = require("../services/systemService");

const systemController = {
  async getInfo(req, res) {
    try {
      const data = await systemService.getInfo();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get system info" });
    }
  },

  async getVersion(req, res) {
    try {
      const data = await systemService.getVersion();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get version info" });
    }
  },

  async getSummary(req, res) {
    try {
      const data = await systemService.getSummary();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get summary info" });
    }
  }
};

module.exports = systemController;
