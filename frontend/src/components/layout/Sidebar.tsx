import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  ScanLine,
  FlaskConical,
  Droplets,
  MessageSquareText,
  History,
  User,
  Settings,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const navigationItems = [
    { name: t.common.dashboard, to: '/dashboard', icon: LayoutDashboard },
    { name: t.nav.cropRecommendation, to: '/advisory/crop-recommendation', icon: Sprout },
    { name: t.nav.diseaseDetection, to: '/advisory/disease-detection', icon: ScanLine },
    { name: t.nav.fertilizer, to: '/advisory/fertilizer', icon: FlaskConical },
    { name: t.nav.irrigation, to: '/advisory/irrigation', icon: Droplets },
    { name: t.nav.assistant, to: '/assistant', icon: MessageSquareText },
    { name: t.nav.history, to: '/history', icon: History },
    { name: t.nav.profile, to: '/profile', icon: User },
    { name: t.common.settings, to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-2xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-earth-100 flex flex-col justify-between pt-16 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-agri-100 text-agri-900 font-semibold shadow-2xs'
                    : 'text-gray-600 hover:text-agri-800 hover:bg-cream-100'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-earth-100 bg-cream-50/50">
          <div className="rounded-lg bg-agri-50 p-3 border border-agri-200 text-xs">
            <p className="font-semibold text-agri-900 mb-1">
              🌱 AgroPulse Core
            </p>
            <p className="text-gray-600 leading-relaxed">
              Powered by Google Gemini 2.5 Flash with multimodal agronomic analysis.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

