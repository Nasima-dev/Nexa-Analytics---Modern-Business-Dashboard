export type TimeRange = '7d' | '30d' | '12m';

export type NavSection = 'overview' | 'analytics' | 'sales' | 'customers' | 'reports' | 'settings';

export type OrderStatus = 'Completed' | 'Pending' | 'Cancelled';

export interface OrderItem {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  product: string;
  category: string;
  date: string;
  amount: number;
  status: OrderStatus;
  paymentMethod: string;
  itemsCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Churned' | 'Trial';
  totalSpend: number;
  ordersCount: number;
  joinedDate: string;
  lastActive: string;
  plan: 'Enterprise' | 'Professional' | 'Growth' | 'Starter';
  avatarInitials: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  rawValue: number;
  change: number;
  isPositive: boolean;
  periodLabel: string;
  sparkline: number[];
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
  target?: number;
}

export interface CategorySales {
  category: string;
  revenue: number;
  units: number;
  percentage: number;
  color: string;
}

export interface RevenueSource {
  source: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyPerformance {
  month: string;
  actual: number;
  target: number;
  margin: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'system' | 'customer' | 'milestone';
  read: boolean;
}

export interface UserSettings {
  fullName: string;
  jobTitle: string;
  email: string;
  companyName: string;
  currency: string;
  timezone: string;
  theme: 'light' | 'dark';
  emailAlerts: boolean;
  orderNotifications: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

export interface ReportItem {
  id: string;
  title: string;
  category: string;
  generatedDate: string;
  period: string;
  totalRevenue: number;
  totalOrders: number;
  topProduct: string;
  summary: string;
}
