const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// API Routes
const containerRoutes = require("./routes/containerRoutes");
const imageRoutes = require("./routes/imageRoutes");
const systemRoutes = require("./routes/systemRoutes");

app.use("/api/containers", containerRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/system", systemRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Dockerite backend is running" });
});

module.exports = app;
