const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket controllers
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  require("./controllers/logsController")(io, socket);
  require("./controllers/statsController")(io, socket);
  require("./controllers/imageController").pull(io, socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Dockerite backend running at http://localhost:${PORT}`);
});
