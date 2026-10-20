import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { OrderStatus } from '../../types/dashboard';

interface StatusBadgeProps {
  status: OrderStatus | 'Active' | 'Churned' | 'Trial';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Completed':
    case 'Active':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Pending':
    case 'Trial':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Cancelled':
    case 'Churned':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
    default:
      return (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {status}
        </span>
      );
  }
};
