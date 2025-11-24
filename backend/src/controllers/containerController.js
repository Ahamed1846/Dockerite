const containerService = require("../services/containerService");

const containerController = {
  // GET /api/containers
  async list(req, res) {
    try {
      const containers = await containerService.listContainers();
      res.json(containers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to list containers" });
    }
  },

  // GET /api/containers/:id
  async inspect(req, res) {
    try {
      const { id } = req.params;
      const data = await containerService.inspectContainer(id);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to inspect container" });
    }
  },

  // POST /api/containers/:id/start
  async start(req, res) {
    try {
      const { id } = req.params;
      await containerService.startContainer(id);
      res.json({ message: "Container started" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to start container" });
    }
  },

  // POST /api/containers/:id/stop
  async stop(req, res) {
    try {
      const { id } = req.params;
      await containerService.stopContainer(id);
      res.json({ message: "Container stopped" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to stop container" });
    }
  },

  // POST /api/containers/:id/restart
  async restart(req, res) {
    try {
      const { id } = req.params;
      await containerService.restartContainer(id);
      res.json({ message: "Container restarted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to restart container" });
    }
  },

  // DELETE /api/containers/:id
  async remove(req, res) {
    try {
      const { id } = req.params;
      await containerService.removeContainer(id);
      res.json({ message: "Container removed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to remove container" });
    }
  },

  // POST /api/containers/create
  async create(req, res) {
    try {
      const config = req.body;
      const container = await containerService.createContainer(config);
      res.json({ message: "Container created", id: container.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create container" });
    }
  }
};

module.exports = containerController;
