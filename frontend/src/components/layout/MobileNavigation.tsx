import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, ScanLine, MessageSquareText, History } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const MobileNavigation: React.FC = () => {
  const { t } = useLanguage();

  const items = [
    { name: t.common.dashboard, to: '/dashboard', icon: LayoutDashboard },
    { name: 'Crops', to: '/advisory/crop-recommendation', icon: Sprout },
    { name: 'Scanner', to: '/advisory/disease-detection', icon: ScanLine },
    { name: 'Chat', to: '/assistant', icon: MessageSquareText },
    { name: 'History', to: '/history', icon: History },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-earth-100 flex items-center justify-around py-1.5 px-2 lg:hidden shadow-lg">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-agri-700 font-bold'
                : 'text-gray-500 hover:text-agri-800'
            }`
          }
        >
          <item.icon className="w-5 h-5 mb-0.5" />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

