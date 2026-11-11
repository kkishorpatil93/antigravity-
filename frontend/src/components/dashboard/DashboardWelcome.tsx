import React from 'react';
import { FarmerProfile } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { MapPin, Calendar } from 'lucide-react';

export const DashboardWelcome: React.FC<{ profile: FarmerProfile | null; email?: string }> = ({
  profile,
  email,
}) => {
  const { t } = useLanguage();
  const displayName = profile?.full_name || email?.split('@')[0] || 'Farmer';
  const locationText =
    profile?.district && profile?.state
      ? `${profile.district}, ${profile.state}`
      : 'Karnataka, India';

  const today = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="bg-gradient-to-r from-agri-900 via-agri-800 to-agri-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden mb-6">
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-agri-700/80 text-agri-100 backdrop-blur-xs">
            <MapPin className="w-3.5 h-3.5 text-agri-300" />
            {locationText}
          </span>
          <span className="text-xs text-agri-200 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {today}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          {t.dashboard.welcome}, {displayName} 👋
        </h1>
        <p className="text-agri-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
          {t.landing.heroSubtitle}
        </p>
      </div>

      {/* Decorative leaf watermarks */}
      <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
        <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.55.101.75-.239.75-.53 0-.261-.01-1.127-.015-2.046-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .295.197.64.757.529C19.138 20.163 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </div>
    </div>
  );
};

