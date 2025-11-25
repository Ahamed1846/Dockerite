import Modal from "./Modal";
import { api } from "../lib/api";
import { useState } from "react";

export default function CreateVolumeModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await api.post("/volumes/create", { name });
      onCreated();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Volume">
      <div className="space-y-6">

        {/* INPUT BLOCK */}
        <div
          className="
            bg-[var(--bg-secondary)]
            border border-[var(--border-color)]
            rounded-xl p-4 shadow-sm
          "
        >
          <label
            className="
              block mb-2 text-sm font-medium
              text-[var(--txt-secondary)]
            "
          >
            Volume Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-volume"
            className="
              w-full px-4 py-2.5 rounded-lg
              bg-[var(--bg-primary)]
              border border-[var(--border-color)]
              text-[var(--txt-primary)]
              placeholder:text-[var(--txt-secondary)]
              focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/40
              transition
            "
          />
        </div>

        {/* FOOTER ACTION */}
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="
              px-6 py-2.5 rounded-lg
              bg-[var(--accent-blue)]
              text-white font-medium tracking-wide
              hover:opacity-90 transition
              disabled:opacity-40 disabled:cursor-not-allowed
            "
            disabled={!name.trim()}
          >
            Create Volume
          </button>
        </div>
      </div>
    </Modal>
  );
}
