import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const FarmingTipCard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 mb-6 shadow-2xs">
      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center flex-shrink-0">
        <Lightbulb className="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-amber-950 mb-1">
          {t.dashboard.farmingTipTitle}
        </h3>
        <p className="text-xs text-amber-900 leading-relaxed">
          {t.dashboard.farmingTipBody}
        </p>
      </div>
    </div>
  );
};

