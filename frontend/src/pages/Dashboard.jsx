import useSystemSummary from "../hooks/useSystemSummary";
import { Cpu, HardDrive, Layers, Server, Database } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { summary, loading, refresh } = useSystemSummary();

  if (loading) return <div className="text-xl">Loading...</div>;
  if (!summary) return <div>Error loading system summary</div>;

  // Doughnut chart data (running vs stopped containers)
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
    <div className="text-[var(--txt-primary)]">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Grid: Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <SummaryCard
          icon={<Layers size={24} />}
          title="Total Containers"
          value={summary.containers}
        />

        <SummaryCard
          icon={<Server size={24} className="text-green-400" />}
          title="Running Containers"
          value={summary.running}
        />

        <SummaryCard
          icon={<Server size={24} className="text-red-400" />}
          title="Stopped Containers"
          value={summary.stopped}
        />

        <SummaryCard
          icon={<Database size={24} />}
          title="Total Images"
          value={summary.images}
        />

        <SummaryCard
          icon={<Cpu size={24} />}
          title="Architecture"
          value={summary.arch}
        />

        <SummaryCard
          icon={<HardDrive size={24} />}
          title="Storage Driver"
          value={summary.driver}
        />
      </div>

      {/* Running vs Stopped Chart */}
      <div className="bg-[var(--bg-secondary)] rounded p-6 border border-[var(--border-color)] w-[350px] mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          Container Status Overview
        </h2>
        <Doughnut data={chartData} />
      </div>
    </div>
  );
}

function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded p-6 border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-all">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
