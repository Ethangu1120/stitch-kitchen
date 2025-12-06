import React from 'react';
import { ViewState } from '../types';
import { Thermometer, Utensils, List, User } from 'lucide-react';

interface BottomNavProps {
  current: ViewState;
  onChange: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ current, onChange }) => {
  const NavItem = ({ view, label, icon: Icon }: { view: ViewState; label: string; icon: any }) => {
    const isActive = current === view;
    return (
      <button
        onClick={() => onChange(view)}
        className={`flex flex-1 flex-col items-center justify-end gap-1 ${
          isActive ? 'text-white' : 'text-app-textSub'
        }`}
      >
        <div className={`flex h-8 items-center justify-center ${isActive ? 'bg-transparent rounded-full' : ''}`}>
           <Icon 
             size={24} 
             weight={isActive ? "fill" : "regular"} 
             fill={isActive ? "currentColor" : "none"}
             stroke={isActive ? "none" : "currentColor"}
             strokeWidth={isActive ? 0 : 2}
             className={isActive ? "fill-current" : ""}
           />
        </div>
        <p className="text-xs font-medium leading-normal tracking-[0.015em]">{label}</p>
      </button>
    );
  };

  return (
    <div className="sticky bottom-0 w-full z-50">
      <div className="flex gap-2 border-t border-app-secondary bg-app-card px-4 pb-3 pt-2">
        <NavItem view="fridge" label="冰箱" icon={Thermometer} />
        <NavItem view="home" label="菜谱" icon={Utensils} />
        <NavItem view="shopping" label="购物单" icon={List} />
        <NavItem view="profile" label="我的" icon={User} />
      </div>
      <div className="h-5 bg-app-card"></div>
    </div>
  );
};

export default BottomNav;