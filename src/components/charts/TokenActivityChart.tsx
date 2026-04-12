import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TokenActivityPoint } from '../../types';

interface TokenActivityChartProps {
  data: TokenActivityPoint[];
  loading: boolean;
}

function formatTokens(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
}

export function TokenActivityChart({ data, loading }: TokenActivityChartProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="h-64 animate-pulse rounded-lg bg-gray-800" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h3 className="mb-1 text-lg font-semibold">Consumo de Tokens</h3>
      <p className="mb-4 text-sm text-gray-400">Últimos 7 días</p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(val: string) => {
              const d = new Date(val);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={formatTokens}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
              fontSize: '13px',
            }}
            formatter={(value) => [formatTokens(value as number), 'Tokens']}
            labelFormatter={(label) => {
              const d = new Date(label as string);
              return d.toLocaleDateString('es-CL');
            }}
          />
          <Area
            type="monotone"
            dataKey="tokens"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#tokenGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}