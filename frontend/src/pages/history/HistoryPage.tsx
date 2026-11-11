import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdvisoryRecord } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import {
  History,
  Sprout,
  ScanLine,
  FlaskConical,
  Droplets,
  Calendar,
  Trash2,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { t } = useLanguage();
  const [advisories, setAdvisories] = useState<AdvisoryRecord[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchHistory = (p = 1, type = filterType) => {
    setLoading(true);
    api.history
      .list(p, 10, type || undefined)
      .then((data) => {
        setAdvisories(data.advisories);
        setPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages || 1);
      })
      .catch((err) => console.warn('History fetch error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory(1, filterType);
  }, [filterType]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this advisory record?')) return;
    try {
      await api.history.delete(id);
      setAdvisories((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'crop_recommendation':
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'disease_detection':
        return <ScanLine className="w-5 h-5 text-amber-600" />;
      case 'fertilizer':
        return <FlaskConical className="w-5 h-5 text-purple-600" />;
      case 'irrigation':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      default:
        return <Sprout className="w-5 h-5 text-agri-600" />;
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-agri-950">
              {t.nav.history}
            </h1>
            <p className="text-xs text-gray-500">
              Review and audit previous crop advisories, plant disease scans, and nutrient plans
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-agri-500 focus:outline-none"
          >
            <option value="">All Advisory Types</option>
            <option value="crop_recommendation">Crop Selection</option>
            <option value="disease_detection">Disease Scans</option>
            <option value="fertilizer">Fertilizer Plans</option>
            <option value="irrigation">Irrigation Schedules</option>
          </select>
        </div>
      </div>

      <Card>
        {loading ? (
          <SkeletonLoader count={4} className="h-16 w-full" />
        ) : advisories.length === 0 ? (
          <EmptyState
            title="No Advisory Records Found"
            description="You have not generated any advisories in this category yet."
            actionText="Go to Dashboard"
            onAction={() => (window.location.href = '/dashboard')}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {advisories.map((adv) => (
              <div
                key={adv.id}
                className="py-4 px-2 flex items-center justify-between hover:bg-cream-50/80 rounded-xl transition-colors group"
              >
                <Link
                  to={getRoute(adv)}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-earth-100 flex-shrink-0">
                    {getIcon(adv.advisory_type)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-agri-950 group-hover:text-agri-700 truncate">
                      {adv.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-gray-100 font-medium text-[10px]">
                        {adv.advisory_type.replace('_', ' ')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(adv.created_at).toLocaleDateString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(adv.id, e)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    to={getRoute(adv)}
                    className="p-2 text-gray-400 group-hover:text-agri-700 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 text-xs">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => fetchHistory(page - 1)}
            >
              &larr; Previous
            </Button>
            <span className="text-gray-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => fetchHistory(page + 1)}
            >
              Next &rarr;
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

