const docker = require("../config/docker");

const systemService = {
  async getInfo() {
    return await docker.info();
  },

  async getVersion() {
    return await docker.version();
  },

  async getSummary() {
    const info = await docker.info();

    return {
      containers: info.Containers,
      running: info.ContainersRunning,
      paused: info.ContainersPaused,
      stopped: info.ContainersStopped,
      images: info.Images,
      os: info.OperatingSystem,
      kernel: info.KernelVersion,
      arch: info.Architecture,
      memTotal: info.MemTotal,
      dockerRootDir: info.DockerRootDir,
      driver: info.Driver,
    };
  }
};

module.exports = systemService;
