import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { StatusBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { X, Mail, Building, Calendar, DollarSign, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CustomerDetailsModal: React.FC = () => {
  const { selectedCustomer, setSelectedCustomer, showToast } = useDashboard();

  if (!selectedCustomer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
              {selectedCustomer.avatarInitials}
            </div>
            <div>
              <h3 id="customer-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                {selectedCustomer.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedCustomer.company}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCustomer(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">Total LTV Spend</span>
              <span className="text-base font-bold font-mono-numbers text-slate-900 dark:text-white">
                {formatCurrency(selectedCustomer.totalSpend)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">Total Orders</span>
              <span className="text-base font-bold font-mono-numbers text-slate-900 dark:text-white">
                {selectedCustomer.ordersCount}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">Status</span>
              <StatusBadge status={selectedCustomer.status} />
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3 border border-slate-100 dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {selectedCustomer.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Company Account
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {selectedCustomer.company}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Subscription Tier
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {selectedCustomer.plan} Plan
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Customer Since
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatDate(selectedCustomer.joinedDate)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                Last Activity
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {selectedCustomer.lastActive}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={() => {
              showToast(`Contact email copied to clipboard: ${selectedCustomer.email}`, 'info');
              navigator.clipboard?.writeText(selectedCustomer.email);
            }}
            className="px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
          >
            Copy Email
          </button>
          <button
            onClick={() => setSelectedCustomer(null)}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
