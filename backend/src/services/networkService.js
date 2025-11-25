const docker = require("../config/docker");

module.exports = {
  listNetworks: async () => {
    return await docker.listNetworks();
  },

  inspectNetwork: async (id) => {
    const net = docker.getNetwork(id);
    return await net.inspect();
  },

  createNetwork: async (data) => {
    return await docker.createNetwork({
      Name: data.name,
      Driver: data.driver || "bridge",
      Attachable: true,
      Internal: data.internal || false,
      Labels: data.labels || {}
    });
  },

  removeNetwork: async (id) => {
    const net = docker.getNetwork(id);
    return await net.remove();
  },

  pruneNetworks: async () => {
    return await docker.pruneNetworks();
  }
};
