
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletState, Transaction, UserProfile } from './types';
import HomeScreen from './screens/HomeScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ScannerScreen from './screens/ScannerScreen';
import LoadingScreen from './components/LoadingScreen';
import BottomNav from './components/BottomNav';
import { playUiSound, SoundType } from './utils/sound';

// Context for global state
interface AppContextType {
  state: WalletState;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  toggleTheme: () => void;
  updateUser: (profile: Partial<UserProfile> & { balance?: number }) => void;
  clearNotifications: () => void;
  playSound: (type: SoundType) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

const DEFAULT_USER: UserProfile = {
  name: 'My Wallet',
  email: 'user@example.com',
  avatar: 'https://ui-avatars.com/api/?name=My+Wallet&background=7c3aed&color=fff&rounded=true&bold=true'
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<WalletState>(() => {
    const saved = localStorage.getItem('wallet_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure balance is a valid number
        const safeBalance = (typeof parsed.balance === 'number' && !isNaN(parsed.balance)) 
          ? parsed.balance 
          : 0;

        return {
          balance: safeBalance,
          transactions: parsed.transactions ?? [],
          theme: parsed.theme || 'light',
          user: parsed.user || DEFAULT_USER,
          notifications: parsed.notifications || []
        };
      } catch (e) {
        console.error("Failed to parse wallet state", e);
      }
    }
    // Default state (Clean slate, no demo data)
    return {
      balance: 0,
      transactions: [],
      theme: 'light',
      user: DEFAULT_USER,
      notifications: []
    };
  });

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('wallet_state', JSON.stringify(state));
    
    // Apply theme to document
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state]);

  const toggleTheme = () => {
    playUiSound('toggle');
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    playUiSound('success');
    const newId = Math.random().toString(36).substr(2, 9);
    const newTransaction: Transaction = { ...t, id: newId };
    
    setState(prev => {
      const newBalance = t.type === 'income' ? prev.balance + t.amount : prev.balance - t.amount;
      
      // Create automatic notification
      const notificationId = Math.random().toString(36).substr(2, 9);
      const newNotification = {
        id: notificationId,
        title: t.type === 'income' ? 'Money Received' : 'Transaction Alert',
        message: `${t.type === 'income' ? 'Received' : 'Spent'} $${t.amount.toFixed(2)} on ${t.category}`,
        date: new Date().toISOString(),
        type: t.type === 'income' ? 'credit' : 'debit' as any,
        read: false
      };

      return {
        ...prev,
        balance: newBalance,
        transactions: [newTransaction, ...prev.transactions],
        notifications: [newNotification, ...prev.notifications]
      };
    });
  };

  const deleteTransaction = (id: string) => {
    playUiSound('delete');
    setState(prev => {
      const tx = prev.transactions.find(t => t.id === id);
      if (!tx) return prev;
      return {
        ...prev,
        balance: tx.type === 'income' ? prev.balance - tx.amount : prev.balance + tx.amount,
        transactions: prev.transactions.filter(t => t.id !== id)
      };
    });
  };

  const updateUser = (data: Partial<UserProfile> & { balance?: number }) => {
    setState(prev => ({
      ...prev,
      balance: data.balance !== undefined ? data.balance : prev.balance,
      user: {
        ...prev.user,
        ...data
      }
    }));
  };

  const clearNotifications = () => {
    playUiSound('click');
    setState(prev => ({
      ...prev,
      notifications: []
    }));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AppContext.Provider value={{ state, addTransaction, deleteTransaction, toggleTheme, updateUser, clearNotifications, playSound: playUiSound }}>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 max-w-md mx-auto shadow-2xl relative overflow-hidden transition-colors duration-300">
          <main className="flex-1 overflow-y-auto pb-24">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/statistics" element={<StatisticsScreen />} />
              <Route path="/notifications" element={<NotificationsScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/scan" element={<ScannerScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
