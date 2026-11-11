import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ScanLine, FlaskConical, Droplets, MessageSquareText, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const QuickActionCard: React.FC = () => {
  const { t } = useLanguage();

  const actions = [
    {
      title: t.dashboard.actionCropTitle,
      desc: t.dashboard.actionCropDesc,
      to: '/advisory/crop-recommendation',
      icon: Sprout,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400',
      badge: 'Sowing Planning',
    },
    {
      title: t.dashboard.actionDiseaseTitle,
      desc: t.dashboard.actionDiseaseDesc,
      to: '/advisory/disease-detection',
      icon: ScanLine,
      color: 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-400',
      badge: 'Multimodal Vision',
    },
    {
      title: t.dashboard.actionFertilizerTitle,
      desc: t.dashboard.actionFertilizerDesc,
      to: '/advisory/fertilizer',
      icon: FlaskConical,
      color: 'bg-purple-50 text-purple-800 border-purple-200 hover:border-purple-400',
      badge: 'Nutrient Optimization',
    },
    {
      title: t.dashboard.actionIrrigationTitle,
      desc: t.dashboard.actionIrrigationDesc,
      to: '/advisory/irrigation',
      icon: Droplets,
      color: 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400',
      badge: 'Water Management',
    },
    {
      title: t.dashboard.actionChatTitle,
      desc: t.dashboard.actionChatDesc,
      to: '/assistant',
      icon: MessageSquareText,
      color: 'bg-agri-50 text-agri-900 border-agri-200 hover:border-agri-400',
      badge: 'AI Assistant',
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-base sm:text-lg font-bold text-agri-950 mb-3">
        {t.dashboard.quickActions}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((act) => (
          <Link
            key={act.to}
            to={act.to}
            className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${act.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-white shadow-2xs">
                  <act.icon className="w-5 h-5 text-current" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-current/20">
                  {act.badge}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-1 text-gray-900">
                {act.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {act.desc}
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold gap-1 pt-2 border-t border-current/10">
              <span>Launch Advisory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

