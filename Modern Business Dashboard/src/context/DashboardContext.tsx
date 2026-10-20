import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavSection,
  TimeRange,
  OrderItem,
  Customer,
  UserSettings,
  NotificationItem,
} from '../types/dashboard';
import {
  sampleOrders as initialOrders,
  sampleCustomers as initialCustomers,
  defaultUserSettings,
  initialNotifications,
} from '../data/sampleData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface DashboardContextType {
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  orders: OrderItem[];
  updateOrderStatus: (orderId: string, newStatus: OrderItem['status']) => void;
  customers: Customer[];
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  selectedOrder: OrderItem | null;
  setSelectedOrder: (order: OrderItem | null) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'nexa_dashboard_settings_v1';
const THEME_STORAGE_KEY = 'nexa_dashboard_theme_v1';

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Settings from localStorage with fallback
  const [settings, setSettingsState] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...defaultUserSettings, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return defaultUserSettings;
  });

  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // Ignore
    }
    return 'light';
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    if (newSettings.theme && newSettings.theme !== theme) {
      setThemeState(newSettings.theme);
    }
    showToast('Preferences saved successfully to local storage.', 'success');
  };

  const resetSettings = () => {
    setSettingsState(defaultUserSettings);
    setThemeState(defaultUserSettings.theme);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultUserSettings));
      localStorage.setItem(THEME_STORAGE_KEY, defaultUserSettings.theme);
    } catch {
      // Ignore
    }
    showToast('Settings restored to initial default values.', 'info');
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    setSettingsState((prev) => ({ ...prev, theme: nextTheme }));
    showToast(`Switched to ${nextTheme} mode`, 'info');
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Order #${orderId} status updated to ${newStatus}.`, 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notification center cleared', 'info');
  };

  return (
    <DashboardContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        timeRange,
        setTimeRange,
        globalSearch,
        setGlobalSearch,
        orders,
        updateOrderStatus,
        customers,
        settings,
        updateSettings,
        resetSettings,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        selectedOrder,
        setSelectedOrder,
        selectedCustomer,
        setSelectedCustomer,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        theme,
        setTheme: setThemeState,
        toggleTheme,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
