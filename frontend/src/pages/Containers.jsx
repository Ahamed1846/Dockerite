import useContainers from "../hooks/useContainers";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import CreateContainerModal from "../components/CreateContainerModal";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Play,
  Square,
  RefreshCw,
  Trash2,
  FileText,
  Info,
} from "lucide-react";

export default function Containers() {
  const { containers, loading, refresh } = useContainers();
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) return <div className="text-xl">Loading...</div>;

  const statusBadge = (state) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium";

    if (state === "running")
      return `${base} bg-green-700/30 text-green-400 border border-green-700/40`;

    if (state === "exited")
      return `${base} bg-red-700/30 text-red-400 border border-red-700/40`;

    return `${base} bg-gray-700/30 text-gray-300 border border-gray-700/40`;
  };

  return (
    <div className="text-[var(--txt-primary)]">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Containers</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Create Container
          </button>

          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-all"
          >
            Refresh
          </button>
        </div>
      </div>

      <CreateContainerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
      />

      <div className="overflow-hidden rounded border border-[var(--border-color)]">
        <table className="w-full border-collapse">
          <thead className="bg-[var(--bg-secondary)] text-[var(--txt-secondary)]">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {containers.map((c) => {
              const name = c.Names?.[0]?.replace("/", "") || "Unnamed";

              return (
                <tr
                  key={c.Id}
                  className="border-t border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-all"
                >
                  <td className="px-4 py-3">{name}</td>

                  <td className="px-4 py-3">{c.Image}</td>

                  <td className="px-4 py-3">
                    <span className={statusBadge(c.State)}>
                      {c.State.charAt(0).toUpperCase() + c.State.slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">

                      {/* Start */}
                      {c.State !== "running" && (
                        <button
                          onClick={() =>
                            api.post(`/containers/${c.Id}/start`).then(refresh)
                          }
                          className="px-3 py-1 rounded bg-green-700/30 border border-green-700/40 text-green-400 hover:bg-green-700/40 transition-all flex items-center gap-1"
                        >
                          <Play size={16} />
                          Start
                        </button>
                      )}

                      {/* Stop */}
                      {c.State === "running" && (
                        <button
                          onClick={() =>
                            api.post(`/containers/${c.Id}/stop`).then(refresh)
                          }
                          className="px-3 py-1 rounded bg-red-700/30 border border-red-700/40 text-red-400 hover:bg-red-700/40 transition-all flex items-center gap-1"
                        >
                          <Square size={16} />
                          Stop
                        </button>
                      )}

                      {/* Restart */}
                      <button
                        onClick={() =>
                          api.post(`/containers/${c.Id}/restart`).then(refresh)
                        }
                        className="px-3 py-1 rounded bg-yellow-700/30 border border-yellow-700/40 text-yellow-300 hover:bg-yellow-700/40 transition-all flex items-center gap-1"
                      >
                        <RefreshCw size={16} />
                        Restart
                      </button>

                      {/* Logs */}
                      <Link
                        to={`/containers/${c.Id}/logs`}
                        className="px-3 py-1 rounded bg-blue-700/30 border border-blue-700/40 text-blue-300 hover:bg-blue-700/40 transition-all flex items-center gap-1"
                      >
                        <FileText size={16} />
                        Logs
                      </Link>

                      {/* Details */}
                      <Link
                        to={`/containers/${c.Id}`}
                        className="px-3 py-1 rounded bg-gray-700/30 border border-gray-700/40 text-gray-300 hover:bg-gray-700/40 transition-all flex items-center gap-1"
                      >
                        <Info size={16} />
                        Details
                      </Link>

                      {/* Remove */}
                      <button
                        onClick={() =>
                          api.delete(`/containers/${c.Id}`).then(refresh)
                        }
                        className="px-3 py-1 rounded bg-red-800/20 border border-red-800/30 text-red-300 hover:bg-red-800/30 transition-all flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
