import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

interface HeaderProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  showSidebarToggle = false,
}) => {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-earth-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-agri-800 hover:bg-agri-50"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-agri-700 text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-agri-950 tracking-tight block leading-tight">
                {t.common.appName}
              </span>
              <span className="text-[10px] text-agri-700 font-medium tracking-wide hidden sm:block">
                {t.common.karnatakaFocus}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-agri-50 border border-transparent hover:border-agri-200"
              >
                <div className="w-6 h-6 rounded-full bg-agri-100 text-agri-800 flex items-center justify-center font-bold">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                title={t.common.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-agri-800 hover:text-agri-950 px-3 py-1.5 rounded-md"
              >
                {t.common.login}
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm font-medium bg-agri-700 hover:bg-agri-800 text-white px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors"
              >
                {t.common.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

