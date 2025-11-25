import useNetworks from "../hooks/useNetworks";
import { Link } from "react-router-dom";
import { Network, Trash2, Plus, RefreshCw } from "lucide-react";
import { api } from "../lib/api";
import { useState } from "react";
import CreateNetworkModal from "../components/CreateNetworkModal";
import DockerOffline from "../components/DockerOffline";

export default function Networks() {
  const { networks, loading, error, refresh } = useNetworks();
  const [open, setOpen] = useState(false);

  /* LOADING */
  if (loading)
    return (
      <div className="p-10 text-xl text-[var(--txt-secondary)]">
        Loading networks...
      </div>
    );

  /* DOCKER OFFLINE */
  if (error || !networks) return <DockerOffline onRetry={refresh} />;

  return (
    <div className="text-[var(--txt-primary)] space-y-10 pb-20">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Network size={30} />
            Networks
          </h1>
          <p className="text-[var(--txt-secondary)] mt-1">
            Manage Docker networks (bridge, overlay, host, custom)
          </p>
        </div>

        <div className="flex gap-3">
          {/* Create */}
          <button
            onClick={() => setOpen(true)}
            className="
              px-4 py-2 flex items-center gap-2 rounded-lg
              bg-[var(--bg-secondary)]
              border border-[var(--border-color)]
              hover:bg-[var(--bg-tertiary)]
              transition-all font-medium
            "
          >
            <Plus size={18} />
            Create
          </button>

          {/* Refresh */}
          <button
            onClick={refresh}
            className="
              px-4 py-2 flex items-center gap-2 rounded-lg
              bg-[var(--bg-secondary)]
              border border-[var(--border-color)]
              hover:bg-[var(--bg-tertiary)]
              transition-all font-medium
            "
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div
        className="
          overflow-hidden rounded-2xl shadow-sm
          border border-[var(--border-color)]
          bg-[var(--bg-secondary)]
        "
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[var(--txt-secondary)] bg-[var(--bg-secondary)]">
              <th className="px-5 py-4 text-left font-medium">Name</th>
              <th className="px-5 py-4 text-left font-medium">Driver</th>
              <th className="px-5 py-4 text-left font-medium">Scope</th>
              <th className="px-5 py-4 text-left font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {networks.map((net) => (
              <tr
                key={net.Id}
                className="
                  border-t border-[var(--border-color)]
                  hover:bg-[var(--bg-tertiary)]/50 transition-all
                "
              >
                {/* NAME */}
                <td className="px-5 py-4 font-medium">
                  <Link
                    to={`/networks/${net.Id}`}
                    className="hover:text-[var(--accent-blue)] transition underline"
                  >
                    {net.Name}
                  </Link>
                </td>

                {/* DRIVER */}
                <td className="px-5 py-4 text-[var(--txt-secondary)]">
                  {net.Driver}
                </td>

                {/* SCOPE */}
                <td className="px-5 py-4 text-[var(--txt-secondary)]">
                  {net.Scope}
                </td>

                {/* ACTIONS */}
                <td className="px-5 py-4">
                  <button
                    onClick={() => api.delete(`/networks/${net.Id}`).then(refresh)}
                    className="
                      px-4 py-1.5 rounded-lg border text-sm
                      bg-red-500/10 border-red-600/30 text-red-400
                      hover:bg-red-500/20 transition-all
                      flex items-center gap-2
                    "
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {networks.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-[var(--txt-secondary)]"
                >
                  No networks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE NETWORK MODAL */}
      <CreateNetworkModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={refresh}
      />
    </div>
  );
}
