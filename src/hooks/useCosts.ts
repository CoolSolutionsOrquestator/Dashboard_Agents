import { useState, useEffect } from 'react';
import type { CostTimelinePoint } from '../types';
import { getCosts } from '../services/dataService';

interface CostData {
  timeline: CostTimelinePoint[];
  byModel: { modelId: string; modelName: string; cost: number; tokens: number }[];
  byAgent: { agentId: string; agentName: string; cost: number; tokens: number }[];
}

export function useCosts() {
  const [data, setData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCosts()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}