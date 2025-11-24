import { useState } from "react";
import Modal from "./Modal";
import { api } from "../lib/api";
import { Plus, Trash2 } from "lucide-react";

export default function CreateContainerModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [ports, setPorts] = useState([{ container: "", host: "" }]);
  const [envVars, setEnvVars] = useState([{ key: "", value: "" }]);

  const addPort = () => setPorts([...ports, { container: "", host: "" }]);
  const addEnv = () => setEnvVars([...envVars, { key: "", value: "" }]);

  const removePort = (i) =>
    setPorts(ports.filter((_, idx) => idx !== i));

  const removeEnv = (i) =>
    setEnvVars(envVars.filter((_, idx) => idx !== i));

  const handleCreate = async () => {
    try {
      await api.post("/containers/create", {
        name,
        image,
        ports: ports.filter((p) => p.container && p.host),
        env: envVars.filter((e) => e.key && e.value),
      });

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Container">

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-1 text-sm">Container Name</label>
        <input
          className="w-full px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="my-container"
        />
      </div>

      {/* Image */}
      <div className="mb-4">
        <label className="block mb-1 text-sm">Image</label>
        <input
          className="w-full px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="nginx:latest"
        />
      </div>

      {/* Ports */}
      <div className="mb-4">
        <label className="block mb-2 text-sm flex items-center justify-between">
          Ports
          <button
            onClick={addPort}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </label>

        {ports.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
              placeholder="Container Port"
              value={p.container}
              onChange={(e) =>
                setPorts(
                  ports.map((port, idx) =>
                    idx === i ? { ...port, container: e.target.value } : port
                  )
                )
              }
            />
            <input
              className="flex-1 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
              placeholder="Host Port"
              value={p.host}
              onChange={(e) =>
                setPorts(
                  ports.map((port, idx) =>
                    idx === i ? { ...port, host: e.target.value } : port
                  )
                )
              }
            />
            <button
              onClick={() => removePort(i)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Environment Variables */}
      <div className="mb-4">
        <label className="block mb-2 text-sm flex items-center justify-between">
          Environment Variables
          <button
            onClick={addEnv}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </label>

        {envVars.map((e, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
              placeholder="KEY"
              value={e.key}
              onChange={(ev) =>
                setEnvVars(
                  envVars.map((env, idx) =>
                    idx === i ? { ...env, key: ev.target.value } : env
                  )
                )
              }
            />
            <input
              className="flex-1 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
              placeholder="VALUE"
              value={e.value}
              onChange={(ev) =>
                setEnvVars(
                  envVars.map((env, idx) =>
                    idx === i ? { ...env, value: ev.target.value } : env
                  )
                )
              }
            />
            <button
              onClick={() => removeEnv(i)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Create Button */}
      <button
        onClick={handleCreate}
        className="w-full py-2 mt-4 bg-blue-600 rounded hover:bg-blue-700 transition-all"
      >
        Create Container
      </button>
    </Modal>
  );
}
