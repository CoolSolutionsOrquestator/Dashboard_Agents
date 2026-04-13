import { useState, useMemo } from 'react';
import { DollarSign, Calendar, Loader2 } from 'lucide-react';
import { useCosts } from '../../hooks/useCosts';
import { useModels } from '../../hooks/useModels';
import { useMetrics } from '../../hooks/useMetrics';
import { CostModelPieChart } from '../../components/charts/CostModelPieChart';
import { CostAgentBarChart } from '../../components/charts/CostAgentBarChart';
import { CostBreakdownTable } from '../../components/ui/CostBreakdownTable';
import { formatCost, formatTokens } from '../../utils/format';

type TimeRange = '7d' | '30d' | 'all';

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: 'all', label: 'Todo' },
];

export function CostsPage() {
  const { data: costData, loading: costsLoading, error: costsError } = useCosts();
  const { models, loading: modelsLoading } = useModels();
  const { metrics, loading: metricsLoading } = useMetrics();

  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const isLoading = costsLoading || modelsLoading || metricsLoading;

  // Compute total cost from metrics (system-wide)
  const totalSystemCost = metrics?.totalCost ?? 0;

  // Compute total tokens
  const totalTokens = useMemo(() => {
    if (!costData) return 0;
    return costData.byModel.reduce((sum, m) => sum + m.tokens, 0);
  }, [costData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Análisis de Costos</h1>
          <p className="text-sm text-gray-400">
            Desglose y análisis de costos por modelo y agente
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div className="flex rounded-lg border border-gray-700 bg-gray-800 p-0.5">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {costsError && (
        <div className="rounded-xl border border-red-800 bg-red-900/20 p-4 text-sm text-red-400">
          Error al cargar datos de costos: {costsError}
        </div>
      )}

      {/* Total Cost Card */}
      <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950/30 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Costo Total del Sistema</p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white">
              {metricsLoading ? (
                <span className="inline-block h-10 w-28 animate-pulse rounded bg-gray-800" />
              ) : (
                formatCost(totalSystemCost)
              )}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {isLoading ? '' : `${formatTokens(totalTokens)} tokens procesados · ${models.length} modelos activos`}
            </p>
          </div>
          <div className="rounded-xl bg-indigo-500/10 p-3">
            <DollarSign className="h-7 w-7 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Charts Row: Pie + Bar side-by-side */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CostModelPieChart
          data={costData?.byModel ?? []}
          loading={isLoading}
        />
        <CostAgentBarChart
          data={costData?.byAgent ?? []}
          loading={isLoading}
        />
      </div>

      {/* Breakdown Table */}
      <CostBreakdownTable
        models={models}
        byModel={costData?.byModel ?? []}
        loading={isLoading}
      />
    </div>
  );
}