import { useState, useEffect } from 'react';

interface FetchState<T> {
  loading: boolean;
  data: T[];
  error: string | null;
}

interface FetchOptions {
  endpoint: string;
  filters?: Record<string, string>;
  page?: number;
  limit?: number;
  query?: string; // New parameter for custom query strings
}

const useFetch = <T>({ endpoint, filters = {}, page, limit, query }: FetchOptions) => {
  const [state, setState] = useState<FetchState<T>>({ loading: true, data: [], error: null });

  useEffect(() => {
    let url = `http://localhost:3001/${endpoint}`;
    const params = new URLSearchParams();

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, encodeURIComponent(value));
    });

    // Add pagination
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());

    // Add custom query
    if (query) {
      const queryParams = new URLSearchParams(query);
      queryParams.forEach((value, key) => {
        params.append(key, value);
      });
    }

    if (params.toString()) url += `?${params.toString()}`;

    setState({ loading: true, data: [], error: null });

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setState({ loading: false, data, error: null }))
      .catch(error => setState({ loading: false, data: [], error: error.message }));
  }, [endpoint, filters, page, limit, query]);

  return { ...state };
};

export default useFetch;
