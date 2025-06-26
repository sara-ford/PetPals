import { useState, useEffect } from 'react';

export function useApiFetch<T = any>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();
        if (!isCancelled) setData(result);
      } catch (err: any) {
        if (!isCancelled) setError(err.message || 'שגיאה בקריאה לשרת');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isCancelled = true; // ביטול אם הקומפוננטה הוסרה
    };
  }, [url, JSON.stringify(options)]); // נזהר בשימוש באובייקטים

  return { data, loading, error };
}
