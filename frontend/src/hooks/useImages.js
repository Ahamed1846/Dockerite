import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function useImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const res = await api.get("/images");
      setImages(res.data);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return { images, loading, refresh: fetchImages };
}
