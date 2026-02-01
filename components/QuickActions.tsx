
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ScanLine } from 'lucide-react';
import { useAppContext } from '../App';

interface Props {
  onAdd: () => void;
}

const QuickActions: React.FC<Props> = ({ onAdd }) => {
  const navigate = useNavigate();
  const { playSound } = useAppContext();
  
  const handleAction = (action: () => void) => {
    playSound('click');
    action();
  };

  const actions = [
    { 
      label: 'Add', 
      icon: PlusCircle, 
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300', 
      action: onAdd 
    },
    { 
      label: 'Scan', 
      icon: ScanLine, 
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300', 
      action: () => navigate('/scan')
    },
  ];

  return (
    <div className="flex justify-center gap-10 px-4 py-2">
      {actions.map((item, index) => (
        <button
          key={item.label}
          onClick={() => handleAction(item.action)}
          className="flex flex-col items-center gap-3 group animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-both"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className={`${item.color} p-6 rounded-[28px] transition-all duration-300 group-active:scale-90 shadow-xl shadow-slate-100 dark:shadow-none border border-white dark:border-slate-800 group-hover:-translate-y-2`}>
            <item.icon size={32} strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
