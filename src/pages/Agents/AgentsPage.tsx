import { useState, useMemo, useCallback } from 'react';
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, Bot, Search, Play, Square, RotateCcw, Loader2 } from 'lucide-react';
import { useAgents } from '../../hooks/useAgents';
import { useActions } from '../../hooks/useActions';
import { useModels } from '../../hooks/useModels';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { showToast } from '../../components/ui/ToastContainer';
import { formatTokens, formatCost, formatRelativeTime } from '../../utils/format';
import type { AgentStatus, Agent } from '../../types';

type SortField = 'totalTokens' | 'totalCost';
type SortDir = 'asc' | 'desc';

const STATUS_OPTIONS: { value: AgentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activo' },
  { value: 'idle', label: 'Idle' },
  { value: 'offline', label: 'Offline' },
  { value: 'error', label: 'Error' },
];

// Action buttons config based on agent status
function getActionButtons(agent: Agent) {
  const buttons: { action: 'start' | 'stop' | 'restart'; label: string; icon: React.ReactNode; variant: 'primary' | 'danger' | 'warning' }[] = [];

  switch (agent.status) {
    case 'active':
      buttons.push({ action: 'stop', label: 'Detener', icon: <Square className="h-3.5 w-3.5" />, variant: 'danger' });
      break;
    case 'idle':
      buttons.push({ action: 'start', label: 'Iniciar', icon: <Play className="h-3.5 w-3.5" />, variant: 'primary' });
      buttons.push({ action: 'stop', label: 'Detener', icon: <Square className="h-3.5 w-3.5" />, variant: 'danger' });
      break;
    case 'offline':
      buttons.push({ action: 'start', label: 'Iniciar', icon: <Play className="h-3.5 w-3.5" />, variant: 'primary' });
      break;
    case 'error':
      buttons.push({ action: 'restart', label: 'Reiniciar', icon: <RotateCcw className="h-3.5 w-3.5" />, variant: 'warning' });
      break;
  }

  return buttons;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  danger: 'bg-red-600/80 hover:bg-red-600 text-white',
  warning: 'bg-amber-600/80 hover:bg-amber-600 text-white',
};

export function AgentsPage() {
  const { agents: initialAgents, loading: agentsLoading, error: agentsError } = useAgents();
  const { loadingAgents, startAgent, stopAgent, restartAgent, refreshAgents } = useActions();
  const { models, loading: modelsLoading } = useModels();

  // Local agents state that gets refreshed after actions
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  // Refresh local state when initial data changes
  useMemo(() => {
    setAgents(initialAgents);
  }, [initialAgents]);

  // Filters
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    variant: 'primary' | 'danger' | 'warning';
    onConfirm: () => void;
  }>({ open: false, title: '', message: '', variant: 'danger', onConfirm: () => {} });

  const modelOptions = useMemo(() => {
    const opts = [{ value: 'all', label: 'Todos' }];
    for (const m of models) {
      opts.push({ value: m.id, label: m.name });
    }
    return opts;
  }, [models]);

  const modelNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const m of models) {
      map[m.id] = m.name;
    }
    return map;
  }, [models]);

  const displayedAgents = useMemo(() => {
    let filtered = [...agents];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    if (modelFilter !== 'all') {
      filtered = filtered.filter((a) => a.modelId === modelFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(query));
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortDir === 'asc' ? diff : -diff;
      });
    }

    return filtered;
  }, [agents, statusFilter, modelFilter, searchQuery, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      if (sortDir === 'desc') {
        setSortDir('asc');
      } else {
        setSortField(null);
        setSortDir('desc');
      }
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-500" />;
    }
    return sortDir === 'desc' ? (
      <ArrowDown className="ml-1 h-3.5 w-3.5 text-blue-400" />
    ) : (
      <ArrowUp className="ml-1 h-3.5 w-3.5 text-blue-400" />
    );
  }

  const handleAction = useCallback(async (agent: Agent, action: 'start' | 'stop' | 'restart') => {
    const actionLabels: Record<string, string> = {
      start: 'iniciar',
      stop: 'detener',
      restart: 'reiniciar',
    };
    const confirmVariant: Record<string, 'primary' | 'danger' | 'warning'> = {
      start: 'primary',
      stop: 'danger',
      restart: 'warning',
    };

    setConfirmModal({
      open: true,
      title: `¿${actionLabels[action].charAt(0).toUpperCase() + actionLabels[action].slice(1)} ${agent.name}?`,
      message: `¿Estás seguro de que deseás ${actionLabels[action]} el agente "${agent.name}"?`,
      variant: confirmVariant[action],
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        const actionFn = action === 'start' ? startAgent : action === 'stop' ? stopAgent : restartAgent;
        const result = await actionFn(agent.id);
        if (result) {
          showToast(result.message, result.status === 'success' ? 'success' : 'error');
          // Refresh agents list to get updated statuses
          const updated = await refreshAgents();
          setAgents(updated);
        }
      },
    });
  }, [startAgent, stopAgent, restartAgent, refreshAgents]);

  const isLoading = agentsLoading || modelsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Directorio de Agentes</h1>
          <p className="text-sm text-gray-400">
            Vista completa de todos los agentes registrados
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Filter className="h-4 w-4" />
          <span>Filtros:</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AgentStatus | 'all')}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={modelFilter}
          onChange={(e) => setModelFilter(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {modelOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar agente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 py-2 pl-9 pr-3 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {(statusFilter !== 'all' || modelFilter !== 'all' || searchQuery.trim() !== '') && (
          <button
            onClick={() => {
              setStatusFilter('all');
              setModelFilter('all');
              setSearchQuery('');
            }}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-gray-400 transition-colors hover:border-red-500/50 hover:text-red-400"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Error state */}
      {agentsError && (
        <div className="rounded-xl border border-red-800 bg-red-900/20 p-4 text-sm text-red-400">
          Error al cargar agentes: {agentsError}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                  Nombre
                </th>
                <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                  Modelo
                </th>
                <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                  Estado
                </th>
                <th
                  className="group cursor-pointer whitespace-nowrap px-6 py-3.5 font-medium text-gray-400 transition-colors hover:text-gray-200"
                  onClick={() => toggleSort('totalTokens')}
                >
                  <span className="inline-flex items-center">
                    Tokens
                    <SortIcon field="totalTokens" />
                  </span>
                </th>
                <th
                  className="group cursor-pointer whitespace-nowrap px-6 py-3.5 font-medium text-gray-400 transition-colors hover:text-gray-200"
                  onClick={() => toggleSort('totalCost')}
                >
                  <span className="inline-flex items-center">
                    Costo
                    <SortIcon field="totalCost" />
                  </span>
                </th>
                <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                  Última Actividad
                </th>
                <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {isLoading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }, (_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-800" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayedAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Bot className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                    <p className="text-sm text-gray-400">
                      No se encontraron agentes con los filtros seleccionados
                    </p>
                  </td>
                </tr>
              ) : (
                displayedAgents.map((agent) => {
                  const actionBtns = getActionButtons(agent);
                  const isAgentLoading = loadingAgents[agent.id];

                  return (
                    <tr
                      key={agent.id}
                      className="transition-colors hover:bg-gray-800/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                            <Bot className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="font-medium text-gray-100">
                            {agent.name}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                        {modelNameMap[agent.modelId] ?? agent.modelId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge status={agent.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-gray-300">
                        {formatTokens(agent.totalTokens)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-gray-300">
                        {formatCost(agent.totalCost)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-400">
                        {formatRelativeTime(agent.lastActive)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          {actionBtns.map((btn) => (
                            <button
                              key={btn.action}
                              onClick={() => handleAction(agent, btn.action)}
                              disabled={isAgentLoading}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[btn.variant]}`}
                            >
                              {isAgentLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                btn.icon
                              )}
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && displayedAgents.length > 0 && (
          <div className="border-t border-gray-800 bg-gray-900/60 px-6 py-3 text-xs text-gray-500">
            Mostrando {displayedAgents.length} de {agents.length} agentes
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}