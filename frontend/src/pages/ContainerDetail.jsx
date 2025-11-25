import { useParams, Link } from "react-router-dom";
import useContainerDetail from "../hooks/useContainerDetail";
import useContainerStats from "../hooks/useContainerStats";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Info,
  Cpu,
  Activity,
  Network,
  Settings,
  ArrowLeft,
} from "lucide-react";

import { useState, useEffect } from "react";

export default function ContainerDetail() {
  const { id } = useParams();
  const { container, loading } = useContainerDetail(id);
  const stats = useContainerStats(id);

  const [cpuHistory, setCpuHistory] = useState([]);
  const [memHistory, setMemHistory] = useState([]);

  /* ───────────────────────────────
        APPEND NEW POINTS
     ─────────────────────────────── */
  useEffect(() => {
    if (!stats) return;

    const now = Date.now();

    setCpuHistory((prev) => [
      ...prev.slice(-30),
      { time: now, cpu: stats.cpu },
    ]);

    setMemHistory((prev) => [
      ...prev.slice(-30),
      { time: now, mem: stats.memory.percent },
    ]);
  }, [stats]);

  /* ───────────────────────────────
        LOADING / NOT FOUND
     ─────────────────────────────── */
  if (loading)
    return <div className="p-10 text-xl text-[var(--txt-secondary)]">Loading...</div>;

  if (!container)
    return (
      <div className="p-10 text-[var(--txt-secondary)]">
        No container found.
      </div>
    );

  /* ───────────────────────────────
        SECTION CARD COMPONENT
     ─────────────────────────────── */
  function SectionCard({ icon, title, children }) {
    return (
      <div
        className="
          bg-[var(--bg-secondary)]
          border border-[var(--border-color)]
          rounded-2xl p-6 shadow-sm
        "
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="
              w-10 h-10 rounded-lg
              bg-[var(--bg-primary)]
              border border-[var(--border-color)]
              flex items-center justify-center
            "
          >
            {icon}
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--txt-primary)]">
            {title}
          </h2>
        </div>

        <div className="space-y-2 text-[var(--txt-secondary)] text-sm">
          {children}
        </div>
      </div>
    );
  }

  /* ───────────────────────────────
        STATUS BADGE
     ─────────────────────────────── */
  const statusBadge =
    container.State.Status === "running"
      ? "bg-green-500/10 text-green-400 border border-green-600/30"
      : "bg-red-500/10 text-red-400 border border-red-600/30";

  /* ───────────────────────────────
        PAGE LAYOUT
     ─────────────────────────────── */
  return (
    <div className="text-[var(--txt-primary)] space-y-10 pb-20">

      {/* BACK LINK */}
      <Link
        to="/containers"
        className="
          inline-flex items-center gap-2 text-[var(--txt-secondary)]
          hover:text-[var(--txt-primary)] transition
        "
      >
        <ArrowLeft size={18} />
        Back
      </Link>

      {/* HEADER */}
      <div
        className="
          bg-[var(--bg-secondary)]
          border border-[var(--border-color)]
          rounded-2xl p-8 shadow-sm flex items-center justify-between
        "
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Settings size={28} />
            {container.Name.replace("/", "")}
          </h1>

          <p className="text-[var(--txt-secondary)] mt-1">
            Detailed statistics and configuration.
          </p>
        </div>

        <span
          className={`
            px-5 py-2 text-sm rounded-full font-medium ${statusBadge}
          `}
        >
          {container.State.Status.toUpperCase()}
        </span>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* GENERAL INFO */}
        <SectionCard icon={<Info size={20} />} title="General Information">
          <p><strong className="text-[var(--txt-primary)]">ID:</strong> {container.Id}</p>
          <p><strong className="text-[var(--txt-primary)]">Image:</strong> {container.Config.Image}</p>
          <p><strong className="text-[var(--txt-primary)]">Created:</strong> {new Date(container.Created).toLocaleString()}</p>
          <p>
            <strong className="text-[var(--txt-primary)]">Restart Policy:</strong>{" "}
            {container.HostConfig.RestartPolicy.Name || "none"}
          </p>
        </SectionCard>

        {/* NETWORK INFO */}
        <SectionCard icon={<Network size={20} />} title="Network">
          {Object.entries(container.NetworkSettings.Networks).map(([net, data]) => (
            <div key={net} className="pb-3 border-b border-[var(--border-color)] last:border-none">
              <p><strong className="text-[var(--txt-primary)]">{net}</strong></p>
              <p>IP: {data.IPAddress || "-"}</p>
              <p>Gateway: {data.Gateway || "-"}</p>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* CPU */}
        <SectionCard icon={<Cpu size={20} />} title="CPU Usage">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cpuHistory}>
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <CartesianGrid stroke="#2a2a2a" />
                <XAxis
                  dataKey="time"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={() => ""}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(v) => new Date(v).toLocaleTimeString()}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* MEMORY */}
        <SectionCard icon={<Activity size={20} />} title="Memory Usage">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memHistory}>
                <Line
                  type="monotone"
                  dataKey="mem"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <CartesianGrid stroke="#2a2a2a" />
                <XAxis
                  dataKey="time"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={() => ""}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(v) => new Date(v).toLocaleTimeString()}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* LOGS BUTTON */}
      <div>
        <Link
          to={`/containers/${id}/logs`}
          className="
            px-6 py-2.5 rounded-lg border border-[var(--border-color)]
            bg-[var(--bg-secondary)]
            hover:bg-[var(--bg-tertiary)]
            transition-all inline-flex gap-2 items-center
          "
        >
          View Logs →
        </Link>
      </div>
    </div>
  );
}
