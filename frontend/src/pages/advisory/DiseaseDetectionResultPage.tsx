import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DiseaseAnalysisResult } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import {
  ScanLine,
  ArrowLeft,
  Printer,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
} from 'lucide-react';

export const DiseaseDetectionResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [data, setData] = useState<{
    result: DiseaseAnalysisResult;
    imageUrl?: string;
    title?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api.advisory
        .diseaseDetectionById(id)
        .then((res) => {
          const result = res.result || res.result_data || (res as any).advisory?.result_data;
          setData({
            result,
            imageUrl: res.imageUrl,
            title: (res as any).crop_name || (res as any).advisory?.title || 'Crop Pathology Report',
          });
        })
        .catch((err) => setError(err.message || 'Failed to load disease analysis'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 py-8">
        <SkeletonLoader className="h-8 w-64" />
        <SkeletonLoader className="h-48 w-full" />
        <SkeletonLoader className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data || !data.result) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <Alert type="danger" title="Analysis Not Found">
          {error || 'Plant pathology record could not be found'}
        </Alert>
        <Link to="/advisory/disease-detection" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            &larr; Upload New Image
          </Button>
        </Link>
      </div>
    );
  }

  const { result, imageUrl } = data;

  const likelihoodBadge = (likelihood: string) => {
    switch (likelihood) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 print:py-0">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          to="/advisory/disease-detection"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-agri-700 hover:text-agri-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Scan</span>
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
      <div className="bg-gradient-to-r from-amber-950 via-earth-900 to-amber-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <ScanLine className="w-4 h-4" />
          <span>{t.advisoryResults.diagnosisTitle}</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Target Crop: {result.cropName}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-amber-100">
          <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs">
            Image Quality: <strong>{result.imageQuality.toUpperCase()}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs">
            Assessment Status: <strong>{result.assessmentStatus.replace('_', ' ').toUpperCase()}</strong>
          </span>
        </div>
      </div>

      {/* Image & Primary Diagnosis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {imageUrl && (
          <div className="md:col-span-1">
            <Card title="Scanned Crop Photo">
              <div className="rounded-lg overflow-hidden bg-gray-900 h-64 flex items-center justify-center border border-earth-100">
                <img
                  src={imageUrl}
                  alt="Scanned plant pathology"
                  className="w-full h-full object-contain"
                />
              </div>
            </Card>
          </div>
        )}

        <div className={imageUrl ? 'md:col-span-2' : 'md:col-span-3'}>
          <Card title="Identified Possible Conditions">
            {result.possibleConditions.length === 0 ? (
              <p className="text-xs text-gray-500">No pathological conditions clearly detected.</p>
            ) : (
              <div className="space-y-4">
                {result.possibleConditions.map((cond, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-earth-100 bg-cream-50/70 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-agri-950">{cond.name}</h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${likelihoodBadge(
                          cond.likelihood
                        )}`}
                      >
                        Likelihood: {cond.likelihood.toUpperCase()}
                      </span>
                    </div>

                    {cond.symptoms && cond.symptoms.length > 0 && (
                      <div className="text-xs text-gray-700">
                        <strong className="text-gray-900 block mb-0.5">Identified Symptoms:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                          {cond.symptoms.map((s, sIdx) => (
                            <li key={sIdx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {cond.possibleCauses && cond.possibleCauses.length > 0 && (
                      <div className="text-xs text-gray-700 pt-1">
                        <strong className="text-gray-900 block mb-0.5">Underlying Causes / Triggers:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                          {cond.possibleCauses.map((c, cIdx) => (
                            <li key={cIdx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Action Plan & Preventive Measures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={t.advisoryResults.actions}>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {result.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={t.advisoryResults.prevention}>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {result.preventiveMeasures.map((prev, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <FileCheck2 className="w-4 h-4 text-agri-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{prev}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Chemical Safety & PPE Warnings */}
      {result.safetyWarnings && result.safetyWarnings.length > 0 && (
        <Card title={t.advisoryResults.safety} className="border-red-200 bg-red-50/30">
          <ul className="space-y-2 text-xs text-red-900">
            {result.safetyWarnings.map((warn, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{warn}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* KVK Expert Consultation Recommendation */}
      {result.expertConsultationRecommended && (
        <div className="bg-agri-50 border border-agri-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
          <Building2 className="w-6 h-6 text-agri-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-agri-950">
            <h4 className="font-bold text-sm mb-1">{t.advisoryResults.expertConsult}</h4>
            <p className="text-gray-600 leading-relaxed">
              Due to disease severity or symptom overlap, we strongly recommend showing an affected sample to your nearest Krishi Vigyan Kendra (KVK) or Raitha Samparka Kendra (RSK) extension officer for physical microscopy.
            </p>
          </div>
        </div>
      )}

      {/* Non-Lab Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-[11px] text-gray-500 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Important Disclaimer: This automated diagnosis is generated using multimodal computer vision models for initial field triage. It is not a laboratory-confirmed culture analysis. Always follow registered agrochemical labels and local laws.
        </p>
      </div>
    </div>
  );
};

