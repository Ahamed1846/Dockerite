import useContainers from "../hooks/useContainers";
import useDockerStatus from "../hooks/useDockerStatus";
import DockerOffline from "../components/DockerOffline";

import { Link } from "react-router-dom";
import { api } from "../lib/api";
import CreateContainerModal from "../components/CreateContainerModal";
import { useState } from "react";

import {
  Plus,
  Play,
  Square,
  RefreshCw,
  Trash2,
  FileText,
  Info,
} from "lucide-react";

export default function Containers() {
  const { containers, loading, refresh } = useContainers();
  const { dockerDown, checking, refreshDockerStatus } = useDockerStatus();

  const [modalOpen, setModalOpen] = useState(false);
  const [loadingActions, setLoadingActions] = useState({});

  /* LOADING STATE */
  if (loading || checking)
    return (
      <div className="p-10 text-xl text-[var(--txt-secondary)]">
        Loading...
      </div>
    );

  /* DOCKER OFFLINE */
  if (dockerDown) {
    return <DockerOffline onRetry={refreshDockerStatus} />;
  }

  /* BADGE STYLES */
  const statusBadge = (state) => {
    const base =
      "px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm";

    if (state === "running")
      return `${base} bg-green-500/10 text-green-400 border-green-600/30`;

    if (state === "exited")
      return `${base} bg-red-500/10 text-red-400 border-red-600/30`;

    return `${base} bg-gray-500/10 text-gray-300 border-gray-600/30`;
  };

  /* PAGE */
  return (
    <div className="text-[var(--txt-primary)] space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Containers</h1>
          <p className="text-[var(--txt-secondary)] mt-1">
            Manage active and stopped containers.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="
              px-4 py-2 flex items-center gap-2
              rounded-lg border border-[var(--border-color)]
              bg-[var(--bg-secondary)]
              hover:bg-[var(--bg-tertiary)]
              transition-all
            "
          >
            <Plus size={18} />
            Create
          </button>

          <button
            onClick={refresh}
            className="
              px-4 py-2 flex items-center gap-2
              rounded-lg bg-[var(--bg-secondary)]
              border border-[var(--border-color)]
              hover:bg-[var(--bg-tertiary)]
              transition-all
            "
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* MODAL */}
      <CreateContainerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
      />

      {/* EMPTY STATE */}
      {containers.length === 0 && (
        <div
          className="
            p-12 mt-6 rounded-2xl border border-[var(--border-color)]
            bg-[var(--bg-secondary)] text-center shadow-sm
          "
        >
          <p className="text-lg text-[var(--txt-secondary)] mb-4">
            No containers found.
          </p>
        </div>
      )}

      {/* TABLE */}
      {containers.length > 0 && (
        <div
          className="
            overflow-hidden rounded-2xl border border-[var(--border-color)]
            bg-[var(--bg-secondary)] shadow-sm
          "
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bg-secondary)] text-[var(--txt-secondary)]">
                <th className="px-5 py-4 text-left font-medium">Name</th>
                <th className="px-5 py-4 text-left font-medium">Image</th>
                <th className="px-5 py-4 text-left font-medium">Status</th>
                <th className="px-5 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {containers.map((c) => {
                const name = c.Names?.[0]?.replace("/", "") || "Unnamed";
                const loading = loadingActions[c.Id];

                return (
                  <tr
                    key={c.Id}
                    className={`
                      border-t border-[var(--border-color)]
                      transition-all
                      ${
                        loading
                          ? "opacity-60 pointer-events-none"
                          : "hover:bg-[var(--bg-tertiary)]/60"
                      }
                    `}
                  >
                    <td className="px-5 py-4 font-medium">{name}</td>

                    <td className="px-5 py-4 text-[var(--txt-secondary)]">
                      {c.Image}
                    </td>

                    <td className="px-5 py-4">
                      <span className={statusBadge(c.State)}>
                        {c.State.charAt(0).toUpperCase() + c.State.slice(1)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {/* START */}
                        {c.State !== "running" && !loading && (
                          <ActionButton
                            color="green"
                            icon={<Play size={15} />}
                            label="Start"
                            onClick={() => {
                              setLoadingActions((p) => ({
                                ...p,
                                [c.Id]: "starting",
                              }));

                              api
                                .post(`/containers/${c.Id}/start`)
                                .then(refresh)
                                .finally(() =>
                                  setLoadingActions((p) => ({
                                    ...p,
                                    [c.Id]: null,
                                  }))
                                );
                            }}
                          />
                        )}

                        {/* STOP */}
                        {c.State === "running" && !loading && (
                          <ActionButton
                            color="red"
                            icon={<Square size={15} />}
                            label="Stop"
                            onClick={() => {
                              setLoadingActions((p) => ({
                                ...p,
                                [c.Id]: "stopping",
                              }));

                              api
                                .post(`/containers/${c.Id}/stop`)
                                .then(refresh)
                                .finally(() =>
                                  setLoadingActions((p) => ({
                                    ...p,
                                    [c.Id]: null,
                                  }))
                                );
                            }}
                          />
                        )}

                        {/* RESTART */}
                        {!loading && (
                          <ActionButton
                            color="yellow"
                            icon={<RefreshCw size={15} />}
                            label="Restart"
                            onClick={() => {
                              setLoadingActions((p) => ({
                                ...p,
                                [c.Id]: "restarting",
                              }));

                              api
                                .post(`/containers/${c.Id}/restart`)
                                .then(refresh)
                                .finally(() =>
                                  setLoadingActions((p) => ({
                                    ...p,
                                    [c.Id]: null,
                                  }))
                                );
                            }}
                          />
                        )}

                        {/* LOADING STATES */}
                        {loading === "starting" && (
                          <LoadingButton label="Starting..." color="green" />
                        )}
                        {loading === "stopping" && (
                          <LoadingButton label="Stopping..." color="red" />
                        )}
                        {loading === "restarting" && (
                          <LoadingButton label="Restarting..." color="yellow" />
                        )}

                        {/* LOGS */}
                        {!loading && (
                          <LinkActionButton
                            color="blue"
                            icon={<FileText size={15} />}
                            label="Logs"
                            to={`/containers/${c.Id}/logs`}
                          />
                        )}

                        {/* DETAILS */}
                        {!loading && (
                          <LinkActionButton
                            color="gray"
                            icon={<Info size={15} />}
                            label="Details"
                            to={`/containers/${c.Id}`}
                          />
                        )}

                        {/* REMOVE */}
                        {!loading && (
                          <ActionButton
                            color="red"
                            subtle
                            icon={<Trash2 size={15} />}
                            label="Remove"
                            onClick={() => {
                              setLoadingActions((p) => ({
                                ...p,
                                [c.Id]: "removing",
                              }));

                              api
                                .delete(`/containers/${c.Id}`)
                                .then(refresh)
                                .finally(() =>
                                  setLoadingActions((p) => ({
                                    ...p,
                                    [c.Id]: null,
                                  }))
                                );
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────────
   REUSABLE BUTTONS
──────────────────────────────── */

function ActionButton({ icon, label, color, onClick, subtle }) {
  const colors = {
    green:
      "bg-green-500/10 border-green-600/30 text-green-400 hover:bg-green-500/20",
    red: "bg-red-500/10 border-red-600/30 text-red-400 hover:bg-red-500/20",
    yellow:
      "bg-yellow-500/10 border-yellow-600/30 text-yellow-300 hover:bg-yellow-500/20",
    blue: "bg-blue-500/10 border-blue-600/30 text-blue-300 hover:bg-blue-500/20",
    gray: "bg-gray-500/10 border-gray-600/30 text-gray-300 hover:bg-gray-500/20",
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg flex items-center gap-1.5 border text-sm transition-all
        ${colors[color]} ${subtle ? "opacity-80 hover:opacity-100" : ""}
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function LinkActionButton({ icon, label, color, to }) {
  const colors = {
    blue: "bg-blue-500/10 border-blue-600/30 text-blue-300 hover:bg-blue-500/20",
    gray: "bg-gray-500/10 border-gray-600/30 text-gray-300 hover:bg-gray-500/20",
  };

  return (
    <Link
      to={to}
      className={`
        px-3 py-1.5 rounded-lg flex items-center gap-1.5 border
        text-sm transition-all
        ${colors[color]}
      `}
    >
      {icon}
      {label}
    </Link>
  );
}

function LoadingButton({ label, color }) {
  const colors = {
    red: "bg-red-500/10 border-red-600/30 text-red-400",
    green: "bg-green-500/10 border-green-600/30 text-green-400",
    yellow: "bg-yellow-500/10 border-yellow-600/30 text-yellow-300",
    blue: "bg-blue-500/10 border-blue-600/30 text-blue-300",
    gray: "bg-gray-500/10 border-gray-600/30 text-gray-300",
  };

  return (
    <div
      className={`
        px-3 py-1.5 rounded-lg flex items-center gap-2 border text-sm
        ${colors[color]} animate-pulse
      `}
    >
      <Spinner size={14} />
      {label}
    </div>
  );
}

function Spinner({ size = 14 }) {
  return (
    <div
      className="border-2 border-t-transparent border-current rounded-full animate-spin"
      style={{
        width: size,
        height: size,
        borderTopColor: "transparent",
      }}
    />
  );
}
