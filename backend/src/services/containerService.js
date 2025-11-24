const docker = require("../config/docker");

const containerService = {
  // List all containers (running + stopped)
  async listContainers() {
    return await docker.listContainers({ all: true });
  },

  // Get container details
  async inspectContainer(id) {
    const container = docker.getContainer(id);
    return await container.inspect();
  },

  // Start container
  async startContainer(id) {
    const container = docker.getContainer(id);
    return await container.start();
  },

  // Stop container
  async stopContainer(id) {
    const container = docker.getContainer(id);
    return await container.stop();
  },

  // Restart container
  async restartContainer(id) {
    const container = docker.getContainer(id);
    return await container.restart();
  },

  // Remove container
  async removeContainer(id) {
    const container = docker.getContainer(id);
    return await container.remove({ force: true });
  },

  // Create new container
  async createContainer(config) {
    const container = await docker.createContainer(config);
    await container.start();
    return container;
  },
};

module.exports = containerService;
