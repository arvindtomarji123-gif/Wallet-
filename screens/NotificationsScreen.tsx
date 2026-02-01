
import React from 'react';
import { Banknote, ArrowDownLeft, ArrowUpRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../App';
import { NotificationItem } from '../types';

const NotificationsScreen: React.FC = () => {
  const { state, clearNotifications } = useAppContext();
  const notifications = state.notifications;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'credit': return <ArrowDownLeft size={22} />;
      case 'debit': return <ArrowUpRight size={22} />;
      case 'alert': return <AlertCircle size={22} />;
      case 'info': return <ShieldCheck size={22} />;
      default: return <Banknote size={22} />;
    }
  };

  const getColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'credit': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'debit': return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400';
      case 'alert': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Notifications</h1>
        {notifications.length > 0 && (
          <button 
            onClick={clearNotifications}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 active:opacity-70 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            Clear All
          </button>
        )}
      </header>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm flex gap-4 transition-colors animate-in slide-in-from-bottom-2 duration-300">
              <div className={`${getColor(n.type)} w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-colors`}>
                {getIcon(n.type)}
              </div>
              <div className="space-y-1 w-full">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{n.title}</p>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 whitespace-nowrap ml-2">{getTimeAgo(n.date)}</span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{n.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700 transition-colors">
               <CheckCircle2 size={32} />
             </div>
             <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">All caught up!</p>
             <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-[200px] mx-auto leading-relaxed">No new notifications at the moment. We'll let you know when something happens.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
