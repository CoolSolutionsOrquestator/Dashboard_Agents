import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultLegendContent';

interface ModelCostData {
  modelId: string;
  modelName: string;
  cost: number;
  tokens: number;
}

interface CostModelPieChartProps {
  data: ModelCostData[];
  loading: boolean;
}

const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

function formatCost(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function CostModelPieChart({ data, loading }: CostModelPieChartProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="h-72 animate-pulse rounded-lg bg-gray-800" />
      </div>
    );
  }

  // Filter out zero-cost models for the pie chart, but keep at least one
  const chartData = data.filter((d) => d.cost > 0).length > 0
    ? data.filter((d) => d.cost > 0).map((d) => ({
        name: d.modelName,
        value: d.cost,
      }))
    : data.map((d) => ({
        name: d.modelName,
        value: d.tokens || 1, // Fallback to token distribution if costs are all zero
      }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#f3f4f6"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderLegend = (props: { payload?: Payload[] }) => {
    const { payload } = props;
    if (!payload) return null;
    return (
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {payload.map((entry, index) => (
          <div key={entry.value} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-gray-300">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const hasCosts = data.some((d) => d.cost > 0);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h3 className="mb-1 text-lg font-semibold">Distribución por Modelo</h3>
      <p className="mb-4 text-sm text-gray-400">
        {hasCosts ? 'Costo acumulado por modelo' : 'Distribución de tokens por modelo'}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
            strokeWidth={0}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="stroke-gray-900 stroke-1"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
              fontSize: '13px',
            }}
            formatter={(value: number, name: string) => {
              const pct = ((value / total) * 100).toFixed(1);
              return hasCosts
                ? [`${formatCost(value)} (${pct}%)`, name]
                : [`${value.toLocaleString()} tokens (${pct}%)`, name];
            }}
          />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}