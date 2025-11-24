const docker = require("../config/docker");

const imageService = {
  // List images
  async listImages() {
    return await docker.listImages();
  },

  // Remove image
  async removeImage(id) {
    const image = docker.getImage(id);
    return await image.remove();
  },

  // Pull image (stream progress)
  pullImage(imageName, onProgress, onError, onDone) {
    docker.pull(imageName, (err, stream) => {
      if (err) {
        onError(err);
        return;
      }

      docker.modem.followProgress(
        stream,
        (err, output) => {
          if (err) onError(err);
          else onDone(output);
        },
        (event) => {
          // Each progress event
          onProgress(event);
        }
      );
    });
  }
};

module.exports = imageService;
