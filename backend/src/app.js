const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// API Routes
const containerRoutes = require("./routes/containerRoutes");
const imageRoutes = require("./routes/imageRoutes");
const systemRoutes = require("./routes/systemRoutes");
const volumeRoutes = require("./routes/volumeRoutes");
const networkRoutes = require("./routes/networkRoutes");

app.use("/api/containers", containerRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/volumes", volumeRoutes);
app.use("/api/networks", networkRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Dockerite backend is running" });
});

// Serve static files from the public directory (built frontend)
app.use(express.static(path.join(__dirname, "../public")));

// SPA fallback - send index.html for all non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
