import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/Badge';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Eye,
  Info,
} from 'lucide-react';
import {
  kpiDataByRange,
  revenueDataByRange,
  categorySalesData,
  revenueSourceData,
  monthlyPerformanceData,
} from '../../data/sampleData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { OrderStatus } from '../../types/dashboard';

export const OverviewView: React.FC = () => {
  const {
    timeRange,
    orders,
    setSelectedOrder,
    setCurrentSection,
    globalSearch,
    showToast,
  } = useDashboard();

  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');
  const [activeMetricTab, setActiveMetricTab] = useState<'revenue' | 'orders' | 'profit'>('revenue');

  const kpis = kpiDataByRange[timeRange];
  const revenuePoints = revenueDataByRange[timeRange];

  // Filter recent orders for overview table
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      orderStatusFilter === 'All' || order.status === orderStatusFilter;
    const matchesSearch =
      !globalSearch ||
      order.customerName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      order.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      order.product.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Demo Notice Banner */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Portfolio Showcase Demo:</strong> All company metrics, financial data, and customer identities are simulated for demonstration.
          </span>
        </div>
        <button
          onClick={() => {
            setCurrentSection('reports');
            showToast('Navigated to Reports generation suite', 'info');
          }}
          className="inline-flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 shrink-0"
        >
          <span>Export Reports</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          data={kpis.revenue}
          icon={DollarSign}
          accentColor="indigo"
        />
        <MetricCard
          data={kpis.orders}
          icon={ShoppingBag}
          accentColor="blue"
        />
        <MetricCard
          data={kpis.customers}
          icon={Users}
          accentColor="purple"
        />
        <MetricCard
          data={kpis.conversion}
          icon={TrendingUp}
          accentColor="emerald"
        />
      </div>

      {/* Main Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Over Time Area Chart (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue & Velocity Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive growth trends across current timeframe ({timeRange.toUpperCase()})
              </p>
            </div>

            {/* Metric switcher buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setActiveMetricTab('revenue')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeMetricTab === 'revenue'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveMetricTab('orders')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeMetricTab === 'orders'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveMetricTab('profit')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeMetricTab === 'profit'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Gross Profit
              </button>
            </div>
          </div>

          {/* Recharts Area Container */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenuePoints} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                  tickFormatter={(val) =>
                    activeMetricTab === 'orders' ? String(val) : `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                  }
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1 border border-slate-800">
                          <p className="font-semibold text-slate-300">{label}</p>
                          <p className="text-indigo-300 font-mono">
                            Revenue: {formatCurrency(data.revenue)}
                          </p>
                          <p className="text-emerald-400 font-mono">
                            Profit: {formatCurrency(data.profit)}
                          </p>
                          <p className="text-sky-300 font-mono">
                            Orders: {data.orders}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {activeMetricTab === 'revenue' && (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                )}
                {activeMetricTab === 'profit' && (
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#profitGradient)"
                  />
                )}
                {activeMetricTab === 'orders' && (
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#0EA5E9"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#ordersGradient)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Sources Donut Chart (1 Column) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Revenue by Channel
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Acquisition source distribution
            </p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {revenueSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clean Legend (No pills, strictly accessible text) */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            {revenueSourceData.map((item) => (
              <div key={item.source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                    {item.source}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono-numbers">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Sales by Category & Monthly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sales by Product Category
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Revenue contribution by subscription offering
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySalesData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  width={110}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Target vs Actual Performance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Target vs Actual
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Forecasted quota versus closed revenue
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyPerformanceData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), '']}
                />
                <Bar dataKey="target" name="Target Quota" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Closed" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Transactions & Orders
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live sample feed of subscription transactions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['All', 'Completed', 'Pending', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    orderStatusFilter === st
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentSection('sales')}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <span>View All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Tier</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredOrders.slice(0, 6).map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                    {order.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {order.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {order.product}
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
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No orders matched your current search and filter settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
