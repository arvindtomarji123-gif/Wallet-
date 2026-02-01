
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface Props {
  balance: number;
}

const BalanceCard: React.FC<Props> = ({ balance }) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-800 p-8 rounded-[40px] text-white shadow-2xl shadow-purple-200">
      {/* Decorative blobs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-purple-100/80 font-medium text-sm mb-1 uppercase tracking-wider">Total Balance</p>
            <h2 className="text-4xl font-bold tracking-tight">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <button 
            onClick={() => navigate('/statistics')}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all"
          >
            <TrendingUp size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
          <div className="bg-emerald-400 rounded-full p-1">
            <ArrowUpRight size={12} strokeWidth={3} className="text-indigo-900" />
          </div>
          <span className="text-sm font-semibold text-emerald-300">+12.5% this month</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
