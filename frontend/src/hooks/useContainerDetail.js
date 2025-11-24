import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function useContainerDetail(id) {
  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/containers/${id}`);
      setContainer(res.data);
    } catch (err) {
      console.error("Failed to fetch container detail", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  return { container, loading };
}
