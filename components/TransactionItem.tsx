
import React from 'react';
import { Transaction } from '../types';
import { ALL_CATEGORIES } from '../constants';
import { Trash2 } from 'lucide-react';

interface Props {
  transaction: Transaction;
  onDelete: () => void;
}

const TransactionItem: React.FC<Props> = ({ transaction, onDelete }) => {
  const category = ALL_CATEGORIES.find(c => c.name === transaction.category) || ALL_CATEGORIES.find(c => c.name === 'Other') || ALL_CATEGORIES[0];
  const isIncome = transaction.type === 'income';

  return (
    <div 
      className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-3xl mb-3 border border-slate-50 dark:border-slate-800 shadow-sm group relative transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`${category.color} dark:bg-opacity-10 dark:text-opacity-90 w-12 h-12 flex items-center justify-center rounded-2xl text-2xl shadow-sm`}>
          {category.icon}
        </div>
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{transaction.description || transaction.category}</p>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {new Date(transaction.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`font-bold text-sm ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
          </p>
          <p className="text-[10px] font-medium text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Completed</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-3 -mr-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all cursor-pointer z-10"
          aria-label="Delete transaction"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
