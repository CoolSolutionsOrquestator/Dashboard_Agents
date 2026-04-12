import { DollarSign, Bot, Zap } from 'lucide-react';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TokenActivityChart } from '../../components/charts/TokenActivityChart';
import { useMetrics } from '../../hooks/useMetrics';
import { useAgents } from '../../hooks/useAgents';
import { useTokenActivity } from '../../hooks/useTokenActivity';

function formatTokens(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(2)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
  return tokens.toString();
}

function formatCost(cost: number): string {
  return `$${cost.toFixed(2)}`;
}

export function DashboardPage() {
  const { metrics, loading: metricsLoading } = useMetrics();
  const { agents, loading: agentsLoading } = useAgents();
  const { activity, loading: activityLoading } = useTokenActivity();

  const topAgents = [...agents].sort((a, b) => b.totalTokens - a.totalTokens).slice(0, 3);

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
          subtitle="2 idle · 1 offline · 1 error"
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
    </div>
  );
}