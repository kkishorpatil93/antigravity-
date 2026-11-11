import React from 'react';
import { Link } from 'react-router-dom';
import { FarmerProfile } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../common/Card';
import { Layers, Droplet, MapPin, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfileSummaryCard: React.FC<{ profile: FarmerProfile | null }> = ({ profile }) => {
  const { t } = useLanguage();

  const isProfileComplete = Boolean(
    profile?.state && profile?.district && profile?.farm_area && profile?.soil_type
  );

  return (
    <Card
      title={t.dashboard.profileSummary}
      headerAction={
        <Link
          to="/profile"
          className="text-xs text-agri-700 hover:text-agri-900 font-semibold flex items-center gap-1"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{t.common.edit}</span>
        </Link>
      }
      className="mb-6"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-cream-50 p-3 rounded-lg border border-earth-100">
          <span className="text-[11px] font-medium text-gray-500 block mb-1">
            {t.dashboard.location}
          </span>
          <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm text-agri-950">
            <MapPin className="w-3.5 h-3.5 text-agri-600 flex-shrink-0" />
            <span className="truncate">
              {profile?.district || 'Not Set'}, {profile?.state || 'India'}
            </span>
          </div>
        </div>

        <div className="bg-cream-50 p-3 rounded-lg border border-earth-100">
          <span className="text-[11px] font-medium text-gray-500 block mb-1">
            {t.dashboard.landArea}
          </span>
          <div className="font-semibold text-xs sm:text-sm text-agri-950">
            {profile?.farm_area ? `${profile.farm_area} ${profile.farm_area_unit || 'acres'}` : 'Not Specified'}
          </div>
        </div>

        <div className="bg-cream-50 p-3 rounded-lg border border-earth-100">
          <span className="text-[11px] font-medium text-gray-500 block mb-1">
            {t.dashboard.soilType}
          </span>
          <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm text-agri-950">
            <Layers className="w-3.5 h-3.5 text-earth-500 flex-shrink-0" />
            <span className="truncate">{profile?.soil_type || 'General Soil'}</span>
          </div>
        </div>

        <div className="bg-cream-50 p-3 rounded-lg border border-earth-100">
          <span className="text-[11px] font-medium text-gray-500 block mb-1">
            {t.dashboard.irrigationType}
          </span>
          <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm text-agri-950">
            <Droplet className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{profile?.irrigation_type || 'Mixed / Rainfed'}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {isProfileComplete ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-agri-600" />
              <span className="text-agri-800 font-medium">Farm Profile Configured</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-amber-800 font-medium">Complete your soil profile for higher precision</span>
            </>
          )}
        </div>
        {!isProfileComplete && (
          <Link to="/profile" className="text-agri-700 underline font-semibold">
            Complete Profile &rarr;
          </Link>
        )}
      </div>
    </Card>
  );
};

