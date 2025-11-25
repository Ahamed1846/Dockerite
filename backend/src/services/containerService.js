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
  // Create new container (advanced)
  async createContainer(config) {
    const {
      name,
      image,
      ports = [],
      env = [],
      volumes = [],
      network,
      restartPolicy = "no",
      command,
      entrypoint,
      cpuLimit,
      memoryLimit,
      autoStart = true,
    } = config;

    // Build Docker API structures

    // 1. Ports
    const ExposedPorts = {};
    const PortBindings = {};

    ports.forEach((p) => {
      if (!p.container || !p.host) return;

      const key = `${p.container}/tcp`;
      ExposedPorts[key] = {};
      PortBindings[key] = [{ HostPort: p.host.toString() }];
    });

    // 2. Env Vars
    const Env = env
      .filter((e) => e.key && e.value)
      .map((e) => `${e.key}=${e.value}`);

    // 3. Volumes
    const Binds = volumes
      .filter((v) => v.host && v.container)
      .map((v) => `${v.host}:${v.container}`);

    // 4. Network config
    let NetworkingConfig = {};
    if (network) {
      NetworkingConfig = {
        EndpointsConfig: {
          [network]: {},
        },
      };
    }

    // 5. CPU & Memory Limits
    const HostConfig = {
      PortBindings,
      Binds,
      RestartPolicy: {
        Name: restartPolicy,
      },
    };

    if (cpuLimit) {
      // CPU % → convert to nanocpus: e.g., 50% → 0.5 CPU → 500000000
      HostConfig.NanoCpus = Math.floor((cpuLimit / 100) * 1e9);
    }

    if (memoryLimit) {
      // Convert MB → bytes
      HostConfig.Memory = memoryLimit * 1024 * 1024;
    }

    // Build final container config
    const containerConfig = {
      name,
      Image: image,
      ExposedPorts,
      Env,
      HostConfig,
      NetworkingConfig,
    };

    if (command) containerConfig.Cmd = this.parseArrayOrString(command);
    if (entrypoint)
      containerConfig.Entrypoint = this.parseArrayOrString(entrypoint);

    // Create container
    const container = await docker.createContainer(containerConfig);

    // Auto-start
    if (autoStart) {
      await container.start();
    }

    return container;
  },

  // Helper: allow user to type "npm start" or ["npm", "start"]
  parseArrayOrString(value) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    return value.split(" ");
  },
};

module.exports = containerService;
