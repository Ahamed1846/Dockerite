const logsService = require("../services/logsService");

const logsController = (io, socket) => {
  socket.on("logs:stream", ({ containerId }) => {
    console.log("Starting logs stream for:", containerId);

    logsService.streamLogs(
      containerId,
      (data) => {
        socket.emit("logs:data", data);
      },
      (error) => {
        socket.emit("logs:error", error.message || "Log stream error");
      },
      () => {
        socket.emit("logs:end", "Log stream ended");
      }
    );
  });
};

module.exports = logsController;
