import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { NavSection } from '../../types/dashboard';
import {
  LayoutDashboard,
  LineChart,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: LineChart },
  { id: 'sales', label: 'Sales & Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reports', label: 'Reports & Export', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { currentSection, setCurrentSection, isMobileSidebarOpen, setIsMobileSidebarOpen } =
    useDashboard();

  const handleNavClick = (sectionId: NavSection) => {
    setCurrentSection(sectionId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-[#0B132B] text-slate-300 border-r border-[#1C2541] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & Close button */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#1C2541]/80">
            <div className="flex items-center gap-3">
              {/* Modern geometric logo mark */}
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white">
                  Nexa Analytics
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  SaaS Business Intelligence
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-6 space-y-1">
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-[#1C2541]/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Showcase Card at Bottom */}
        <div className="p-4 border-t border-[#1C2541]/80">
          <div className="bg-[#1C2541]/60 rounded-xl p-3.5 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-white">Portfolio Demo</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Built with React, Vite & Tailwind CSS. Realistic sample datasets and zero backend dependency.
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/5">
              <span className="text-slate-400">Status</span>
              <span className="font-mono text-emerald-400 font-medium">Ready for Review</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
