import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function useLogs(containerId) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!containerId) return;

    // Request logs stream
    socket.emit("logs:stream", { containerId });

    // When log data arrives
    socket.on("logs:data", (msg) => {
      setLogs((prev) => [...prev, msg]);
    });

    // Errors
    socket.on("logs:error", (err) => {
      setLogs((prev) => [...prev, `ERROR: ${err}`]);
    });

    // End event
    socket.on("logs:end", () => {
      setLogs((prev) => [...prev, "--- Log stream ended ---"]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("logs:data");
      socket.off("logs:error");
      socket.off("logs:end");
    };
  }, [containerId]);

  return logs;
}
