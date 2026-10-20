import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { OverviewView } from './components/views/OverviewView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SalesView } from './components/views/SalesView';
import { CustomersView } from './components/views/CustomersView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { OrderDetailsModal } from './components/modals/OrderDetailsModal';
import { CustomerDetailsModal } from './components/modals/CustomerDetailsModal';

const DashboardContent: React.FC = () => {
  const { currentSection } = useDashboard();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'overview' && <OverviewView />}
          {currentSection === 'analytics' && <AnalyticsView />}
          {currentSection === 'sales' && <SalesView />}
          {currentSection === 'customers' && <CustomersView />}
          {currentSection === 'reports' && <ReportsView />}
          {currentSection === 'settings' && <SettingsView />}
        </main>

        {/* Quiet Footer */}
        <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>
            Nexa Analytics · Professional SaaS Portfolio Demonstration · React 19 & Tailwind CSS · Sample Data Only
          </p>
        </footer>
      </div>

      {/* Modals & Toasts */}
      <OrderDetailsModal />
      <CustomerDetailsModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
