import { useParams, Link } from "react-router-dom";
import useLogs from "../hooks/useLogs";
import { useEffect, useRef, useState } from "react";
import { Scroll, Trash2, Terminal } from "lucide-react";

export default function Logs() {
  const { id } = useParams();
  const logs = useLogs(id);

  const bottomRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [localLogs, setLocalLogs] = useState([]);

  useEffect(() => {
    setLocalLogs(logs);
  }, [logs]);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [localLogs, autoScroll]);

  // Color parsing
  const colorize = (line) => {
    const lower = line.toLowerCase();

    if (lower.includes("error") || lower.includes("fail")) {
      return "text-red-400";
    }
    if (lower.includes("warn")) {
      return "text-yellow-400";
    }
    if (lower.includes("info")) {
      return "text-blue-400";
    }
    return "text-green-400"; // default log color
  };

  return (
    <div className="text-[var(--txt-primary)]">
      <Link
        to={`/containers/${id}`}
        className="text-blue-400 underline hover:text-blue-300"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-4 flex items-center gap-2">
        <Terminal size={28} />
        Container Logs
      </h1>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`px-4 py-2 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)]
            hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2`}
        >
          <Scroll size={18} />
          {autoScroll ? "Auto-scroll ON" : "Auto-scroll OFF"}
        </button>

        <button
          onClick={() => setLocalLogs([])}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <Trash2 size={18} />
          Clear Logs
        </button>
      </div>

      {/* Terminal */}
      <div className="bg-[#0c0c12] rounded border border-[var(--border-color)] p-4 h-[70vh] overflow-auto font-mono text-sm">
        
        {/* Sticky header */}
        <div className="sticky top-0 bg-[#0c0c12] pb-2 mb-2 border-b border-[var(--border-color)] text-gray-400">
          Live Logs — {localLogs.length} lines
        </div>

        {localLogs.map((line, i) => (
          <div key={i} className={colorize(line)}>
            {line}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
