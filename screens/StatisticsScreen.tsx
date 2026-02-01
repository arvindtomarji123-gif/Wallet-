
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../App';
import { TimeFilter } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronLeft, MoreHorizontal, TrendingUp, TrendingDown, Download, FileText, Share2, PieChart as PieChartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatisticsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, playSound } = useAppContext();
  const [filter, setFilter] = useState<TimeFilter>('month');
  const [showMenu, setShowMenu] = useState(false);

  // Filter transactions based on selected time range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return state.transactions.filter(t => {
      const tDate = new Date(t.date);
      switch (filter) {
        case 'day':
          return tDate.toDateString() === now.toDateString();
        case 'week':
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          return tDate >= oneWeekAgo && tDate <= now;
        case 'month':
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        case 'year':
          return tDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [state.transactions, filter]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    return { income, expenses, total: income + expenses };
  }, [filteredTransactions]);

  const chartData = [
    { name: 'Income', value: stats.income, color: '#10b981' },
    { name: 'Expenses', value: stats.expenses, color: '#f43f5e' },
  ];

  const isEmpty = stats.total === 0;

  // Generate dynamic insight based on data
  const aiInsight = useMemo(() => {
    if (isEmpty) return "No transactions found for this period. Add some expenses to see insights.";
    
    if (stats.expenses > stats.income && stats.income > 0) {
        return "Spending exceeds income for this period. Consider reviewing your recent expenses.";
    } else if (stats.expenses > stats.income * 0.8) {
        return "You're utilizing over 80% of your income. Try to reduce discretionary spending.";
    } else if (stats.income === 0 && stats.expenses > 0) {
        return "You have expenses but no recorded income for this period.";
    } else {
        return "Great job! Your finances are looking healthy for this period.";
    }
  }, [stats, isEmpty]);

  const handleExport = () => {
    playSound('click');
    if (filteredTransactions.length === 0) {
        alert("No data to export for this period.");
        return;
    }
    const headers = "Date,Description,Category,Type,Amount\n";
    const csvContent = "data:text/csv;charset=utf-8," + headers + 
      filteredTransactions.map(t => 
        `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
      ).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wallet_data_${filter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMenu(false);
  };

  const handleMenuClick = () => {
      playSound('click');
      setShowMenu(!showMenu);
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right duration-500 relative" onClick={() => showMenu && setShowMenu(false)}>
      {/* Header */}
      <header className="flex justify-between items-center relative z-20">
        <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-800 transition-colors">
          <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-lg font-black text-slate-800 dark:text-white">Financial Insights</h1>
        <div className="relative">
            <button 
                onClick={(e) => { e.stopPropagation(); handleMenuClick(); }} 
                className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-800 transition-colors"
            >
                <MoreHorizontal size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
            {showMenu && (
                <div className="absolute right-0 top-14 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                    <button onClick={handleExport} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-sm font-bold">
                        <Download size={18} /> Export CSV
                    </button>
                     <button disabled className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-600 transition-colors text-sm font-bold opacity-50 cursor-not-allowed">
                        <FileText size={18} /> PDF Report
                    </button>
                </div>
            )}
        </div>
      </header>

      {/* Time Filter Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
        {(['day', 'week', 'month', 'year'] as TimeFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => { playSound('click'); setFilter(f); }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
              filter === f ? 'bg-white dark:bg-slate-800 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Chart Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800 flex flex-col items-center transition-colors min-h-[360px] justify-center">
        {isEmpty ? (
            <div className="flex flex-col items-center justify-center opacity-50 py-10">
                <div className="w-32 h-32 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4">
                    <PieChartIcon size={48} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-bold text-slate-400 dark:text-slate-500">No data for this period</p>
            </div>
        ) : (
            <>
                <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={8}
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                        itemStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                    />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Flow</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full mt-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-emerald-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase">Income</span>
                    </div>
                    <p className="text-xl font-black text-slate-800 dark:text-white">${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-rose-500">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold uppercase">Expenses</span>
                    </div>
                    <p className="text-xl font-black text-slate-800 dark:text-white">${stats.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                </div>
            </>
        )}
      </div>

      {/* AI Assistant Insight */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[32px] text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <TrendingUp size={60} />
        </div>
        <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
          <span>✨</span> Smart Insight
        </h4>
        <p className="text-xs font-medium leading-relaxed opacity-90">
          {aiInsight}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="space-y-4">
         <h3 className="text-lg font-black text-slate-800 dark:text-white ml-1">Breakdown</h3>
         <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm flex items-center justify-between border border-slate-50 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Net Savings</p>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Income - Expenses</p>
              </div>
            </div>
            <p className={`text-lg font-black ${stats.income - stats.expenses >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stats.income - stats.expenses >= 0 ? '+' : ''}${(stats.income - stats.expenses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
         </div>
         <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm flex items-center justify-between border border-slate-50 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-500">
                <TrendingDown size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Avg. Daily Spend</p>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Based on period</p>
              </div>
            </div>
            <p className="text-lg font-black text-rose-500">
                -${(stats.expenses / (filter === 'day' ? 1 : filter === 'week' ? 7 : 30)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
         </div>
      </div>
    </div>
  );
};

export default StatisticsScreen;
