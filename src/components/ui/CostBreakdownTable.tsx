import type { Model } from '../../types';
import { formatTokens, formatCost } from '../../utils/format';

interface ModelCostRow {
  modelId: string;
  modelName: string;
  cost: number;
  tokens: number;
}

interface CostBreakdownTableProps {
  models: Model[];
  byModel: ModelCostRow[];
  loading: boolean;
}

interface EnrichedRow {
  modelName: string;
  provider: string;
  tokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export function CostBreakdownTable({ models, byModel, loading }: CostBreakdownTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="mb-1 text-lg font-semibold">Desglose por Modelo</h3>
        <p className="mb-4 text-sm text-gray-400">Detalle de costos y tokens</p>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (byModel.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="mb-1 text-lg font-semibold">Desglose por Modelo</h3>
        <p className="mb-4 text-sm text-gray-400">Detalle de costos y tokens</p>
        <p className="text-sm text-gray-500">No hay datos para los filtros seleccionados</p>
      </div>
    );
  }

  // Merge model info with cost data
  const rows: EnrichedRow[] = byModel.map((bm) => {
    const model = models.find((m) => m.id === bm.modelId);
    // Estimate input/output split: assume ~60% input, 40% output tokens
    const inputTokens = Math.round(bm.tokens * 0.6);
    const outputTokens = bm.tokens - inputTokens;
    const inputRate = model?.inputCostPer1k ?? 0;
    const outputRate = model?.outputCostPer1k ?? 0;
    const inputCost = (inputTokens / 1000) * inputRate;
    const outputCost = (outputTokens / 1000) * outputRate;

    return {
      modelName: bm.modelName,
      provider: model?.provider ?? '—',
      tokens: bm.tokens,
      inputCost,
      outputCost,
      totalCost: bm.cost > 0 ? bm.cost : inputCost + outputCost,
    };
  });

  const totals = rows.reduce(
    (acc, row) => ({
      tokens: acc.tokens + row.tokens,
      inputCost: acc.inputCost + row.inputCost,
      outputCost: acc.outputCost + row.outputCost,
      totalCost: acc.totalCost + row.totalCost,
    }),
    { tokens: 0, inputCost: 0, outputCost: 0, totalCost: 0 }
  );

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900">
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-lg font-semibold">Desglose por Modelo</h3>
        <p className="text-sm text-gray-400">Detalle de costos y consumo de tokens</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/80">
              <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                Modelo
              </th>
              <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                Provider
              </th>
              <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                Tokens
              </th>
              <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                Costo Input
              </th>
              <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                Costo Output
              </th>
              <th className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-400">
                Costo Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {rows.map((row) => (
              <tr key={row.modelName} className="transition-colors hover:bg-gray-800/50">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-100">
                  {row.modelName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                  {row.provider}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-gray-300">
                  {formatTokens(row.tokens)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-gray-300">
                  {formatCost(row.inputCost)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-gray-300">
                  {formatCost(row.outputCost)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-mono font-semibold text-gray-100">
                  {formatCost(row.totalCost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-700 bg-gray-900/60">
              <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-100">
                Total
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-gray-400">
                {rows.length} modelos
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-mono font-semibold text-gray-100">
                {formatTokens(totals.tokens)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-mono font-semibold text-gray-100">
                {formatCost(totals.inputCost)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-mono font-semibold text-gray-100">
                {formatCost(totals.outputCost)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-blue-400">
                {formatCost(totals.totalCost)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}