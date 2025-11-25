import { useState, useEffect } from "react";
import Modal from "./Modal";
import { api } from "../lib/api";
import { Plus, Trash2, ChevronRight, ChevronLeft } from "lucide-react";

export default function CreateContainerModal({ open, onClose, onCreated }) {
  const [step, setStep] = useState(1);

  // Basic info
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  // Ports, Env, Volumes
  const [ports, setPorts] = useState([{ container: "", host: "" }]);
  const [envVars, setEnvVars] = useState([{ key: "", value: "" }]);
  const [volumes, setVolumes] = useState([{ host: "", container: "" }]);

  // Advanced
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [restartPolicy, setRestartPolicy] = useState("no");
  const [command, setCommand] = useState("");
  const [entrypoint, setEntrypoint] = useState("");
  const [cpuLimit, setCpuLimit] = useState("");
  const [memoryLimit, setMemoryLimit] = useState("");
  const [autoStart, setAutoStart] = useState(true);

  useEffect(() => {
    api.get("/networks").then((res) => {
      setNetworks(res.data);
      if (res.data.length > 0) setSelectedNetwork(res.data[0].Name);
    });
  }, []);

  const addPort = () => setPorts([...ports, { container: "", host: "" }]);
  const addEnv = () => setEnvVars([...envVars, { key: "", value: "" }]);
  const addVolume = () =>
    setVolumes([...volumes, { host: "", container: "" }]);

  const removePort = (i) => setPorts(ports.filter((_, idx) => idx !== i));
  const removeEnv = (i) => setEnvVars(envVars.filter((_, idx) => idx !== i));
  const removeVolume = (i) =>
    setVolumes(volumes.filter((_, idx) => idx !== i));

  const handleCreate = async () => {
    await api.post("/containers/create", {
      name,
      image,
      ports: ports.filter((p) => p.container && p.host),
      env: envVars.filter((e) => e.key && e.value),
      volumes: volumes.filter((v) => v.host && v.container),
      network: selectedNetwork,
      restartPolicy,
      command,
      entrypoint,
      cpuLimit,
      memoryLimit,
      autoStart,
    });

    onCreated();
    onClose();
  };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <Modal open={open} onClose={onClose} title="Create Container">
      <div className="flex flex-col gap-6">

        {/* Step Indicators */}
        <div className="flex items-center justify-between text-sm font-medium">
          {["Basic", "Ports / Env", "Volumes", "Advanced"].map(
            (label, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    step === i + 1
                      ? "bg-[var(--accent-blue)] text-white border-[var(--accent-blue)]"
                      : "bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--txt-secondary)]"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`mt-2 ${
                    step === i + 1
                      ? "text-[var(--txt-primary)]"
                      : "text-[var(--txt-secondary)]"
                  }`}
                >
                  {label}
                </span>
              </div>
            )
          )}
        </div>

        {/* Step Content with internal scroll */}
        <div className="max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">

          {/* STEP 1 — BASIC INFO */}
          {step === 1 && (
            <div className="space-y-6">
              <Section title="Basic Information">
                <Input
                  label="Container Name"
                  placeholder="my-container"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Image"
                  placeholder="nginx:latest"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </Section>
            </div>
          )}

          {/* STEP 2 — PORTS + ENV */}
          {step === 2 && (
            <div className="space-y-6">

              {/* PORTS */}
              <Section
                title="Ports"
                action={<AddButton onClick={addPort} />}
              >
                <div className="space-y-3">
                  {ports.map((p, i) => (
                    <div
                      key={i}
                      className="border border-[var(--border-color)] rounded-lg p-3 grid grid-cols-[1fr,1fr,auto] gap-2"
                    >
                      <InputSmall
                        placeholder="Container Port"
                        value={p.container}
                        onChange={(e) =>
                          setPorts(
                            ports.map((port, idx) =>
                              idx === i
                                ? { ...port, container: e.target.value }
                                : port
                            )
                          )
                        }
                      />
                      <InputSmall
                        placeholder="Host Port"
                        value={p.host}
                        onChange={(e) =>
                          setPorts(
                            ports.map((port, idx) =>
                              idx === i
                                ? { ...port, host: e.target.value }
                                : port
                            )
                          )
                        }
                      />
                      <RemoveButton onClick={() => removePort(i)} />
                    </div>
                  ))}
                </div>
              </Section>

              {/* ENV */}
              <Section
                title="Environment Variables"
                action={<AddButton onClick={addEnv} />}
              >
                <div className="space-y-3">
                  {envVars.map((e, i) => (
                    <div
                      key={i}
                      className="border border-[var(--border-color)] rounded-lg p-3 grid grid-cols-[1fr,1fr,auto] gap-2"
                    >
                      <InputSmall
                        placeholder="KEY"
                        value={e.key}
                        onChange={(ev) =>
                          setEnvVars(
                            envVars.map((env, idx) =>
                              idx === i
                                ? { ...env, key: ev.target.value }
                                : env
                            )
                          )
                        }
                      />
                      <InputSmall
                        placeholder="VALUE"
                        value={e.value}
                        onChange={(ev) =>
                          setEnvVars(
                            envVars.map((env, idx) =>
                              idx === i
                                ? { ...env, value: ev.target.value }
                                : env
                            )
                          )
                        }
                      />
                      <RemoveButton onClick={() => removeEnv(i)} />
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* STEP 3 — VOLUMES */}
          {step === 3 && (
            <Section
              title="Volumes"
              action={<AddButton onClick={addVolume} />}
            >
              <div className="space-y-3">
                {volumes.map((v, i) => (
                  <div
                    key={i}
                    className="border border-[var(--border-color)] rounded-lg p-3 grid grid-cols-[1fr,1fr,auto] gap-2"
                  >
                    <InputSmall
                      placeholder="Host Path"
                      value={v.host}
                      onChange={(e) =>
                        setVolumes(
                          volumes.map((vol, idx) =>
                            idx === i
                              ? { ...vol, host: e.target.value }
                              : vol
                          )
                        )
                      }
                    />

                    <InputSmall
                      placeholder="Container Path"
                      value={v.container}
                      onChange={(e) =>
                        setVolumes(
                          volumes.map((vol, idx) =>
                            idx === i
                              ? { ...vol, container: e.target.value }
                              : vol
                          )
                        )
                      }
                    />

                    <RemoveButton onClick={() => removeVolume(i)} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* STEP 4 — ADVANCED */}
          {step === 4 && (
            <div className="space-y-6">
              <Section title="Networking">
                <Select
                  label="Network"
                  value={selectedNetwork}
                  onChange={setSelectedNetwork}
                  options={networks.map((n) => n.Name)}
                />
              </Section>

              <Section title="Restart Policy">
                <Select
                  label="Policy"
                  value={restartPolicy}
                  onChange={setRestartPolicy}
                  options={["no", "always", "unless-stopped", "on-failure"]}
                />
              </Section>

              <Section title="Execution">
                <Input
                  label="Command"
                  placeholder='e.g. "npm start"'
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                />
                <Input
                  label="Entrypoint"
                  placeholder='e.g. ["node"]'
                  value={entrypoint}
                  onChange={(e) => setEntrypoint(e.target.value)}
                />
              </Section>

              <Section title="Resources">
                <Input
                  label="CPU Limit (%)"
                  type="number"
                  value={cpuLimit}
                  onChange={(e) => setCpuLimit(e.target.value)}
                />
                <Input
                  label="Memory Limit (MB)"
                  type="number"
                  value={memoryLimit}
                  onChange={(e) => setMemoryLimit(e.target.value)}
                />
              </Section>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoStart}
                  onChange={(e) => setAutoStart(e.target.checked)}
                />
                <label className="text-sm">Start container after creation</label>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-between mt-4">
          <button
            disabled={step === 1}
            onClick={back}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 border border-[var(--border-color)] ${
              step === 1
                ? "opacity-40 cursor-default"
                : "hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={next}
              className="px-4 py-2 rounded-lg bg-[var(--accent-blue)] text-white flex items-center gap-2 hover:opacity-90"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="px-5 py-2.5 rounded-lg bg-[var(--accent-blue)] text-white font-medium hover:opacity-90"
            >
              Create Container
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* Small Components — clean + reusable */
function Section({ title, action, children }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-sm text-[var(--txt-secondary)]">
        {label}
      </label>
      <input
        {...props}
        className="
          w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)]
          border border-[var(--border-color)]
          text-[var(--txt-primary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/40
        "
      />
    </div>
  );
}

function InputSmall(props) {
  return (
    <input
      {...props}
      className="
        w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)]
        border border-[var(--border-color)]
        text-[var(--txt-primary)]
        text-sm
      "
    />
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      {label && (
        <label className="block mb-1 text-sm text-[var(--txt-secondary)]">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)]
          border border-[var(--border-color)]
          text-[var(--txt-primary)]
        "
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function AddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-[var(--accent-blue)] text-sm flex items-center gap-1 hover:opacity-80"
    >
      <Plus size={16} /> Add
    </button>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        p-2 rounded-md hover:bg-[var(--bg-tertiary)]
        text-red-400 transition flex items-center justify-center
      "
    >
      <Trash2 size={16} />
    </button>
  );
}
