import { useState, useEffect } from 'react';

interface FetchState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const useFetchUsers = (roleFilter: string, statusFilter: string) => {
  const [state, setState] = useState<FetchState>({ loading: true, data: [], error: null });

  useEffect(() => {
    let url = 'http://localhost:3001/users';
    const params = [];
    if (roleFilter) params.push(`role=${encodeURIComponent(roleFilter)}`);
    if (statusFilter) params.push(`status=${encodeURIComponent(statusFilter)}`);
    if (params.length) url += `?${params.join('&')}`;

    setState({ loading: true, data: [], error: null });

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setState({ loading: false, data, error: null }))
      .catch(error => setState({ loading: false, data: [], error: error.message }));
  }, [roleFilter, statusFilter]);

  return { ...state };
};

export default useFetchUsers;
