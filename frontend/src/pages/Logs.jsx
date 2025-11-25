import { useParams, Link } from "react-router-dom";
import useLogs from "../hooks/useLogs";
import { useEffect, useRef, useState } from "react";
import { Scroll, Trash2, Terminal, ArrowLeft } from "lucide-react";

export default function Logs() {
  const { id } = useParams();
  const logs = useLogs(id);

  const bottomRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [localLogs, setLocalLogs] = useState([]);

  /* Sync logs from hook into local state */
  useEffect(() => {
    setLocalLogs(logs);
  }, [logs]);

  /* Auto-scroll logic */
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [localLogs, autoScroll]);

  /* Premium log colorization */
  const colorize = (line) => {
    const l = line.toLowerCase();

    if (l.includes("error") || l.includes("fail")) return "text-red-400";
    if (l.includes("warn")) return "text-yellow-300";
    if (l.includes("info")) return "text-blue-400";
    if (l.includes("http")) return "text-purple-300";

    return "text-[var(--txt-primary)]";
  };

  return (
    <div className="text-[var(--txt-primary)] space-y-8">

      {/* BACK */}
      <Link
        to={`/containers/${id}`}
        className="
          inline-flex items-center gap-2 text-[var(--txt-secondary)]
          hover:text-[var(--txt-primary)] transition
        "
      >
        <ArrowLeft size={18} />
        Back
      </Link>

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Terminal size={28} />
          Container Logs
        </h1>

        <span className="text-[var(--txt-secondary)]">
          Container ID: <span className="text-[var(--txt-primary)]">{id}</span>
        </span>
      </div>

      {/* CONTROL PANEL */}
      <div
        className="
          flex items-center gap-3
          bg-[var(--bg-secondary)]
          border border-[var(--border-color)]
          rounded-xl p-4 shadow-sm
        "
      >
        {/* Auto-scroll toggle */}
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className="
            px-4 py-2 rounded-lg border border-[var(--border-color)]
            bg-[var(--bg-primary)]
            hover:bg-[var(--bg-tertiary)] transition-all
            flex items-center gap-2 text-sm
          "
        >
          <Scroll size={16} />
          {autoScroll ? "Auto-scroll ON" : "Auto-scroll OFF"}
        </button>

        {/* Clear logs */}
        <button
          onClick={() => setLocalLogs([])}
          className="
            px-4 py-2 rounded-lg text-sm flex items-center gap-2
            bg-red-600/20 text-red-400
            border border-red-600/20
            hover:bg-red-600/30 transition-all
          "
        >
          <Trash2 size={16} />
          Clear
        </button>
      </div>

      {/* TERMINAL WINDOW */}
      <div
        className="
          rounded-2xl overflow-hidden shadow-lg
          border border-[var(--border-color)]
          bg-gradient-to-b from-[#0c0c12] to-[#0a0a0f]
        "
      >
        {/* Terminal header */}
        <div
          className="
            bg-[var(--bg-secondary)]
            border-b border-[var(--border-color)]
            p-3 flex items-center justify-between
          "
        >
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          <span className="text-xs text-[var(--txt-secondary)]">
            Live Logs — {localLogs.length} lines
          </span>

          <div className="opacity-0 w-6" />
        </div>

        {/* Terminal body */}
        <div
          className="
            h-[70vh] overflow-auto
            px-4 py-3 font-mono text-sm leading-relaxed
            text-[var(--txt-primary)]
            custom-scrollbar
          "
        >
          {localLogs.map((line, i) => (
            <div key={i} className={colorize(line)}>
              {line}
            </div>
          ))}

          {/* fake bottom cursor */}
          <div
            ref={bottomRef}
            className="mt-4 w-full h-[2px] bg-[var(--accent-blue)] opacity-40 rounded"
          />
        </div>
      </div>
    </div>
  );
}
