import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdvisoryRecord } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { Sprout, ScanLine, FlaskConical, Droplets, ChevronRight, Calendar } from 'lucide-react';

export const RecentAdvisories: React.FC = () => {
  const { t } = useLanguage();
  const [advisories, setAdvisories] = useState<AdvisoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.history
      .list(1, 5)
      .then((data) => setAdvisories(data.advisories))
      .catch((err) => console.warn('Could not fetch recent advisories:', err))
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'crop_recommendation':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'disease_detection':
        return <ScanLine className="w-4 h-4 text-amber-600" />;
      case 'fertilizer':
        return <FlaskConical className="w-4 h-4 text-purple-600" />;
      case 'irrigation':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      default:
        return <Sprout className="w-4 h-4 text-agri-600" />;
    }
  };

  const getRoute = (advisory: AdvisoryRecord) => {
    switch (advisory.advisory_type) {
      case 'crop_recommendation':
        return `/advisory/crop-recommendation/result/${advisory.id}`;
      case 'disease_detection':
        return `/advisory/disease-detection/result/${advisory.id}`;
      case 'fertilizer':
        return `/advisory/fertilizer/result/${advisory.id}`;
      case 'irrigation':
        return `/advisory/irrigation/result/${advisory.id}`;
      default:
        return `/history/${advisory.id}`;
    }
  };

  return (
    <Card
      title={t.dashboard.recentAdvisories}
      headerAction={
        <Link
          to="/history"
          className="text-xs text-agri-700 hover:text-agri-900 font-semibold flex items-center gap-1"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      }
      className="mb-6"
    >
      {loading ? (
        <SkeletonLoader count={3} className="h-14 w-full" />
      ) : advisories.length === 0 ? (
        <EmptyState
          title="No Advisories Yet"
          description={t.dashboard.noAdvisories}
        />
      ) : (
        <div className="divide-y divide-gray-100">
          {advisories.map((adv) => (
            <Link
              key={adv.id}
              to={getRoute(adv)}
              className="py-3 px-2 flex items-center justify-between hover:bg-cream-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-white shadow-2xs">
                  {getIcon(adv.advisory_type)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-agri-950 group-hover:text-agri-700">
                    {adv.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                    <span className="capitalize">{adv.advisory_type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(adv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-agri-700 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};

