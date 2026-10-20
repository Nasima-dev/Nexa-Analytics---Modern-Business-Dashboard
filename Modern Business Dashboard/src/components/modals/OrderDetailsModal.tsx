import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { StatusBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { X, Download, User, Calendar, CreditCard, PackageCheck, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../../types/dashboard';

export const OrderDetailsModal: React.FC = () => {
  const { selectedOrder, setSelectedOrder, updateOrderStatus, showToast } = useDashboard();

  if (!selectedOrder) return null;

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(selectedOrder.id, newStatus);
  };

  const handleDownloadInvoice = () => {
    const invoiceText = `================================================
NEXA ANALYTICS - ORDER INVOICE (DEMO RECEIPT)
================================================
Order ID:       ${selectedOrder.id}
Date:           ${formatDate(selectedOrder.date)}
Customer:       ${selectedOrder.customerName}
Email:          ${selectedOrder.customerEmail}
Payment Method: ${selectedOrder.paymentMethod}
Status:         ${selectedOrder.status}

------------------------------------------------
LINE ITEMS:
1. ${selectedOrder.product}
   Category: ${selectedOrder.category}
   Quantity: ${selectedOrder.itemsCount}
   Subtotal: ${formatCurrency(selectedOrder.amount)}

Estimated Tax:  $0.00
Grand Total:    ${formatCurrency(selectedOrder.amount)}
------------------------------------------------
Note: This is a generated portfolio demonstration receipt.
Platform: Nexa Analytics SaaS Dashboard Demo
================================================`;

    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${selectedOrder.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Invoice for ${selectedOrder.id} downloaded successfully.`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 id="order-modal-title" className="text-base font-bold text-slate-900 dark:text-white font-mono-numbers">
                Order #{selectedOrder.id}
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                Demo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Processed on {formatDate(selectedOrder.date)}
            </p>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status and quick summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                Current Status
              </span>
              <StatusBadge status={selectedOrder.status} />
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                Total Amount
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono-numbers">
                {formatCurrency(selectedOrder.amount)}
              </span>
            </div>
          </div>

          {/* Customer & Payment details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Customer
              </span>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedOrder.customerName}
              </div>
              <div className="text-slate-500 dark:text-slate-400 truncate">
                {selectedOrder.customerEmail}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Payment Method
              </span>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedOrder.paymentMethod}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Authorized & Verified
              </div>
            </div>
          </div>

          {/* Product Line Item */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <PackageCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Purchased Plan & Services</span>
            </div>
            <div className="flex items-start justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {selectedOrder.product}
                </p>
                <p className="text-slate-400 text-[11px]">
                  Category: {selectedOrder.category} · Qty: {selectedOrder.itemsCount}
                </p>
              </div>
              <span className="font-semibold font-mono-numbers text-slate-900 dark:text-white">
                {formatCurrency(selectedOrder.amount)}
              </span>
            </div>
            <div className="pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-500">Tax / Handling</span>
              <span className="font-mono-numbers text-slate-500">$0.00</span>
            </div>
            <div className="pt-1 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-900 dark:text-white">Total</span>
              <span className="font-mono-numbers text-indigo-600 dark:text-indigo-400">
                {formatCurrency(selectedOrder.amount)}
              </span>
            </div>
          </div>

          {/* Interactive Status Changer */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Change Order Status (Demo Control)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Completed', 'Pending', 'Cancelled'] as OrderStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                    selectedOrder.status === st
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDownloadInvoice}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Invoice</span>
          </button>
          <button
            onClick={() => setSelectedOrder(null)}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
