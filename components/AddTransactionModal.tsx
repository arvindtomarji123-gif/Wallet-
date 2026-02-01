
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { TransactionType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { type: TransactionType; amount: number; category: string; description: string; date: string }) => void;
  initialAmount?: number;
}

const AddTransactionModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialAmount }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].name);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Reset category when type changes
  useEffect(() => {
    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    setCategory(categories[0].name);
  }, [type]);

  // Set initial amount if provided
  useEffect(() => {
    if (isOpen && initialAmount) {
      setAmount(initialAmount.toString());
      setDescription('Scanned Receipt');
    } else if (isOpen && !initialAmount) {
      // Clear fields if opening fresh without initial amount (optional, depending on UX preference)
      // For now, we only clear on close, but we ensure amount is set if initialAmount exists.
    }
  }, [isOpen, initialAmount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    onSave({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date).toISOString(),
    });
    setAmount('');
    setDescription('');
    onClose();
  };

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Add Transaction</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selector */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                type === 'expense' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                type === 'income' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount Input */}
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-400 dark:text-slate-600">$</span>
            <input
              autoFocus
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-3xl py-8 pl-14 pr-8 text-4xl font-black text-slate-800 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 outline-none"
              required
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Category</label>
            <div className="grid grid-cols-4 gap-3">
              {currentCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${
                    category === cat.name ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500' : 'border-transparent bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate w-full text-center">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Description</label>
               <input
                type="text"
                placeholder="What was this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 text-slate-800 dark:text-white"
              />
            </div>
            
            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Date</label>
                 <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 text-slate-800 dark:text-white"
                />
               </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full text-white font-bold py-5 rounded-3xl shadow-xl active:scale-95 transition-all ${
               type === 'expense' 
               ? 'bg-rose-600 shadow-rose-100 dark:shadow-rose-900/40' 
               : 'bg-emerald-600 shadow-emerald-100 dark:shadow-emerald-900/40'
            }`}
          >
            Save {type === 'expense' ? 'Expense' : 'Income'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
