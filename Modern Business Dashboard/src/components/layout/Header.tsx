import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { TimeRange } from '../../types/dashboard';
import {
  Menu,
  Search,
  Bell,
  Check,
  Trash2,
  Moon,
  Sun,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  LogOut,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import avatarImg from '../../assets/images/avatar_sarah_chen_1792496109528.jpg';

export const Header: React.FC = () => {
  const {
    currentSection,
    setCurrentSection,
    timeRange,
    setTimeRange,
    globalSearch,
    setGlobalSearch,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setIsMobileSidebarOpen,
    theme,
    toggleTheme,
    settings,
    showToast,
  } = useDashboard();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: 'Overview Dashboard', subtitle: 'Executive business health and operational KPIs' },
    analytics: { title: 'Performance Analytics', subtitle: 'Revenue trajectory, conversion metrics, and forecasts' },
    sales: { title: 'Sales & Transactions', subtitle: 'Order status tracking, volume analysis, and records' },
    customers: { title: 'Customer Cohorts', subtitle: 'Subscriber lifetime value, acquisition, and churn' },
    reports: { title: 'Reports & Export', subtitle: 'Generated summaries and instant CSV browser downloads' },
    settings: { title: 'Platform Settings', subtitle: 'Demo account preferences, local persistence, and alerts' },
  };

  const currentInfo = sectionTitles[currentSection] || {
    title: 'Dashboard',
    subtitle: 'Nexa Analytics',
  };

  const timeRangeOptions: { id: TimeRange; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '12m', label: '12 Months' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Hamburger & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
              <span>Nexa</span>
              <span>/</span>
              <span className="capitalize text-slate-600 dark:text-slate-300">{currentSection}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {currentInfo.title}
            </h1>
          </div>
        </div>

        {/* Right: Search, Date Range Filter, Notification, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search bar */}
          <div className="relative hidden lg:block w-48 xl:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search data, orders..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100/80 dark:bg-slate-800 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden transition-colors"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Time-Range Selector */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            {timeRangeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setTimeRange(opt.id);
                  showToast(`Time period updated to ${opt.label}`, 'info');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  timeRange === opt.id
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 rounded">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Read all</span>
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Clear notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications right now.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3.5 text-xs transition-colors cursor-pointer flex gap-3 ${
                          notif.read
                            ? 'bg-transparent text-slate-600 dark:text-slate-400'
                            : 'bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-800 dark:text-slate-200 font-medium'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            notif.read ? 'bg-slate-300 dark:bg-slate-700' : 'bg-indigo-600'
                          }`}
                        />
                        <div className="flex-1 space-y-0.5">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {notif.title}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block pt-1">
                            {notif.timestamp}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 pl-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="User profile menu"
            >
              <img
                src={avatarImg}
                alt={settings.fullName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                {settings.fullName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden text-xs">
                {/* Profile info header */}
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <img
                    src={avatarImg}
                    alt={settings.fullName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {settings.fullName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {settings.email}
                    </p>
                    <span className="inline-block mt-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                      {settings.jobTitle}
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu Items */}
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setCurrentSection('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      showToast('Switched to Demo Workspace: Production US-East', 'info');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                    <span>Workspace: {settings.companyName}</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      showToast('Signed out of demo session. Demo state remains preserved.', 'info');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Demo Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
