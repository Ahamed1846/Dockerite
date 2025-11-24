import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function useContainers() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContainers = async () => {
    try {
      const res = await api.get("/containers");
      setContainers(res.data);
    } catch (err) {
      console.error("Failed to fetch containers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return { containers, loading, refresh: fetchContainers };
}
