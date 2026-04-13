import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface AgentCostData {
  agentId: string;
  agentName: string;
  cost: number;
  tokens: number;
}

interface CostAgentBarChartProps {
  data: AgentCostData[];
  loading: boolean;
}

const BAR_COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

function formatCost(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

export function CostAgentBarChart({ data, loading }: CostAgentBarChartProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="h-72 animate-pulse rounded-lg bg-gray-800" />
      </div>
    );
  }

  const hasCosts = data.some((d) => d.cost > 0);

  // Sort by cost (or tokens as fallback) descending, take top agents
  const sorted = [...data]
    .sort((a, b) => hasCosts ? b.cost - a.cost : b.tokens - a.tokens)
    .slice(0, 5)
    .map((d) => ({
      name: d.agentName,
      value: hasCosts ? d.cost : d.tokens,
      // Short name for Y-axis label
      shortName: d.agentName.length > 14 ? d.agentName.slice(0, 12) + '…' : d.agentName,
    }));

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h3 className="mb-1 text-lg font-semibold">Top Agentes</h3>
      <p className="mb-4 text-sm text-gray-400">
        {hasCosts ? 'Por costo acumulado' : 'Por consumo de tokens'}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={hasCosts ? formatCost : formatTokens}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            stroke="#6b7280"
            fontSize={12}
            width={100}
            tick={{ fill: '#d1d5db' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
              fontSize: '13px',
            }}
            formatter={(value: number) => {
              return hasCosts
                ? [formatCost(value), 'Costo']
                : [formatTokens(value), 'Tokens'];
            }}
            labelFormatter={(label) => {
              const match = sorted.find((d) => d.shortName === label);
              return match?.name ?? label;
            }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
            {sorted.map((_, index) => (
              <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}