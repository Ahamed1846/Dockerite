const imageService = require("../services/imageService");

const imageController = {
  async list(req, res) {
    try {
      const images = await imageService.listImages();
      res.json(images);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to list images" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await imageService.removeImage(id);
      res.json({ message: "Image removed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to remove image" });
    }
  },

  // Pull image using Socket.IO for progress
  pull(io, socket) {
    socket.on("image:pull", ({ imageName }) => {
      console.log("Pulling image:", imageName);

      imageService.pullImage(
        imageName,
        (progressEvent) => {
          socket.emit("image:progress", progressEvent);
        },
        (error) => {
          socket.emit("image:error", error.message || "Error pulling image");
        },
        () => {
          socket.emit("image:done", { message: "Image pulled successfully" });
        }
      );
    });
  }
};

module.exports = imageController;
