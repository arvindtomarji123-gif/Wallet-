
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { ArrowRight, Lock } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { login } = useAppContext();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      login();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10 space-y-2">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mx-auto flex items-center justify-center border border-white/20 shadow-2xl mb-6">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">WalletWise</h1>
          <p className="text-indigo-200 font-medium">Secure Personal Finance</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[40px] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-200 uppercase tracking-widest ml-2">Enter PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-center text-2xl font-black text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-purple-400/50 transition-all tracking-widest"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-indigo-900 font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:scale-100"
            >
              {loading ? (
                <span className="animate-pulse">Unlocking...</span>
              ) : (
                <>
                  Access Wallet <ArrowRight size={20} strokeWidth={3} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-indigo-300/60 text-xs font-semibold">
          Protected by Biometric Security
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
