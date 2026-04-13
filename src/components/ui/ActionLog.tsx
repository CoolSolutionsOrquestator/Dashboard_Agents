import { CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import type { ActionExecution } from '../../types';
import { formatRelativeTime } from '../../utils/format';

interface ActionLogProps {
  history: ActionExecution[];
  loading?: boolean;
}

const actionLabelMap: Record<string, string> = {
  start: 'Iniciar',
  stop: 'Detener',
  restart: 'Reiniciar',
  send_message: 'Enviar mensaje',
};

const statusConfig: Record<string, { icon: React.ReactNode; colorClass: string }> = {
  success: {
    icon: <CheckCircle className="h-3.5 w-3.5 text-green-400" />,
    colorClass: 'text-green-400',
  },
  pending: {
    icon: <Clock className="h-3.5 w-3.5 text-amber-400" />,
    colorClass: 'text-amber-400',
  },
  failed: {
    icon: <XCircle className="h-3.5 w-3.5 text-red-400" />,
    colorClass: 'text-red-400',
  },
};

export function ActionLog({ history, loading }: ActionLogProps) {
  const entries = history.slice(0, 10);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold">Log de Actividad</h3>
        {entries.length > 0 && (
          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
            {entries.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-800" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="py-8 text-center">
          <Zap className="mx-auto mb-2 h-8 w-8 text-gray-600" />
          <p className="text-sm text-gray-500">
            No hay acciones registradas aún
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const status = statusConfig[entry.status] ?? statusConfig.pending;
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-800/30 px-4 py-3 text-sm"
              >
                {status.icon}
                <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="font-medium text-gray-200">{entry.agentName}</span>
                  <span className="text-gray-500">—</span>
                  <span className={status.colorClass}>
                    {actionLabelMap[entry.action] ?? entry.action}
                  </span>
                  {entry.status === 'success' && (
                    <span className="text-gray-500">✓</span>
                  )}
                </div>
                <span className="flex-shrink-0 text-xs text-gray-600">
                  {formatRelativeTime(entry.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}