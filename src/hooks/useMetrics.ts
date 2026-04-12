import { useState, useEffect } from 'react';
import type { SystemMetrics } from '../types';
import { getMetrics } from '../services/dataService';

export function useMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics()
      .then(setMetrics)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { metrics, loading, error };
}