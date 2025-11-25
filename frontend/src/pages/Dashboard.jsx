import useSystemSummary from "../hooks/useSystemSummary";
import {
  Cpu,
  HardDrive,
  Layers,
  Server,
  Database,
  RefreshCw,
  Network,
} from "lucide-react";

import { Link } from "react-router-dom";

import DockerOffline from "../components/DockerOffline";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { summary, loading, error, refresh } = useSystemSummary();

  /* LOADING */
  if (loading)
    return (
      <div className="p-10 text-xl text-[var(--txt-secondary)]">
        Loading...
      </div>
    );

  /* DOCKER OFFLINE */
  if (error || !summary) return <DockerOffline retry={refresh} />;

  const chartData = {
    labels: ["Running", "Stopped"],
    datasets: [
      {
        data: [summary.running, summary.stopped],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="text-[var(--txt-primary)] space-y-12 pb-20">

      {/* HEADER */}
      <div
        className="
          bg-[var(--bg-secondary)]
          border border-[var(--border-color)]
          p-8 rounded-2xl shadow-sm
          flex items-center justify-between
        "
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-[var(--txt-secondary)] mt-1">
            Real-time metrics for your Docker environment.
          </p>
        </div>

        <button
          onClick={refresh}
          className="
            px-4 py-2 flex items-center gap-2
            bg-[var(--bg-primary)]
            hover:bg-[var(--bg-tertiary)]
            border border-[var(--border-color)]
            rounded-lg transition-all
          "
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="col-span-2 space-y-10">

          {/* TOP CARDS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <ClickableBigCard
              to="/containers"
              title="Containers"
              subtitle="Total count"
              value={summary.containers}
              icon={<Layers size={22} />}
            />

            <ClickableBigCard
              to="/images"
              title="Images"
              subtitle="Stored locally"
              value={summary.images}
              icon={<Database size={22} />}
            />

            <ClickableBigCard
              to="/volumes"
              title="Volumes"
              subtitle="Data volumes"
              value={summary.volumes}
              icon={<HardDrive size={22}/>}
            />

            <ClickableBigCard
              to="/networks"
              title="Networks"
              subtitle="Available networks"
              value={summary.networks}
              icon={<Network size={22}/>}
            />
          </div>

          {/* METRIC GRID */}
          <div className="grid sm:grid-cols-3 gap-6">
            <MetricCard
              title="Running"
              value={summary.running}
              icon={<Server size={20} className="text-green-400" />}
            />
            <MetricCard
              title="Stopped"
              value={summary.stopped}
              icon={<Server size={20} className="text-red-400" />}
            />
            <MetricCard
              title="Architecture"
              value={summary.arch}
              icon={<Cpu size={20} />}
            />
            <MetricCard
              title="Driver"
              value={summary.driver}
              icon={<HardDrive size={20} />}
            />
          </div>
        </div>

        {/* RIGHT – CHART */}
        <div
          className="
            bg-[var(--bg-secondary)]
            border border-[var(--border-color)]
            rounded-2xl shadow-sm
            p-8 h-fit
          "
        >
          <h2 className="text-xl font-semibold tracking-tight mb-6 text-[var(--txt-primary)]">
            Container Status Overview
          </h2>

          <div className="w-[260px] mx-auto">
            <Doughnut data={chartData} />
          </div>

          <div className="mt-8 space-y-3 text-sm">
            <StatLine
              label="Running"
              value={summary.running}
              color="text-green-400"
            />
            <StatLine
              label="Stopped"
              value={summary.stopped}
              color="text-red-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────
   CLICKABLE BIG CARD
──────────────────────────────── */

function ClickableBigCard({ to, icon, title, subtitle, value }) {
  return (
    <Link
      to={to}
      className="
        block group
        bg-[var(--bg-secondary)]
        border border-[var(--border-color)]
        rounded-2xl p-6 shadow-sm
        hover:bg-[var(--bg-tertiary)]
        transition-all
      "
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="
            w-12 h-12 rounded-xl
            bg-[var(--bg-primary)]
            border border-[var(--border-color)]
            flex items-center justify-center
            group-hover:scale-105 transition
          "
        >
          {icon}
        </div>

        <div>
          <h3 className="text-[var(--txt-secondary)] text-sm font-medium">
            {title}
          </h3>
          <p className="text-xs text-[var(--txt-secondary)] mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <p className="text-4xl font-bold tracking-tight">{value}</p>
    </Link>
  );
}

/* ─────────────────────────────── */

function MetricCard({ icon, title, value }) {
  return (
    <div
      className="
        bg-[var(--bg-secondary)]
        border border-[var(--border-color)]
        rounded-xl p-5 shadow-sm
        hover:bg-[var(--bg-tertiary)] transition-all
      "
    >
      <div className="flex items-center gap-3 mb-3">
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

        <h3 className="text-[var(--txt-secondary)] text-sm font-medium">
          {title}
        </h3>
      </div>

      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function StatLine({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${color} font-medium`}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
