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
} from "recharts";
import {
  Info,
  Cpu,
  Activity,
  Network,
  HardDrive,
  Radio,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ContainerDetail() {
  const { id } = useParams();
  const { container, loading } = useContainerDetail(id);
  const stats = useContainerStats(id);

  const [cpuHistory, setCpuHistory] = useState([]);
  const [memHistory, setMemHistory] = useState([]);

  useEffect(() => {
    if (stats) {
      setCpuHistory((prev) => [...prev.slice(-20), { cpu: stats.cpu }]);
      setMemHistory((prev) => [
        ...prev.slice(-20),
        { mem: stats.memory.percent },
      ]);
    }
  }, [stats]);

  if (loading) return <div>Loading...</div>;
  if (!container) return <div>No container found.</div>;
  function SectionCard({ icon, title, children }) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded border border-[var(--border-color)] p-5">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="text-[var(--txt-primary)]">
      <Link
        to="/containers"
        className="text-blue-400 underline hover:text-blue-300"
      >
        ← Back
      </Link>

      <div className="flex justify-between items-center mt-4 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings size={28} />
          {container.Name.replace("/", "")}
        </h1>

        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${container.State.Status === "running"
            ? "bg-green-700/30 text-green-400 border border-green-700/40"
            : "bg-red-700/30 text-red-400 border border-red-700/40"
            }`}
        >
          {container.State.Status.toUpperCase()}
        </span>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-2 gap-6 mb-10">

        {/* General Info */}
        <SectionCard
          icon={<Info size={20} />}
          title="General Information"
        >
          <p><strong>ID:</strong> {container.Id}</p>
          <p><strong>Image:</strong> {container.Config.Image}</p>
          <p><strong>Created:</strong> {new Date(container.Created).toLocaleString()}</p>
          <p><strong>Restart Policy:</strong> {container.HostConfig.RestartPolicy.Name || "none"}</p>
        </SectionCard>

        {/* Network Info */}
        <SectionCard
          icon={<Network size={20} />}
          title="Network"
        >
          {Object.entries(container.NetworkSettings.Networks).map(([net, data]) => (
            <div key={net} className="mb-3">
              <p><strong>{net}</strong></p>
              <p>IP: {data.IPAddress || "-"}</p>
              <p>Gateway: {data.Gateway || "-"}</p>
              <hr className="my-2 border-[var(--border-color)]" />
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <SectionCard icon={<Cpu size={20} />} title="CPU Usage">
          <LineChart width={400} height={200} data={cpuHistory}>
            <Line type="monotone" dataKey="cpu" stroke="#22c55e" />
            <CartesianGrid stroke="#333" />
            <XAxis hide />
            <YAxis />
            <Tooltip />
          </LineChart>
        </SectionCard>

        <SectionCard icon={<Activity size={20} />} title="Memory Usage">
          <LineChart width={400} height={200} data={memHistory}>
            <Line type="monotone" dataKey="mem" stroke="#3b82f6" />
            <CartesianGrid stroke="#333" />
            <XAxis hide />
            <YAxis />
            <Tooltip />
          </LineChart>
        </SectionCard>
      </div>

      {/* Logs Button */}
      <div className="mt-10">
        <Link
          to={`/containers/${id}/logs`}
          className="px-5 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-all"
        >
          View Logs →
        </Link>
      </div>
    </div>
  );
}
