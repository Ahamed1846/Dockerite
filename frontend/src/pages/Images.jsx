import useImages from "../hooks/useImages";
import useImagePull from "../hooks/useImagePull";
import { useState } from "react";
import { api } from "../lib/api";
import {
  ImageIcon,
  Download,
  Trash2,
  Layers,
  History,
} from "lucide-react";

function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-gray-700/30 rounded h-2 overflow-hidden">
      <div
        className="bg-blue-500 h-full transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default function Images() {
  const { images, loading, refresh } = useImages();
  const { progress, done, pullImage } = useImagePull();
  const [imageName, setImageName] = useState("");

  if (loading) return <div className="text-xl">Loading...</div>;

  // Extract percentage from Docker events
  const extractPercent = (event) => {
    if (!event.progressDetail) return null;
    const { current, total } = event.progressDetail;
    if (!current || !total) return null;
    return Math.round((current / total) * 100);
  };

  return (
    <div className="text-[var(--txt-primary)]">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ImageIcon size={28} /> Images
        </h1>

        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Pull Image */}
      <div className="bg-[var(--bg-secondary)] p-5 rounded border border-[var(--border-color)] mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Download size={20} /> Pull Image
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="nginx:latest"
            className="px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)] w-80"
          />
          <button
            onClick={() => imageName.trim() && pullImage(imageName)}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-all"
          >
            Pull
          </button>
        </div>

        {/* Progress Section */}
        {progress.length > 0 && (
          <div className="mt-4 space-y-3 bg-black p-4 rounded border border-[var(--border-color)]">
            {progress.map((p, i) => {
              const pct = extractPercent(p);

              return (
                <div key={i}>
                  <p className="text-sm text-gray-300 mb-1">
                    {p.status} {p.id ? `(${p.id})` : ""}
                  </p>
                  {pct !== null && <ProgressBar percent={pct} />}
                </div>
              );
            })}

            {done && (
              <p className="mt-3 text-green-400 text-sm">
                ✔ Image pulled successfully!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Images Table */}
      <div className="overflow-hidden rounded border border-[var(--border-color)]">
        <table className="w-full border-collapse">
          <thead className="bg-[var(--bg-secondary)] text-[var(--txt-secondary)]">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Tag</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {images.map((img) => {
              const repo = img.RepoTags ? img.RepoTags[0].split(":")[0] : "none";
              const tag = img.RepoTags ? img.RepoTags[0].split(":")[1] : "none";
              const sizeMB = (img.Size / (1024 * 1024)).toFixed(2);

              return (
                <tr
                  key={img.Id}
                  className="border-t border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-all"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Layers size={18} className="text-blue-300" /> {repo}
                  </td>

                  <td className="px-4 py-3">{tag}</td>

                  <td className="px-4 py-3">{sizeMB} MB</td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => api.delete(`/images/${img.Id}`).then(refresh)}
                      className="px-3 py-1 bg-red-700/30 border border-red-700/40 text-red-300 rounded hover:bg-red-700/40 flex items-center gap-1 transition-all"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
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
