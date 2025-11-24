import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function useSystemSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await api.get("/system/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch system summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary, loading, refresh: fetchSummary };
}
