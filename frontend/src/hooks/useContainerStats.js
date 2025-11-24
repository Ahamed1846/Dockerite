import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function useContainerStats(id) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!id) return;

    socket.emit("stats:stream", { containerId: id });

    socket.on("stats:data", (data) => {
      setStats(data);
    });

    return () => {
      socket.off("stats:data");
    };
  }, [id]);

  return stats;
}
