import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function useImagePull() {
  const [progress, setProgress] = useState([]);
  const [done, setDone] = useState(false);

  const pullImage = (imageName) => {
    setProgress([]);
    setDone(false);

    socket.emit("image:pull", { imageName });

    socket.on("image:progress", (event) => {
      setProgress((prev) => [...prev, event]);
    });

    socket.on("image:done", () => {
      setDone(true);
    });
  };

  useEffect(() => {
    return () => {
      socket.off("image:progress");
      socket.off("image:done");
    };
  }, []);

  return { progress, done, pullImage };
}
