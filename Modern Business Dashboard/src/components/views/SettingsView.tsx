import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { UserSettings } from '../../types/dashboard';
import {
  Save,
  RotateCcw,
  User,
  Building,
  Mail,
  Clock,
  DollarSign,
  Bell,
  Palette,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import avatarImg from '../../assets/images/avatar_sarah_chen_1792496109528.jpg';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetSettings, showToast, theme, setTheme } = useDashboard();

  // Local form state
  const [formData, setFormData] = useState<UserSettings>({ ...settings });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name cannot be blank.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form before saving.', 'error');
      return;
    }

    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    resetSettings();
    setFormData({
      ...settings,
    });
    setErrors({});
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Notice Banner */}
      <div className="bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            Client Portfolio Demo Notice:
          </span>{' '}
          All changes saved here persist directly to your browser's <code className="font-mono text-indigo-600 dark:text-indigo-400">localStorage</code>. No remote server or database is involved.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <img
              src={avatarImg}
              alt={formData.fullName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Personal Identity & Role
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update how your name and company appear across the Nexa portal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white focus:outline-hidden ${
                    errors.fullName
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                  }`}
                  placeholder="e.g. Sarah Chen"
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                placeholder="e.g. Commercial Director"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white focus:outline-hidden ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                  }`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Company Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white focus:outline-hidden ${
                    errors.companyName
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                  }`}
                  placeholder="e.g. Nexa Global Solutions"
                />
              </div>
              {errors.companyName && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.companyName}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Reporting Currency
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="USD ($)">USD - US Dollar ($)</option>
                  <option value="EUR (€)">EUR - Euro (€)</option>
                  <option value="GBP (£)">GBP - British Pound (£)</option>
                  <option value="CAD ($)">CAD - Canadian Dollar ($)</option>
                </select>
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Standard Timezone
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="America/New_York (EST, UTC-5)">Eastern Time (US & Canada)</option>
                  <option value="America/Chicago (CST, UTC-6)">Central Time (US & Canada)</option>
                  <option value="America/Los_Angeles (PST, UTC-8)">Pacific Time (US & Canada)</option>
                  <option value="Europe/London (GMT, UTC+0)">London (GMT / BST)</option>
                  <option value="Europe/Berlin (CET, UTC+1)">Berlin, Paris (CET)</option>
                  <option value="Asia/Singapore (SGT, UTC+8)">Singapore (SGT)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Visual Theme Preference
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Choose your preferred dashboard interface appearance
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, theme: 'light' });
                setTheme('light');
              }}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                formData.theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-white font-semibold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 shrink-0" />
                <span>Light Clean</span>
              </div>
              {formData.theme === 'light' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, theme: 'dark' });
                setTheme('dark');
              }}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                formData.theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-white font-semibold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 shrink-0" />
                <span>Dark Navy</span>
              </div>
              {formData.theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Notification Preferences
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Configure simulated email and desktop alert subscriptions
          </p>

          <div className="space-y-4 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  New Order & Transaction Alerts
                </p>
                <p className="text-slate-400 text-[11px]">
                  Real-time alerts whenever a customer completes a checkout
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.orderNotifications}
                onChange={(e) =>
                  setFormData({ ...formData, orderNotifications: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Weekly Executive Digest
                </p>
                <p className="text-slate-400 text-[11px]">
                  Summarized performance charts and cohort retention reports every Monday
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.weeklyDigest}
                onChange={(e) =>
                  setFormData({ ...formData, weeklyDigest: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Security & Anomaly Guard
                </p>
                <p className="text-slate-400 text-[11px]">
                  Instant notifications on high-frequency API usage spikes or unusual churn
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.securityAlerts}
                onChange={(e) =>
                  setFormData({ ...formData, securityAlerts: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-md shadow-indigo-600/20 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
