import React, { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { StatusBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { OrderItem, OrderStatus } from '../../types/dashboard';
import { exportToCSV } from '../../utils/exportCsv';
import {
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

type SortField = 'date' | 'amount' | 'customerName' | 'status' | 'id';
type SortOrder = 'asc' | 'desc';

export const SalesView: React.FC = () => {
  const { orders, setSelectedOrder, globalSearch, showToast } = useDashboard();

  const [searchQuery, setSearchQuery] = useState(globalSearch || '');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesStatus =
          statusFilter === 'All' || order.status === statusFilter;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query) ||
          order.product.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'date') {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortField === 'amount') {
          comparison = a.amount - b.amount;
        } else if (sortField === 'customerName') {
          comparison = a.customerName.localeCompare(b.customerName);
        } else if (sortField === 'status') {
          comparison = a.status.localeCompare(b.status);
        } else if (sortField === 'id') {
          comparison = a.id.localeCompare(b.id);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [orders, searchQuery, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV('Nexa_Sales_Orders', filteredOrders, {
        id: 'Order ID',
        customerName: 'Customer Name',
        customerEmail: 'Email',
        product: 'Product Plan',
        category: 'Category',
        date: 'Order Date',
        amount: 'Total Amount ($)',
        status: 'Status',
        paymentMethod: 'Payment Method',
        itemsCount: 'Seats / Qty',
        customerAvatar: 'Avatar',
      });
      showToast(`${filteredOrders.length} orders exported to CSV file`, 'success');
    } catch {
      showToast('No orders available to export', 'error');
    }
  };

  // Status counts
  const totalCount = orders.length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const cancelledCount = orders.filter((o) => o.status === 'Cancelled').length;

  return (
    <div className="space-y-6">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Volume</span>
            <div className="text-xl font-bold font-mono-numbers text-slate-900 dark:text-white mt-0.5">
              {totalCount}
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-indigo-500" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Completed</span>
            <div className="text-xl font-bold font-mono-numbers text-emerald-600 dark:text-emerald-400 mt-0.5">
              {completedCount}
            </div>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Pending Review</span>
            <div className="text-xl font-bold font-mono-numbers text-amber-600 dark:text-amber-400 mt-0.5">
              {pendingCount}
            </div>
          </div>
          <Clock className="w-5 h-5 text-amber-500" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Cancelled</span>
            <div className="text-xl font-bold font-mono-numbers text-rose-600 dark:text-rose-400 mt-0.5">
              {cancelledCount}
            </div>
          </div>
          <XCircle className="w-5 h-5 text-rose-500" />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, clients..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['All', 'Completed', 'Pending', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    statusFilter === st
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-semibold select-none">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Order ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('customerName')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Customer</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Product Tier</th>
                <th
                  onClick={() => handleSort('date')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('amount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                    {order.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {order.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{order.product}</span>
                    <span className="text-[11px] text-slate-400 block">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {formatDate(order.date)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No transactions match your search criteria. Try modifying your filter or clear query.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-semibold font-mono-numbers text-slate-800 dark:text-slate-200">
              {filteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold font-mono-numbers text-slate-800 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold font-mono-numbers text-slate-800 dark:text-slate-200">
              {filteredOrders.length}
            </span>{' '}
            orders
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-slate-200 dark:border-slate-700 enabled:hover:bg-slate-100 dark:enabled:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono-numbers px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded-md border border-slate-200 dark:border-slate-700 enabled:hover:bg-slate-100 dark:enabled:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
