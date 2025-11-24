const statsService = require("../services/statsService");

const statsController = (io, socket) => {
  socket.on("stats:stream", ({ containerId }) => {
    console.log("Starting stats stream for:", containerId);

    statsService.streamStats(
      containerId,
      (data) => {
        socket.emit("stats:data", data);
      },
      (error) => {
        socket.emit("stats:error", error.message || "Stats stream error");
      },
      () => {
        socket.emit("stats:end", "Stats stream ended");
      }
    );
  });
};

module.exports = statsController;
