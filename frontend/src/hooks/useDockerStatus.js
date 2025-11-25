import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function useDockerStatus() {
  const [dockerDown, setDockerDown] = useState(false);
  const [checking, setChecking] = useState(true);

  const check = async () => {
    setChecking(true);
    try {
      // MOST RELIABLE ENDPOINT THAT TALKS TO DOCKER DIRECTLY
      await api.get("/system/info");

      setDockerDown(false);
    } catch (err) {
      setDockerDown(true);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    check();
  }, []);

  return { dockerDown, checking, refreshDockerStatus: check };
}
