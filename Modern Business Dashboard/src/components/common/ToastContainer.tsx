import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDashboard();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-white/95 dark:bg-slate-900/95 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100'
              : toast.type === 'error'
              ? 'bg-white/95 dark:bg-slate-900/95 border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-100'
              : 'bg-white/95 dark:bg-slate-900/95 border-indigo-200 dark:border-indigo-800 text-slate-800 dark:text-slate-100'
          }`}
          role="alert"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
          </div>
          <div className="flex-1 text-xs font-medium leading-relaxed">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
