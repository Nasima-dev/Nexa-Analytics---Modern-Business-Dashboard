import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { sampleReports, categorySalesData, customerGrowthData, monthlyPerformanceData } from '../../data/sampleData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportCsv';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  Users,
  Package,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { showToast } = useDashboard();
  const [activeReportTab, setActiveReportTab] = useState<'revenue' | 'sales' | 'customers' | 'products'>('revenue');
  const [selectedPeriod, setSelectedPeriod] = useState<'current-month' | 'last-quarter' | 'year-to-date'>('current-month');

  // Export specific report handler based on active tab
  const handleExportActiveReport = () => {
    try {
      if (activeReportTab === 'revenue') {
        const rows = monthlyPerformanceData.map((m) => ({
          Period: m.month,
          ActualRevenue: `$${m.actual}`,
          TargetRevenue: `$${m.target}`,
          ProfitMargin: `${m.margin}%`,
          Variance: `${((m.actual - m.target) / m.target * 100).toFixed(2)}%`,
        }));
        exportToCSV(`Nexa_Revenue_Report_${selectedPeriod}`, rows);
      } else if (activeReportTab === 'sales') {
        const rows = categorySalesData.map((c) => ({
          Category: c.category,
          Revenue: `$${c.revenue}`,
          UnitOrders: c.units,
          SharePercentage: `${c.percentage}%`,
        }));
        exportToCSV(`Nexa_Sales_Performance_Report_${selectedPeriod}`, rows);
      } else if (activeReportTab === 'customers') {
        const rows = customerGrowthData.map((cg) => ({
          CohortMonth: cg.month,
          NewCustomers: cg.newCustomers,
          ReturningSubscribers: cg.returningCustomers,
          TotalActiveBase: cg.total,
        }));
        exportToCSV(`Nexa_Customer_Cohort_Report_${selectedPeriod}`, rows);
      } else {
        const rows = categorySalesData.map((p, idx) => ({
          ProductID: `PROD-${1000 + idx}`,
          ProductName: p.category,
          GrossSales: `$${p.revenue}`,
          Volume: p.units,
          MarginRating: 'High (>70%)',
        }));
        exportToCSV(`Nexa_Product_Performance_Report_${selectedPeriod}`, rows);
      }
      showToast(`Report exported as CSV successfully`, 'success');
    } catch {
      showToast('Export failed: No data', 'error');
    }
  };

  const handleExportSingleReport = (reportTitle: string, id: string) => {
    try {
      const data = [
        {
          ReportID: id,
          Title: reportTitle,
          GeneratedDate: new Date().toISOString().split('T')[0],
          Scope: selectedPeriod,
          SystemStatus: 'Validated Demo Dataset',
        },
      ];
      exportToCSV(reportTitle.replace(/\s+/g, '_'), data);
      showToast(`Report "${reportTitle}" downloaded`, 'success');
    } catch {
      showToast('Export failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Export Action */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Executive Business Reports & Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit-ready spreadsheets with browser-side CSV compilation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date filter selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value as any);
                showToast(`Report period updated to ${e.target.options[e.target.selectedIndex].text}`, 'info');
              }}
              className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-hidden text-xs cursor-pointer"
            >
              <option value="current-month" className="bg-white dark:bg-slate-900">Current Month (October)</option>
              <option value="last-quarter" className="bg-white dark:bg-slate-900">Last Quarter (Q3)</option>
              <option value="year-to-date" className="bg-white dark:bg-slate-900">Year to Date (YTD 2026)</option>
            </select>
          </div>

          <button
            onClick={handleExportActiveReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Active CSV</span>
          </button>
        </div>
      </div>

      {/* Report Category Switcher Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveReportTab('revenue')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeReportTab === 'revenue'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Revenue Summary</span>
        </button>
        <button
          onClick={() => setActiveReportTab('sales')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeReportTab === 'sales'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sales Performance</span>
        </button>
        <button
          onClick={() => setActiveReportTab('customers')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeReportTab === 'customers'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Growth</span>
        </button>
        <button
          onClick={() => setActiveReportTab('products')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeReportTab === 'products'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Performance</span>
        </button>
      </div>

      {/* Active Tab Content Display */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        {activeReportTab === 'revenue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Revenue & Profitability Ledger
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detailed period reconciliation for {selectedPeriod.replace('-', ' ')}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5">Period</th>
                    <th className="py-2.5 text-right">Actual Closed</th>
                    <th className="py-2.5 text-right">Target Quota</th>
                    <th className="py-2.5 text-right">Attainment</th>
                    <th className="py-2.5 text-right">Gross Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {monthlyPerformanceData.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                        {row.month} 2026
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(row.actual)}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers text-slate-500">
                        {formatCurrency(row.target)}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers text-emerald-600 dark:text-emerald-400 font-medium">
                        {((row.actual / row.target) * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers text-indigo-600 dark:text-indigo-400">
                        {row.margin}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReportTab === 'sales' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sales Channel & Category Contribution
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5 text-right">Revenue</th>
                    <th className="py-2.5 text-right">Order Units</th>
                    <th className="py-2.5 text-right">Portfolio Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {categorySalesData.map((cat) => (
                    <tr key={cat.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                        {cat.category}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(cat.revenue)}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers text-slate-500">
                        {cat.units}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers text-indigo-600 dark:text-indigo-400 font-semibold">
                        {cat.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReportTab === 'customers' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Customer Growth & Retention Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5">Month</th>
                    <th className="py-2.5 text-right">New Signups</th>
                    <th className="py-2.5 text-right">Returning Users</th>
                    <th className="py-2.5 text-right">Total Base</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {customerGrowthData.map((cg) => (
                    <tr key={cg.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                        {cg.month} 2026
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers text-emerald-600 dark:text-emerald-400 font-medium">
                        +{cg.newCustomers}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers text-indigo-600 dark:text-indigo-400">
                        {cg.returningCustomers}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                        {cg.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReportTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Product Tier Utilization & Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5">Offering Name</th>
                    <th className="py-2.5 text-right">Gross Volume</th>
                    <th className="py-2.5 text-right">Total Units</th>
                    <th className="py-2.5 text-right">Margin Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {categorySalesData.map((cat) => (
                    <tr key={cat.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                        {cat.category}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(cat.revenue)}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers text-slate-500">
                        {cat.units}
                      </td>
                      <td className="py-2.5 text-right font-mono-numbers text-emerald-600 dark:text-emerald-400 font-medium">
                        High (&gt;70%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Available Pre-Compiled Reports Card List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Pre-Compiled Management Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleReports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      {report.id} · {report.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {report.title}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono-numbers shrink-0">
                    {formatDate(report.generatedDate)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {report.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Volume:</span>
                  <span className="font-semibold font-mono-numbers text-slate-800 dark:text-slate-200">
                    {formatCurrency(report.totalRevenue)}
                  </span>
                </div>
                <button
                  onClick={() => handleExportSingleReport(report.title, report.id)}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
