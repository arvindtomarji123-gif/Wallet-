
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';
import { ChevronRight, Search, AlertTriangle, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const HomeScreen: React.FC = () => {
  const { state, addTransaction, deleteTransaction } = useAppContext();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [scannedAmount, setScannedAmount] = useState<number | undefined>(undefined);

  // Check for scanned data from navigation
  useEffect(() => {
    if (location.state && typeof location.state === 'object' && 'scannedAmount' in location.state) {
      const amount = (location.state as any).scannedAmount;
      if (typeof amount === 'number') {
        setScannedAmount(amount);
        setIsModalOpen(true);
        // Clean up state to prevent reopening on reload/navigation
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  const handleSaveTransaction = (data: any) => {
    addTransaction(data);
    setScannedAmount(undefined); // Reset scanned amount after save
  };

  const confirmDelete = (id: string) => {
    setTransactionToDelete(id);
  };

  const handleActualDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setTransactionToDelete(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setScannedAmount(undefined);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-100 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
            <img src={state.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Welcome back,</p>
            <h1 className="text-xl font-black text-slate-800 dark:text-white">{state.user.name}</h1>
          </div>
        </div>
      </header>

      {/* Balance */}
      <BalanceCard balance={state.balance} />

      {/* Quick Actions */}
      <QuickActions onAdd={() => setIsModalOpen(true)} />

      {/* Transactions Section */}
      <section className="space-y-5">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-black text-slate-800 dark:text-white">Recent Transactions</h3>
          <button className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {state.transactions.length > 0 ? (
            state.transactions.slice(0, 5).map((tx) => (
              <TransactionItem 
                key={tx.id} 
                transaction={tx} 
                onDelete={() => confirmDelete(tx.id)}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-100 dark:border-slate-800">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300 dark:text-slate-600">
                <Search size={32} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">No transactions yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Add your first expense or income to start tracking!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Floating Add Button for easier reach */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-28 right-6 w-16 h-16 bg-purple-600 text-white rounded-2xl shadow-2xl shadow-purple-200 dark:shadow-purple-900/50 flex items-center justify-center active:scale-90 transition-all z-40 border-4 border-white dark:border-slate-900"
      >
        <span className="text-4xl font-light">+</span>
      </button>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        onSave={handleSaveTransaction}
        initialAmount={scannedAmount}
      />

      {/* Delete Confirmation Modal */}
      {transactionToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0" onClick={() => setTransactionToDelete(null)} />
           <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-[32px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Delete Transaction?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Are you sure you want to remove this? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setTransactionToDelete(null)}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleActualDelete}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 dark:shadow-rose-900/40 transition-all"
                >
                  Delete
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
