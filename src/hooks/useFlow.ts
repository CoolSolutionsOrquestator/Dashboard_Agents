import { useState, useEffect } from 'react';
import type { FlowNode, FlowEdge, ChatLog } from '../types';
import { getFlowNodes, getFlowEdges, getChatLogs } from '../services/dataService';

export function useFlow() {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getFlowNodes(), getFlowEdges(), getChatLogs()])
      .then(([nodesData, edgesData, logsData]) => {
        setNodes(nodesData);
        setEdges(edgesData);
        setLogs(logsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { nodes, edges, logs, loading, error };
}