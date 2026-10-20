import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  kpiDataByRange,
  revenueDataByRange,
  categorySalesData,
  revenueSourceData,
  monthlyPerformanceData,
} from '../../data/sampleData';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Layers,
  Globe2,
  Cpu,
  Download,
  Filter,
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export const AnalyticsView: React.FC = () => {
  const { timeRange, setTimeRange, showToast } = useDashboard();
  const [metricView, setMetricView] = useState<'both' | 'revenue' | 'target'>('both');

  const revenuePoints = revenueDataByRange[timeRange];
  const currentKPI = kpiDataByRange[timeRange];

  const handleExportAnalyticsData = () => {
    try {
      exportToCSV(`Nexa_Analytics_Metrics_${timeRange}`, revenuePoints, {
        date: 'Period / Date',
        revenue: 'Revenue ($)',
        orders: 'Total Orders',
        profit: 'Gross Profit ($)',
        target: 'Target Quota ($)',
      });
      showToast(`Analytics data for ${timeRange} exported to CSV`, 'success');
    } catch {
      showToast('Export failed: No data', 'error');
    }
  };

  // Geographic regional breakdown
  const regionalData = [
    { region: 'North America', share: 48, revenue: 23180, growth: 16.4 },
    { region: 'Europe (EMEA)', share: 31, revenue: 14970, growth: 12.8 },
    { region: 'Asia Pacific (APAC)', share: 15, revenue: 7240, growth: 22.1 },
    { region: 'Latin America', share: 6, revenue: 2904, growth: 8.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Performance & Growth Intelligence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Granular breakdown of revenue momentum, category contribution, and regional yield
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAnalyticsData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export View</span>
          </button>
        </div>
      </div>

      {/* Analytical KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Average Order Value (AOV)</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-slate-900 dark:text-white">
            {formatCurrency(currentKPI.revenue.rawValue / (currentKPI.orders.rawValue || 1))}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            +5.2% vs previous period
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Gross Profit Margin</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-slate-900 dark:text-white">
            72.3%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            +1.8% expansion YoY
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Customer LTV</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-slate-900 dark:text-white">
            $4,890
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            +9.4% blended ARR
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Churn Rate</span>
            <Cpu className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-bold font-mono-numbers text-slate-900 dark:text-white">
            1.18%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            -0.22% retention improvement
          </div>
        </div>
      </div>

      {/* Primary Analytical Line Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Revenue Trajectory vs Forecast Target
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive multi-line comparative projection ({timeRange.toUpperCase()})
            </p>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setMetricView('both')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                metricView === 'both'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Series
            </button>
            <button
              onClick={() => setMetricView('revenue')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                metricView === 'revenue'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Revenue Only
            </button>
            <button
              onClick={() => setMetricView('target')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                metricView === 'target'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Target Only
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenuePoints} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                formatter={(val: any, name: any) => [formatCurrency(Number(val)), name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {(metricView === 'both' || metricView === 'revenue') && (
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Actual Revenue"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#4F46E5' }}
                  activeDot={{ r: 6 }}
                />
              )}
              {(metricView === 'both' || metricView === 'target') && (
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Planned Target"
                  stroke="#94A3B8"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#94A3B8' }}
                />
              )}
              {metricView === 'both' && (
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Gross Margin"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Performance & Category Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Geography */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-indigo-500" />
                <span>Geographic Market Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Regional revenue distribution and YoY territory expansion
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {regionalData.map((reg) => (
              <div key={reg.region} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {reg.region}
                  </span>
                  <div className="flex items-center gap-2 font-mono-numbers">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(reg.revenue)}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                      +{reg.growth}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${reg.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Contribution Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Offering Contribution Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Segment profitability and unit sales
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5 text-right">Units</th>
                  <th className="py-2.5 text-right">Revenue</th>
                  <th className="py-2.5 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {categorySalesData.map((cat) => (
                  <tr key={cat.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                      {cat.category}
                    </td>
                    <td className="py-2.5 text-right font-mono-numbers text-slate-600 dark:text-slate-400">
                      {cat.units}
                    </td>
                    <td className="py-2.5 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(cat.revenue)}
                    </td>
                    <td className="py-2.5 text-right font-mono-numbers text-indigo-600 dark:text-indigo-400 font-medium">
                      {cat.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
