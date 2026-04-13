import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let addToastFn: ((message: string, type: ToastType) => void) | null = null;

export function showToast(message: string, type: ToastType = 'success') {
  if (addToastFn) {
    addToastFn(message, type);
  }
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-green-400" />,
  error: <XCircle className="h-4 w-4 text-red-400" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-400" />,
  info: <Info className="h-4 w-4 text-blue-400" />,
};

const bgMap: Record<ToastType, string> = {
  success: 'border-green-800/50 bg-green-900/20',
  error: 'border-red-800/50 bg-red-900/20',
  warning: 'border-amber-800/50 bg-amber-900/20',
  info: 'border-blue-800/50 bg-blue-900/20',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 ${bgMap[toast.type]}`}
        >
          {iconMap[toast.type]}
          <span className="text-sm text-gray-200">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 rounded p-0.5 text-gray-500 hover:text-gray-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}