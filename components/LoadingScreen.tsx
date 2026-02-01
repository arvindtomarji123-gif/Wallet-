
import React from 'react';
import { Wallet } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-900 transition-all duration-500">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative flex flex-col items-center z-10">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 animate-pulse"></div>
          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-2xl flex items-center justify-center relative z-10">
            <Wallet className="text-white w-12 h-12" strokeWidth={2.5} />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-white tracking-tight mb-3">WalletWise</h1>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      <div className="absolute bottom-10 text-center">
        <p className="text-[10px] font-bold text-indigo-200/60 uppercase tracking-[0.2em]">Secure Personal Finance</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
