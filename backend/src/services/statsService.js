const docker = require("../config/docker");

const statsService = {
  streamStats(id, onData, onError, onClose) {
    const container = docker.getContainer(id);

    container.stats({ stream: true }, (err, stream) => {
      if (err) {
        onError(err);
        return;
      }

      stream.on("data", (chunk) => {
        try {
          const raw = JSON.parse(chunk.toString());

          // Format metrics cleanly
          const cpuDelta =
            raw.cpu_stats.cpu_usage.total_usage -
            raw.precpu_stats.cpu_usage.total_usage;

          const systemDelta =
            raw.cpu_stats.system_cpu_usage -
            raw.precpu_stats.system_cpu_usage;

          const cpuPercent =
            systemDelta > 0 ? (cpuDelta / systemDelta) * raw.cpu_stats.online_cpus * 100 : 0;

          const memUsage = raw.memory_stats.usage || 0;
          const memLimit = raw.memory_stats.limit || 1;

          const memoryPercent = (memUsage / memLimit) * 100;

          const stats = {
            cpu: cpuPercent.toFixed(2),
            memory: {
              usage: memUsage,
              limit: memLimit,
              percent: memoryPercent.toFixed(2),
            },
            network: raw.networks ? raw.networks : {},
          };

          onData(stats);
        } catch (error) {
          onError(error);
        }
      });

      stream.on("error", (err) => {
        onError(err);
      });

      stream.on("end", () => {
        onClose();
      });
    });
  },
};

module.exports = statsService;
