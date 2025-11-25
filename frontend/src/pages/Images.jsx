import { useState } from "react";
import { api } from "../lib/api";

import useImages from "../hooks/useImages";
import useImagePull from "../hooks/useImagePull";
import useDockerStatus from "../hooks/useDockerStatus";

import DockerOffline from "../components/DockerOffline";

import {
  ImageIcon,
  Download,
  Trash2,
  Layers,
  RefreshCw,
} from "lucide-react";

/* PROGRESS BAR COMPONENT */
function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-black/20 rounded-xl h-2 overflow-hidden border border-[var(--border-color)]">
      <div
        className="bg-[var(--accent-blue)] h-full transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default function Images() {
  const { images, loading, refresh } = useImages();
  const { progress, done, pullImage } = useImagePull();

  const { dockerDown, checking, refreshDockerStatus } = useDockerStatus();

  const [imageName, setImageName] = useState("");

  /* LOADING */
  if (loading || checking)
    return (
      <div className="p-10 text-xl text-[var(--txt-secondary)]">Loading...</div>
    );

  /* DOCKER OFFLINE */
  if (dockerDown) return <DockerOffline onRetry={refreshDockerStatus} />;

  /* Extract % from Docker pull events */
  const extractPercent = (event) => {
    if (!event.progressDetail) return null;

    const { current, total } = event.progressDetail;
    if (!current || !total) return null;

    return Math.round((current / total) * 100);
  };

  return (
    <div className="text-[var(--txt-primary)] space-y-10 pb-20">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ImageIcon size={28} />
            Images
          </h1>
          <p className="text-[var(--txt-secondary)] mt-1">
            Manage downloaded images & pull new ones
          </p>
        </div>

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

      {/* PULL IMAGE SECTION */}
      <div
        className="
          bg-[var(--bg-secondary)]
          border border-[var(--border-color)]
          rounded-2xl p-6 shadow-sm
        "
      >
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <Download size={20} />
          Pull Image
        </h2>

        <div className="flex gap-4 flex-wrap">
          <input
            placeholder="nginx:latest"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="
              px-4 py-2.5 rounded-xl bg-[var(--bg-primary)]
              border border-[var(--border-color)]
              flex-1 min-w-[260px]
              text-[var(--txt-primary)]
              placeholder:text-[var(--txt-secondary)]
              focus:outline-none focus:ring-2
              focus:ring-[var(--accent-blue)]/40
            "
          />

          <button
            onClick={() => imageName.trim() && pullImage(imageName)}
            className="
              px-6 py-2.5 rounded-xl bg-[var(--accent-blue)]
              text-white font-medium hover:opacity-90 transition
            "
          >
            Pull
          </button>
        </div>

        {/* PULL PROGRESS */}
        {progress.length > 0 && (
          <div
            className="
              mt-6 space-y-4
              bg-[var(--bg-primary)]
              border border-[var(--border-color)]
              rounded-xl p-4
            "
          >
            {progress.map((p, i) => {
              const pct = extractPercent(p);

              return (
                <div key={i} className="space-y-1">
                  <p className="text-sm text-[var(--txt-secondary)]">
                    {p.status} {p.id ? `(${p.id})` : ""}
                  </p>

                  {pct !== null && <ProgressBar percent={pct} />}
                </div>
              );
            })}

            {done && (
              <p className="text-green-400 font-medium text-sm">
                ✔ Image pulled successfully!
              </p>
            )}
          </div>
        )}
      </div>

      {/* IMAGES TABLE */}
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
              <th className="px-5 py-4 text-left font-medium">Repository</th>
              <th className="px-5 py-4 text-left font-medium">Tag</th>
              <th className="px-5 py-4 text-left font-medium">Size</th>
              <th className="px-5 py-4 text-left font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {images.map((img) => {
              const repo = img.RepoTags?.[0]?.split(":")[0] ?? "none";
              const tag = img.RepoTags?.[0]?.split(":")[1] ?? "none";
              const sizeMB = (img.Size / (1024 * 1024)).toFixed(2);

              return (
                <tr
                  key={img.Id}
                  className="
                    border-t border-[var(--border-color)]
                    hover:bg-[var(--bg-tertiary)]/50 transition-all
                  "
                >
                  <td className="px-5 py-4 flex items-center gap-3 font-medium">
                    <Layers size={18} className="text-blue-300" />
                    {repo}
                  </td>

                  <td className="px-5 py-4">{tag}</td>
                  <td className="px-5 py-4">{sizeMB} MB</td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        api.delete(`/images/${img.Id}`).then(refresh)
                      }
                      className="
                        px-4 py-1.5 rounded-lg border text-sm
                        bg-red-500/10 border-red-600/30 text-red-400
                        hover:bg-red-500/20 transition-all
                        flex items-center gap-2
                      "
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {images.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-[var(--txt-secondary)]"
                >
                  No images found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
