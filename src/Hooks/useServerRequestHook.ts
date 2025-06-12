import { useEffect, useState } from 'react';

export function useServerRequest<T>(
  requestFn: () => Promise<T>,
  {
    onLoad,
    onSuccess,
    onError,
    autoLoad = true,
  }: {
    onLoad?: () => void;
    onSuccess?: (data: T) => void;
    onError?: (err: any) => void;
    autoLoad?: boolean;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    onLoad?.();
    try {
      const result = await requestFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      setError(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
