import React, { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { StatusBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { customerGrowthData } from '../../data/sampleData';
import { Customer } from '../../types/dashboard';
import { exportToCSV } from '../../utils/exportCsv';
import {
  Users,
  UserPlus,
  UserCheck,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const CustomersView: React.FC = () => {
  const { customers, setSelectedCustomer, showToast } = useDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'Enterprise' | 'Professional' | 'Growth' | 'Starter'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Churned' | 'Trial'>('All');

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesTier = tierFilter === 'All' || cust.plan === tierFilter;
      const matchesStatus = statusFilter === 'All' || cust.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        cust.name.toLowerCase().includes(query) ||
        cust.email.toLowerCase().includes(query) ||
        cust.company.toLowerCase().includes(query);
      return matchesTier && matchesStatus && matchesSearch;
    });
  }, [customers, searchQuery, tierFilter, statusFilter]);

  const handleExportCustomers = () => {
    try {
      exportToCSV('Nexa_Customers_Cohort', filteredCustomers, {
        id: 'Customer ID',
        name: 'Full Name',
        email: 'Email',
        company: 'Company',
        status: 'Status',
        totalSpend: 'Total LTV ($)',
        ordersCount: 'Order Count',
        joinedDate: 'Joined Date',
        lastActive: 'Last Activity',
        plan: 'Subscription Plan',
        avatarInitials: 'Initials',
      });
      showToast(`${filteredCustomers.length} customer records exported to CSV`, 'success');
    } catch {
      showToast('No customer records to export', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Account Base</span>
            <div className="text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white mt-1">
              8,760
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              +14.8% cohort growth
            </span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">New Acquisitions</span>
            <div className="text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white mt-1">
              640
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              +8.5% MoM conversion
            </span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Returning Active Users</span>
            <div className="text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white mt-1">
              8,120
            </div>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              92.7% retention index
            </span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Customer Growth Area Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Customer Growth & Retention Trajectory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of new acquisitions vs recurring subscriber baseline
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={customerGrowthData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="returningGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="returningCustomers"
                name="Returning Subscribers"
                stroke="#4F46E5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#returningGrad)"
              />
              <Area
                type="monotone"
                dataKey="newCustomers"
                name="New Signups"
                stroke="#06B6D4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#newGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Plan Tier Filters */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              {(['All', 'Enterprise', 'Professional', 'Growth', 'Starter'] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setTierFilter(plan)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    tierFilter === plan
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCustomers}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Customers</span>
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-semibold">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Company Account</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4 text-right">LTV Spend</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[11px] shrink-0">
                        {cust.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {cust.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {cust.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                    {cust.company}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {cust.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(cust.totalSpend)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono-numbers text-slate-600 dark:text-slate-400">
                    {cust.ordersCount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={cust.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No customer accounts found matching current query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
