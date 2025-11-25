import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { Network, ArrowLeft } from "lucide-react";

export default function NetworkDetail() {
  const { id } = useParams();
  const [net, setNet] = useState(null);

  useEffect(() => {
    api.get(`/networks/${id}`).then((res) => setNet(res.data));
  }, [id]);

  if (!net)
    return (
      <div className="p-10 text-xl text-[var(--txt-secondary)]">
        Loading network...
      </div>
    );

  return (
    <div className="text-[var(--txt-primary)] space-y-10 pb-20 animate-fadeIn">

      {/* BACK */}
      <Link
          to="/networks"
          className="
            inline-flex items-center gap-2 text-[var(--txt-secondary)]
            hover:text-[var(--txt-primary)] transition
          "
        >
          <ArrowLeft size={18} />
          Back
        </Link>

      {/* TITLE */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Network size={32} />
          {net.Name}
        </h1>

        <p className="text-[var(--txt-secondary)]">
          Detailed configuration for this Docker network
        </p>
      </div>

      {/* INFO CARD */}
      <div
        className="
          bg-[var(--bg-secondary)]
          border border-[var(--border-color)]
          shadow-sm rounded-2xl
          p-8 max-w-3xl space-y-8
        "
      >
        {/* DETAILS */}
        <div className="space-y-1">
          <DetailRow label="ID" value={net.Id} />
          <DetailRow label="Driver" value={net.Driver} />
          <DetailRow label="Scope" value={net.Scope} />
          <DetailRow label="Internal" value={net.Internal ? 'Yes' : 'No'} />
        </div>

        {/* CONNECTED CONTAINERS */}
        <div className="pt-4 border-t border-[var(--border-color)]">
          <h3 className="text-lg font-semibold mb-4">Connected Containers</h3>

          {net.Containers && Object.keys(net.Containers).length > 0 ? (
            <pre
              className="
                bg-[var(--bg-primary)]
                border border-[var(--border-color)]
                p-4 rounded-xl text-sm leading-relaxed
                overflow-x-auto
              "
            >
{JSON.stringify(net.Containers, null, 2)}
            </pre>
          ) : (
            <div
              className="
                p-4 rounded-xl border border-[var(--border-color)]
                bg-[var(--bg-primary)]
                text-[var(--txt-secondary)]
              "
            >
              No containers connected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      className="
        flex items-center justify-between
        py-3 text-sm
        border-b border-[var(--border-color)]
        last:border-none
      "
    >
      <span className="text-[var(--txt-secondary)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
