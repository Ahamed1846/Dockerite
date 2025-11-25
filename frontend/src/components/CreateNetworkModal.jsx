import Modal from "./Modal";
import { api } from "../lib/api";
import { useState } from "react";

export default function CreateNetworkModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await api.post("/networks/create", { name });
    onCreated();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Network">
      <div className="space-y-6">

        {/* INPUT CARD */}
        <div
          className="
            bg-[var(--bg-secondary)]
            border border-[var(--border-color)]
            rounded-xl p-5 shadow-sm
          "
        >
          <label
            className="block mb-2 text-sm font-medium text-[var(--txt-secondary)]"
          >
            Network Name
          </label>

          <input
            type="text"
            className="
              w-full px-3 py-2.5 rounded-lg
              bg-[var(--bg-primary)]
              border border-[var(--border-color)]
              text-[var(--txt-primary)]
              placeholder:text-[var(--txt-secondary)]
              focus:outline-none focus:ring-2
              focus:ring-[var(--accent-blue)]/40
            "
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-network"
            autoFocus
          />
        </div>

        {/* FOOTER */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className={`
              px-5 py-2.5 rounded-lg font-medium tracking-wide
              transition-all shadow-sm
              ${
                name.trim()
                  ? "bg-[var(--accent-blue)] text-white hover:opacity-90"
                  : "bg-[var(--bg-tertiary)] text-[var(--txt-secondary)] cursor-not-allowed"
              }
            `}
          >
            Create Network
          </button>
        </div>
      </div>
    </Modal>
  );
}
