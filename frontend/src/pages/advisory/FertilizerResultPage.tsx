import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdvisoryRecord, FertilizerAdvisoryResult } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import {
  FlaskConical,
  ArrowLeft,
  Printer,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TestTubes,
} from 'lucide-react';

export const FertilizerResultPage: React.FC = () => {
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
        .catch((err) => setError(err.message || 'Failed to load fertilizer advisory'))
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
          {error || 'Fertilizer guidance record could not be found'}
        </Alert>
        <Link to="/advisory/fertilizer" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            &larr; Calculate New Nutrient Plan
          </Button>
        </Link>
      </div>
    );
  }

  const result: FertilizerAdvisoryResult = advisory.result_data;

  return (
    <div className="max-w-5xl mx-auto space-y-6 print:py-0">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          to="/advisory/fertilizer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-agri-700 hover:text-agri-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Nutrient Plan</span>
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
      <div className="bg-gradient-to-r from-purple-950 to-agri-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <FlaskConical className="w-4 h-4" />
          <span>{t.advisoryResults.fertilizerTitle}</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          {advisory.title}
        </h1>
        <p className="text-xs sm:text-sm text-purple-100 max-w-3xl leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Nutrient Issues Observed */}
      {result.possibleNutrientIssues && result.possibleNutrientIssues.length > 0 && (
        <Card title="Identified Nutrient Deficiencies & Imbalances">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.possibleNutrientIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-purple-950 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{issue}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Split Application Timing & Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Management & Dosage Guidance">
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {result.managementRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Application Timing Schedule">
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {result.applicationTiming.map((timing, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{timing}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Soil Testing & Precautions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Soil Testing Recommendations">
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            {result.soilTestingRecommendations.map((test, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <TestTubes className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{test}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Environmental & Handling Precautions">
          <div className="space-y-2 text-xs text-amber-950">
            {result.safetyPrecautions.map((safe, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{safe}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Missing Information Notice */}
      {result.missingInformation && result.missingInformation.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-xs text-gray-800 mb-0.5">Parameters Missing for Exact Stoichiometry</h4>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 text-gray-500">
              {result.missingInformation.map((info, i) => (
                <li key={i}>{info}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

