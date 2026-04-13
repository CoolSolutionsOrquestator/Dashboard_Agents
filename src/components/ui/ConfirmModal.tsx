import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'primary' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        </div>

        <p className="mb-6 text-sm text-gray-300">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${variantStyles[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}