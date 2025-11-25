import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function useVolumes() {
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolumes = async () => {
    try {
      const res = await api.get("/volumes");
      setVolumes(res.data);
    } catch (err) {
      console.error("Failed to fetch volumes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumes();
  }, []);

  return { volumes, loading, refresh: fetchVolumes };
}
