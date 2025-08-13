import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost/api/flower";

export function useFlowerList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    axios.get(`${API_BASE}/list`)
      .then((res) => {
        if (!alive) return;
        const arr = Array.isArray(res.data) ? res.data : [];
        setData(arr); // 🔹 필터링 제거 → 숨김처리된 것도 전부 포함
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return { data, loading, error };
}

export function useFlowerDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    axios.get(`${API_BASE}/detail/${id}`)
      .then((res) => {
        if (!alive) return;
        setData(res.data);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  return { data, loading, error };
}
