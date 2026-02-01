
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string; // ISO string
  type: 'credit' | 'debit' | 'alert' | 'info';
  read: boolean;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  theme: 'light' | 'dark';
  user: UserProfile;
  notifications: NotificationItem[];
}

export type TimeFilter = 'day' | 'week' | 'month' | 'year';
