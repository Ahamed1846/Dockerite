import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function useNetworks() {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNetworks = async () => {
    try {
      const res = await api.get("/networks");
      setNetworks(res.data);
    } catch (err) {
      console.error("Failed to fetch networks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  return { networks, loading, refresh: fetchNetworks };
}
