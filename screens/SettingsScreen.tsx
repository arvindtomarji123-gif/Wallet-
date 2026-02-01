
import React, { useState, useRef } from 'react';
import { User, Shield, Banknote, ChevronRight, Moon, Sun, Edit2, X, Save, Wallet, Camera } from 'lucide-react';
import { useAppContext } from '../App';
import { useNavigate } from 'react-router-dom';

const SettingsScreen: React.FC = () => {
  const { state, toggleTheme, updateUser, playSound } = useAppContext();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);
  const [balance, setBalance] = useState(state.balance.toString());
  const [avatar, setAvatar] = useState(state.user.avatar);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('success');
    updateUser({
      name,
      email,
      avatar,
      balance: parseFloat(balance) || 0
    });
    setIsEditModalOpen(false);
  };

  const openModal = () => {
    playSound('click');
    setName(state.user.name);
    setEmail(state.user.email);
    setBalance(state.balance.toString());
    setAvatar(state.user.avatar);
    setIsEditModalOpen(true);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) { // 2MB limit
        alert("Image is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        playSound('click');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom duration-500 relative">
      <header>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Settings</h1>
      </header>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
        <div className="flex items-center gap-4">
          <img src={state.user.avatar} alt="Avatar" className="w-16 h-16 rounded-3xl object-cover ring-2 ring-white dark:ring-slate-800" />
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100">{state.user.name}</p>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{state.user.email}</p>
          </div>
        </div>
        <button 
          onClick={openModal}
          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all active:scale-95"
          aria-label="Edit Profile"
        >
          <Edit2 size={20} />
        </button>
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Appearance</h3>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm transition-colors">
          <div className="w-full flex items-center justify-between p-5 active:bg-slate-50 dark:active:bg-slate-800/50">
             <div className="flex items-center gap-4">
               <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
                 {state.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
               </div>
               <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Dark Mode</span>
             </div>
             <button 
               onClick={toggleTheme}
               className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${state.theme === 'dark' ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}
             >
               <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${state.theme === 'dark' ? 'translate-x-6' : ''}`} />
             </button>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Account</h3>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm transition-colors">
            <button 
              onClick={() => window.open('https://www.freeprivacypolicy.com/live/b94a80a4-affe-4541-83cc-e5130b8f0399', '_blank')}
              className="w-full flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
                    <Shield size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Security & Privacy</span>
                </div>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
            </button>
             <button 
               onClick={() => { playSound('click'); navigate('/notifications'); }}
               className="w-full flex items-center justify-between p-5 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors"
             >
                <div className="flex items-center gap-4">
                  <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
                    <Banknote size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Notifications</span>
                </div>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
            </button>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">WalletWise v1.3.0</p>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0" onClick={() => setIsEditModalOpen(false)} />
           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Edit Profile</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800" />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                  <div className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white border-4 border-white dark:border-slate-900">
                    <Edit2 size={12} />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <p className="text-xs text-slate-400 mt-2">Tap to change photo</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                   <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-2">Display Name</label>
                   <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border-2 border-transparent focus-within:border-purple-500 transition-colors">
                      <User size={20} className="text-slate-400" />
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent w-full outline-none font-bold text-slate-700 dark:text-slate-200"
                        placeholder="Your Name"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-2">Email Address</label>
                   <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border-2 border-transparent focus-within:border-purple-500 transition-colors">
                      <Edit2 size={20} className="text-slate-400" />
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent w-full outline-none font-bold text-slate-700 dark:text-slate-200"
                        placeholder="email@example.com"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-2">Total Balance Correction</label>
                   <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border-2 border-transparent focus-within:border-purple-500 transition-colors">
                      <Wallet size={20} className="text-slate-400" />
                      <input 
                        type="number" 
                        step="0.01"
                        value={balance} 
                        onChange={(e) => setBalance(e.target.value)}
                        className="bg-transparent w-full outline-none font-bold text-slate-700 dark:text-slate-200"
                        placeholder="0.00"
                      />
                   </div>
                   <p className="text-[10px] text-slate-400 mt-2 ml-2">Use this to manually fix your wallet balance if it's incorrect.</p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 dark:shadow-purple-900/40 flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
