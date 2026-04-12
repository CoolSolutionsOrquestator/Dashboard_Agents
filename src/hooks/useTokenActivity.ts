import { useState, useEffect } from 'react';
import type { TokenActivityPoint } from '../types';
import { getTokenActivity } from '../services/dataService';

export function useTokenActivity() {
  const [activity, setActivity] = useState<TokenActivityPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTokenActivity()
      .then(setActivity)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { activity, loading, error };
}