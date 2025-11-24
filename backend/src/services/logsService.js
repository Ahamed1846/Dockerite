const docker = require("../config/docker");

const logsService = {
  streamLogs(id, onData, onError, onClose) {
    const container = docker.getContainer(id);

    container.logs(
      {
        follow: true,
        stdout: true,
        stderr: true,
        tail: 100, // last 100 lines
      },
      (err, stream) => {
        if (err) {
          onError(err);
          return;
        }

        stream.on("data", (chunk) => {
          const text = chunk.toString("utf-8");
          onData(text);
        });

        stream.on("error", (error) => {
          onError(error);
        });

        stream.on("end", () => {
          onClose();
        });
      }
    );
  },
};

module.exports = logsService;
