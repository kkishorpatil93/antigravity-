import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdvisoryRecord, IrrigationAdvisoryResult } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import {
  Droplets,
  ArrowLeft,
  Printer,
  CalendarCheck,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export const IrrigationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [advisory, setAdvisory] = useState<AdvisoryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api.advisory
        .cropRecommendationById(id)
        .then((data) => setAdvisory(data))
        .catch((err) => setError(err.message || 'Failed to load irrigation advisory'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 py-8">
        <SkeletonLoader className="h-8 w-64" />
        <SkeletonLoader className="h-40 w-full" />
        <SkeletonLoader className="h-64 w-full" />
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <Alert type="danger" title="Not Found">
          {error || 'Irrigation schedule record could not be found'}
        </Alert>
        <Link to="/advisory/irrigation" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            &larr; Create New Water Schedule
          </Button>
        </Link>
      </div>
    );
  }

  const result: IrrigationAdvisoryResult = advisory.result_data;

  return (
    <div className="max-w-5xl mx-auto space-y-6 print:py-0">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          to="/advisory/irrigation"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-agri-700 hover:text-agri-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Water Schedule</span>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          icon={<Printer className="w-4 h-4" />}
        >
          {t.advisoryResults.printReport}
        </Button>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-agri-950 to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Droplets className="w-4 h-4" />
          <span>{t.advisoryResults.irrigationTitle}</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          {advisory.title}
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Irrigation Guidance & Critical Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Irrigation Frequency & Method Guidance">
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {result.irrigationGuidance.map((guide, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{guide}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Moisture-Critical Growth Milestones">
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {result.criticalGrowthStages.map((stage, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CalendarCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{stage}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Water-Saving Practices & Water Stress Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Water Conservation Techniques">
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
            {result.waterSavingMethods.map((method, i) => (
              <li key={i} className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{method}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Water Stress Warnings (Drought / Waterlogging)">
          <ul className="space-y-2 text-xs sm:text-sm text-amber-950">
            {result.waterStressWarnings.map((warn, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{warn}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Missing Information & Limitations */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 space-y-3">
        {result.missingInformation.length > 0 && (
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-800">Missing Sensor / Weather Data: </span>
              <span>{result.missingInformation.join('; ')}</span>
            </div>
          </div>
        )}

        {result.limitations.length > 0 && (
          <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
            <ShieldAlert className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-800">Limitations: </span>
              <span>{result.limitations.join('; ')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

