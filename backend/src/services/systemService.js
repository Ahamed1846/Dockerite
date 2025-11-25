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
  const volumes = await docker.listVolumes();
  const networks = await docker.listNetworks();

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
    volumes: volumes.Volumes ? volumes.Volumes.length : 0,
    networks: networks.length,
  };
}

};

module.exports = systemService;
