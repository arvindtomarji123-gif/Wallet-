
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, Banknote, Settings } from 'lucide-react';
import { useAppContext } from '../App';

const BottomNav: React.FC = () => {
  const { playSound } = useAppContext();

  const navItems = [
    { to: '/', icon: Home, label: 'Home', end: true },
    { to: '/notifications', icon: Banknote, label: 'Alerts' },
    { to: '/settings', icon: Settings, label: 'Profile' },
  ];

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 transition-all duration-300 p-2 rounded-2xl active:scale-90 ${
      isActive 
        ? 'text-purple-600 dark:text-purple-400 -translate-y-1' 
        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
    }`;

  const handleClick = () => {
      playSound('click');
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 flex justify-between items-center pt-3 pb-8 px-8 z-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] transition-colors duration-300">
      {/* Left Group */}
      {navItems.slice(0, 2).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={handleClick}
          className={getLinkClass}
        >
          <item.icon size={24} strokeWidth={2.5} />
          <span className="text-[10px] font-bold">{item.label}</span>
        </NavLink>
      ))}

      {/* Center Group - Insights */}
      <NavLink
        to="/statistics"
        onClick={handleClick}
        className={getLinkClass}
      >
        <BarChart3 size={24} strokeWidth={2.5} />
        <span className="text-[10px] font-bold">Insights</span>
      </NavLink>

      {/* Right Group */}
      {navItems.slice(2).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={handleClick}
          className={getLinkClass}
        >
          <item.icon size={24} strokeWidth={2.5} />
          <span className="text-[10px] font-bold">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
