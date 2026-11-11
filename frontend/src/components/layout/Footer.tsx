import React from 'react';
import { Sprout, ShieldAlert, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-cream-100 border-t border-earth-100/80 text-gray-600 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-agri-900 font-bold text-sm">
            <div className="w-6 h-6 rounded-md bg-agri-700 text-white flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <span>{t.common.appName}</span>
            <span className="text-gray-400 font-normal">|</span>
            <span className="text-gray-600 font-normal text-xs">{t.common.karnatakaFocus}</span>
          </div>
          <p className="flex items-center gap-1 text-gray-500">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Indian Farmers
          </p>
        </div>

        <div className="bg-white/80 rounded-lg p-3 border border-earth-100 text-[11px] text-gray-500 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t.common.disclaimer}</p>
        </div>

        <div className="text-center text-gray-400 text-[11px] pt-2">
          &copy; {new Date().getFullYear()} {t.common.appName}. {t.common.allRightsReserved}
        </div>
      </div>
    </footer>
  );
};

