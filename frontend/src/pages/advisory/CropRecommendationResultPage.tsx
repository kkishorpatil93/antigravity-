import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdvisoryRecord, CropRecommendationResult } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import {
  Sprout,
  ArrowLeft,
  Printer,
  Calendar,
  Droplet,
  Layers,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

export const CropRecommendationResultPage: React.FC = () => {
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
        .catch((err) => setError(err.message || 'Failed to load recommendation'))
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
          {error || 'Advisory recommendation record could not be found'}
        </Alert>
        <Link to="/advisory/crop-recommendation" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            &larr; Try New Recommendation
          </Button>
        </Link>
      </div>
    );
  }

  const result: CropRecommendationResult = advisory.result_data;

  return (
    <div className="max-w-5xl mx-auto space-y-6 print:py-0">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          to="/advisory/crop-recommendation"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-agri-700 hover:text-agri-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Recommendation</span>
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

      {/* Advisory Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-agri-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sprout className="w-4 h-4" />
          <span>{t.advisoryResults.recommendationTitle}</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          {advisory.title}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Recommended Crops Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-agri-950">Top Recommended Cultivars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {result.recommendedCrops.map((crop, idx) => (
            <Card
              key={idx}
              className="border-t-4 border-t-emerald-600 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-lg font-bold text-agri-950">{crop.cropName}</h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  {crop.suitability}
                </span>
              </div>

              <p className="text-xs text-gray-700 mb-4 leading-relaxed bg-cream-50 p-2.5 rounded-lg border border-earth-100">
                {crop.reason}
              </p>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-agri-600 flex-shrink-0" />
                  <span>Duration: <strong className="text-gray-900">{crop.cultivationDuration}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Droplet className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span>Water Needs: <strong className="text-gray-900">{crop.waterRequirement}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Layers className="w-3.5 h-3.5 text-earth-500 flex-shrink-0" />
                  <span>Soil Fit: <strong className="text-gray-900">{crop.soilCompatibility}</strong></span>
                </div>
              </div>

              {crop.risks && crop.risks.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Key Agronomic Risks
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-gray-600 space-y-0.5">
                    {crop.risks.map((risk, rIdx) => (
                      <li key={rIdx}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* General Recommendations & Missing Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={t.advisoryResults.generalAdvice}>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
            {result.generalRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={t.advisoryResults.missingInfo}>
          {result.missingInformation.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              {result.missingInformation.map((info, i) => (
                <li key={i} className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{info}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">All essential field parameters were provided.</p>
          )}
        </Card>
      </div>

      {/* Limitations Warning */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-xs mb-1">Agronomic Notice & Limitations</h4>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            {result.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

