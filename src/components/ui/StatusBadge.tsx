import type { AgentStatus } from '../../types';

interface StatusBadgeProps {
  status: AgentStatus;
}

const statusConfig: Record<AgentStatus, { label: string; dotClass: string; bgClass: string; textClass: string }> = {
  active: {
    label: 'Activo',
    dotClass: 'bg-green-500',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-400',
  },
  idle: {
    label: 'Inactivo',
    dotClass: 'bg-yellow-500',
    bgClass: 'bg-yellow-500/10',
    textClass: 'text-yellow-400',
  },
  offline: {
    label: 'Offline',
    dotClass: 'bg-gray-500',
    bgClass: 'bg-gray-500/10',
    textClass: 'text-gray-400',
  },
  error: {
    label: 'Error',
    dotClass: 'bg-red-500',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-400',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgClass} ${config.textClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}