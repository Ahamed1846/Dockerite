export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      {/* MODAL CARD */}
      <div
        className="
          bg-[var(--bg-secondary)]
          border border-[var(--border-color)]
          rounded-xl shadow-2xl
          w-full max-w-lg
          max-h-[90vh]
          overflow-hidden flex flex-col
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-medium text-[var(--txt-primary)]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-lg 
               text-[var(--txt-secondary)] hover:text-[var(--txt-primary)]
               hover:bg-[var(--bg-tertiary)] transition-colors duration-150"
          >
            ×
          </button>
        </div>
        {/* BODY (scrolls if content is long) */}
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
