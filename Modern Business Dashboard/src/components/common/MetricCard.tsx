import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MetricCardData } from '../../types/dashboard';

interface MetricCardProps {
  data: MetricCardData;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: 'indigo' | 'blue' | 'purple' | 'emerald';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  data,
  icon: Icon,
  accentColor = 'indigo',
}) => {
  const { title, value, change, isPositive, periodLabel, sparkline } = data;

  // Compute SVG sparkline path
  const minVal = Math.min(...sparkline);
  const maxVal = Math.max(...sparkline);
  const range = maxVal - minVal || 1;
  const width = 110;
  const height = 36;
  const padding = 2;

  const points = sparkline.map((val, idx) => {
    const x = padding + (idx / (sparkline.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  const colorStyles = {
    indigo: {
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
      stroke: isPositive ? '#4F46E5' : '#E11D48',
      fill: isPositive ? 'rgba(79, 70, 229, 0.12)' : 'rgba(225, 29, 72, 0.12)',
    },
    blue: {
      iconBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
      stroke: isPositive ? '#2563EB' : '#E11D48',
      fill: isPositive ? 'rgba(37, 99, 235, 0.12)' : 'rgba(225, 29, 72, 0.12)',
    },
    purple: {
      iconBg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
      stroke: isPositive ? '#7C3AED' : '#E11D48',
      fill: isPositive ? 'rgba(124, 58, 237, 0.12)' : 'rgba(225, 29, 72, 0.12)',
    },
    emerald: {
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
      stroke: isPositive ? '#059669' : '#E11D48',
      fill: isPositive ? 'rgba(5, 150, 105, 0.12)' : 'rgba(225, 29, 72, 0.12)',
    },
  }[accentColor];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {title}
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              demo
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono-numbers">
            {value}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg shrink-0 ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center font-semibold font-mono-numbers ${
              isPositive
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
            {periodLabel}
          </span>
        </div>

        {/* Small Sparkline Trend */}
        <div className="shrink-0" title="Historical sparkline trend">
          <svg width={width} height={height} className="overflow-visible">
            <path d={areaD} fill={colorStyles.fill} />
            <path
              d={pathD}
              fill="none"
              stroke={colorStyles.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
