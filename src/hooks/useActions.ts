import { useState, useCallback } from 'react';
import type { ActionExecution } from '../types';
import { executeAction, executeBatchAction, getActionHistory } from '../services/dataService';
import { getAgents } from '../services/dataService';
import type { Agent } from '../types';

interface UseActionsReturn {
  /** Loading state per agent ID */
  loadingAgents: Record<string, boolean>;
  /** Full action history */
  actionHistory: ActionExecution[];
  /** Start an agent */
  startAgent: (id: string) => Promise<ActionExecution | null>;
  /** Stop an agent */
  stopAgent: (id: string) => Promise<ActionExecution | null>;
  /** Restart an agent */
  restartAgent: (id: string) => Promise<ActionExecution | null>;
  /** Send a message to an agent */
  sendMessage: (id: string, message: string) => Promise<ActionExecution | null>;
  /** Refresh action history from the service */
  refreshHistory: () => Promise<void>;
  /** Get current agents (after state changes) */
  refreshAgents: () => Promise<Agent[]>;
  /** Batch actions */
  startAll: () => Promise<ActionExecution[]>;
  stopIdle: () => Promise<ActionExecution[]>;
  restartErrors: () => Promise<ActionExecution[]>;
  /** Global batch loading */
  batchLoading: boolean;
}

export function useActions(): UseActionsReturn {
  const [loadingAgents, setLoadingAgents] = useState<Record<string, boolean>>({});
  const [actionHistory, setActionHistory] = useState<ActionExecution[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  const withLoading = useCallback(async (agentId: string, fn: () => Promise<ActionExecution | null>): Promise<ActionExecution | null> => {
    setLoadingAgents((prev) => ({ ...prev, [agentId]: true }));
    try {
      const result = await fn();
      // Refresh history after each action
      const history = await getActionHistory();
      setActionHistory(history);
      return result;
    } catch (error) {
      console.error('Action failed:', error);
      return null;
    } finally {
      setLoadingAgents((prev) => ({ ...prev, [agentId]: false }));
    }
  }, []);

  const startAgent = useCallback(
    (id: string) => withLoading(id, () => executeAction('start', id)),
    [withLoading],
  );

  const stopAgent = useCallback(
    (id: string) => withLoading(id, () => executeAction('stop', id)),
    [withLoading],
  );

  const restartAgent = useCallback(
    (id: string) => withLoading(id, () => executeAction('restart', id)),
    [withLoading],
  );

  const sendMessage = useCallback(
    (id: string, _message: string) =>
      withLoading(id, () => executeAction('send_message', id)),
    [withLoading],
  );

  const refreshHistory = useCallback(async () => {
    const history = await getActionHistory();
    setActionHistory(history);
  }, []);

  const refreshAgents = useCallback(async () => {
    return getAgents();
  }, []);

  const startAll = useCallback(async (): Promise<ActionExecution[]> => {
    setBatchLoading(true);
    try {
      const agents = await getAgents();
      const ids = agents.map((a) => a.id);
      const results = await executeBatchAction('start', ids);
      const history = await getActionHistory();
      setActionHistory(history);
      return results;
    } finally {
      setBatchLoading(false);
    }
  }, []);

  const stopIdle = useCallback(async (): Promise<ActionExecution[]> => {
    setBatchLoading(true);
    try {
      const agents = await getAgents();
      const ids = agents.filter((a) => a.status === 'idle').map((a) => a.id);
      if (ids.length === 0) return [];
      const results = await executeBatchAction('stop', ids);
      const history = await getActionHistory();
      setActionHistory(history);
      return results;
    } finally {
      setBatchLoading(false);
    }
  }, []);

  const restartErrors = useCallback(async (): Promise<ActionExecution[]> => {
    setBatchLoading(true);
    try {
      const agents = await getAgents();
      const ids = agents.filter((a) => a.status === 'error').map((a) => a.id);
      if (ids.length === 0) return [];
      const results = await executeBatchAction('restart', ids);
      const history = await getActionHistory();
      setActionHistory(history);
      return results;
    } finally {
      setBatchLoading(false);
    }
  }, []);

  return {
    loadingAgents,
    actionHistory,
    startAgent,
    stopAgent,
    restartAgent,
    sendMessage,
    refreshHistory,
    refreshAgents,
    startAll,
    stopIdle,
    restartErrors,
    batchLoading,
  };
}