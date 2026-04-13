import { useMemo } from 'react';
import { DollarSign, Bot, Zap, AlertTriangle } from 'lucide-react';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TokenActivityChart } from '../../components/charts/TokenActivityChart';
import { useMetrics } from '../../hooks/useMetrics';
import { useAgents } from '../../hooks/useAgents';
import { useTokenActivity } from '../../hooks/useTokenActivity';
import { formatTokens, formatCost } from '../../utils/format';

interface Alert {
  id: string;
  message: string;
  severity: 'error' | 'warning';
}

export function DashboardPage() {
  const { metrics, loading: metricsLoading } = useMetrics();
  const { agents, loading: agentsLoading } = useAgents();
  const { activity, loading: activityLoading } = useTokenActivity();

  const topAgents = useMemo(
    () => [...agents].sort((a, b) => b.totalTokens - a.totalTokens).slice(0, 3),
    [agents]
  );

  // Dynamic subtitle for Active Agents card
  const activeAgentsSubtitle = useMemo(() => {
    if (agentsLoading || agents.length === 0) return '';
    const counts: Record<string, number> = {};
    for (const a of agents) {
      if (a.status !== 'active') {
        counts[a.status] = (counts[a.status] || 0) + 1;
      }
    }
    const parts: string[] = [];
    if (counts.idle) parts.push(`${counts.idle} idle`);
    if (counts.offline) parts.push(`${counts.offline} offline`);
    if (counts.error) parts.push(`${counts.error} error`);
    return parts.length > 0 ? parts.join(' · ') : 'Todos activos';
  }, [agents, agentsLoading]);

  // Dynamic alerts
  const alerts = useMemo<Alert[]>(() => {
    const result: Alert[] = [];
    const now = Date.now();
    const H24 = 24 * 60 * 60 * 1000;
    for (const a of agents) {
      if (a.status === 'error') {
        result.push({
          id: `error-${a.id}`,
          message: `${a.name} en estado error`,
          severity: 'error',
        });
      }
      if (a.status === 'offline') {
        const lastActive = new Date(a.lastActive).getTime();
        if (now - lastActive > H24) {
          result.push({
            id: `offline-${a.id}`,
            message: `${a.name} sin actividad hace más de 24h`,
            severity: 'warning',
          });
        }
      }
    }
    return result;
  }, [agents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-400">
          Resumen general de tus agentes y consumo
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Costo Total Acumulado"
          value={metricsLoading ? '...' : formatCost(metrics?.totalCost ?? 0)}
          subtitle="Ollama Cloud Pro: $20/mes"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: '5% esta semana', positive: true }}
        />
        <MetricCard
          title="Agentes Activos"
          value={
            metricsLoading
              ? '...'
              : `${metrics?.activeAgents} / ${metrics?.totalAgents}`
          }
          subtitle={activeAgentsSubtitle}
          icon={<Bot className="h-5 w-5" />}
        />
        <MetricCard
          title="Tokens Consumidos"
          value={metricsLoading ? '...' : formatTokens(metrics?.totalTokens ?? 0)}
          subtitle="Acumulado total"
          icon={<Zap className="h-5 w-5" />}
          trend={{ value: '12% esta semana', positive: true }}
        />
      </div>

      {/* Chart + Top Agents */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Token Activity Chart - 3 cols */}
        <div className="lg:col-span-3">
          <TokenActivityChart data={activity} loading={activityLoading} />
        </div>

        {/* Top Agents - 2 cols */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-1 text-lg font-semibold">Top Agentes</h3>
            <p className="mb-4 text-sm text-gray-400">Por consumo de tokens</p>

            {agentsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-lg bg-gray-800"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topAgents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.modelId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-300">
                        {formatTokens(agent.totalTokens)}
                      </span>
                      <StatusBadge status={agent.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {!agentsLoading && alerts.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-semibold">Alertas</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
                  alert.severity === 'error'
                    ? 'border-red-800/50 bg-red-900/10 text-red-400'
                    : 'border-amber-800/50 bg-amber-900/10 text-amber-400'
                }`}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}