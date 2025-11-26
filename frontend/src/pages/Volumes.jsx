import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

import useVolumes from "../hooks/useVolumes";
import useDockerStatus from "../hooks/useDockerStatus";

import CreateVolumeModal from "../components/CreateVolumeModal";
import DockerOffline from "../components/DockerOffline";

import {
  Trash2,
  HardDrive,
  Plus,
  RefreshCw,
  Database,
} from "lucide-react";

export default function Volumes() {
  const { volumes, loading, refresh } = useVolumes();
  const { dockerDown, checking, refreshDockerStatus } = useDockerStatus();

  const [open, setOpen] = useState(false);

  /* LOADING */
  if (loading || checking)
    return (
      <div className="p-10 text-xl text-[var(--txt-secondary)]">
        Loading volumes...
      </div>
    );

  /* DOCKER OFFLINE */
  if (dockerDown) return <DockerOffline onRetry={refreshDockerStatus} />;

  return (
    <div className="text-[var(--txt-primary)] space-y-10 pb-20">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Database size={28} />
            Volumes
          </h1>
          <p className="text-[var(--txt-secondary)] mt-1">
            Manage Docker data volumes on your system
          </p>
        </div>

        <div className="flex gap-3">
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
              <th className="px-5 py-4 text-left font-medium">Mountpoint</th>
              <th className="px-5 py-4 text-left font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {volumes.map((v) => (
              <tr
                key={v.Name}
                className="
                  border-t border-[var(--border-color)]
                  hover:bg-[var(--bg-tertiary)]/50 transition-all
                "
              >
                {/* NAME */}
                <td className="px-5 py-4 flex items-center gap-3 font-medium">
                  <HardDrive size={18} className="text-blue-300" />

                  <Link
                    to={`/volumes/${v.Name}`}
                    className="hover:text-[var(--accent-blue)] transition"
                  >
                    {v.Name}
                  </Link>
                </td>

                {/* DRIVER */}
                <td className="px-5 py-4 text-[var(--txt-secondary)]">
                  {v.Driver}
                </td>

                {/* MOUNTPOINT — with ellipsis */}
                <td
                  className="
                    px-5 py-4 text-sm text-[var(--txt-secondary)]
                    max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap
                  "
                  title={v.Mountpoint}
                >
                  {v.Mountpoint}
                </td>

                {/* ACTIONS */}
                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      api.delete(`/volumes/${v.Name}`).then(refresh)
                    }
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

            {volumes.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-[var(--txt-secondary)]"
                >
                  No volumes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE VOLUME MODAL */}
      <CreateVolumeModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={refresh}
      />
    </div>
  );
}
