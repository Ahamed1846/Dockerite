import { RefreshCw, ServerOff } from "lucide-react";

export default function DockerOffline({ onRetry }) {
  const handleRetry = () => {
    if (typeof onRetry === "function") {
      onRetry(); 
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="p-10 flex justify-center">
      <div
        className="
          bg-[var(--bg-secondary)]/80
          border border-[var(--border-color)]
          rounded-2xl p-10 max-w-md w-full shadow-lg backdrop-blur-sm
          relative overflow-hidden
        "
      >
        <div className="absolute inset-0 bg-[var(--accent-red)]/20 opacity-30" />

        <div className="relative flex flex-col items-center text-center space-y-6">
          <div
            className="
              w-16 h-16 rounded-2xl
              bg-red-500/10 border border-red-600/30
              flex items-center justify-center
            "
          >
            <ServerOff size={32} className="text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-red-400 tracking-tight">
            Docker is not running
          </h2>

          <p className="text-[var(--txt-secondary)] leading-relaxed">
            Docker Engine is unavailable or stopped.<br />
            Start Docker and try again.
          </p>

          <button
            onClick={handleRetry}
            className="
              px-5 py-2.5 flex items-center gap-2
              bg-[var(--bg-primary)]
              hover:bg-[var(--bg-tertiary)]
              rounded-lg border border-[var(--border-color)]
              transition-all font-medium
            "
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
