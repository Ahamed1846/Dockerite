const docker = require("../config/docker");

module.exports = {
  listVolumes: async () => {
    const res = await docker.listVolumes();
    return res.Volumes || [];
  },

  inspectVolume: async (name) => {
    const volume = docker.getVolume(name);
    return await volume.inspect();
  },

  createVolume: async (data) => {
    return await docker.createVolume({
      Name: data.name,
      Driver: data.driver || "local",
      Labels: data.labels || {},
      DriverOpts: data.options || {}
    });
  },

  removeVolume: async (name) => {
    const volume = docker.getVolume(name);
    return await volume.remove();
  },

  pruneVolumes: async () => {
    return await docker.pruneVolumes();
  }
};
