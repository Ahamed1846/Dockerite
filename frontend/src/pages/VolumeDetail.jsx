import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { HardDrive, ArrowLeft, Tag } from "lucide-react";

export default function VolumeDetail() {
  const { name } = useParams();
  const [volume, setVolume] = useState(null);

  useEffect(() => {
    api.get(`/volumes/${name}`).then((res) => setVolume(res.data));
  }, [name]);

  if (!volume)
    return (
      <div className="p-10 text-xl text-[var(--txt-secondary)]">
        Loading volume details...
      </div>
    );

  return (
    <div className="text-[var(--txt-primary)] space-y-10 pb-20">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Link
          to="/volumes"
          className="
            inline-flex items-center gap-2 text-[var(--txt-secondary)]
            hover:text-[var(--txt-primary)] transition
          "
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <span className="text-[var(--txt-secondary)]">
          Volume Name:{" "}
          <span className="text-[var(--txt-primary)]">{volume.Name}</span>
        </span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
        <HardDrive size={32} />
        Volume Details
      </h1>

      {/* MAIN CARD */}
      <div
        className="
          bg-[var(--bg-secondary)]
          border border-[var(--border-color)]
          rounded-2xl p-8 shadow-sm
          w-fit
        "
      >
        {/* Basic Info */}
        <SectionRow label="Driver" value={volume.Driver} />
        <SectionRow label="Mountpoint" value={volume.Mountpoint} />
        <SectionRow label="Created At" value={volume.CreatedAt} />

        {/* Labels */}
        {volume.Labels && Object.keys(volume.Labels).length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Tag size={18} />
              Labels
            </h2>

            <div
              className="
                bg-[var(--bg-primary)]
                border border-[var(--border-color)]
                rounded-xl p-4
                text-sm whitespace-pre-wrap leading-relaxed
                font-mono
              "
            >
              {Object.entries(volume.Labels).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <span className="text-[var(--accent-blue)]">{key}</span>
                  <span className="mx-2 text-[var(--txt-secondary)]">=</span>
                  <span className="text-[var(--txt-primary)]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- */
/* Premium Row Component */
/* ----------------------------- */
function SectionRow({ label, value }) {
  return (
    <div className="mb-6 last:mb-0">
      <p className="text-sm text-[var(--txt-secondary)] mb-1">{label}</p>
      <p className="text-lg font-medium">{value}</p>

      <div className="mt-3 h-[1px] w-full bg-[var(--border-color)]"></div>
    </div>
  );
}
