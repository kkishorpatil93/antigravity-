import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScanLine, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { DiseaseDetectionFormSchema } from '../../schemas';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { ImageUploader } from '../../components/common/ImageUploader';

type FormValues = z.infer<typeof DiseaseDetectionFormSchema>;

export const DiseaseDetectionPage: React.FC = () => {
  const { profile } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(DiseaseDetectionFormSchema),
    defaultValues: {
      cropName: '',
      symptoms: '',
      growthStage: 'Vegetative / Flowering',
      location: profile?.district ? `${profile.district}, Karnataka` : 'Karnataka, India',
      preferredLanguage: language,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setFileError(null);
    setSubmitError(null);

    if (!selectedFile) {
      setFileError('Please upload a clear photograph of the affected plant leaf or stem');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('cropName', values.cropName);
      formData.append('symptoms', values.symptoms || '');
      formData.append('growthStage', values.growthStage || '');
      formData.append('location', values.location || '');
      formData.append('preferredLanguage', language);

      const response = await api.advisory.diseaseDetection(formData);
      navigate(`/advisory/disease-detection/result/${response.advisory.id}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Plant pathology diagnosis failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
          <ScanLine className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-agri-950">
            {t.nav.diseaseDetection}
          </h1>
          <p className="text-xs text-gray-500">
            Multimodal AI diagnosis of crop diseases, insect pests, and nutrient chlorosis from leaf photos
          </p>
        </div>
      </div>

      {submitError && (
        <Alert type="danger" title="Diagnosis Error">
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Upload Affected Plant Photograph">
          <p className="text-xs text-gray-500 mb-4">
            Take a sharp, well-lit photo showing the affected leaf, stem lesion, discoloration, or pest colony.
          </p>
          <ImageUploader
            selectedFile={selectedFile}
            onFileSelect={(f) => {
              setSelectedFile(f);
              if (f) setFileError(null);
            }}
            error={fileError || undefined}
          />
        </Card>

        <Card title="Crop & Field Symptoms Observation">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label={t.forms.cropName}
              placeholder="e.g. Tomato, Paddy, Cotton, Chilli, Ragi"
              error={errors.cropName?.message}
              {...register('cropName')}
            />
            <Input
              label={t.forms.growthStage}
              placeholder="e.g. Seedling, Vegetative, Flowering, Fruiting"
              error={errors.growthStage?.message}
              {...register('growthStage')}
            />
          </div>

          <Textarea
            label={t.forms.symptoms}
            placeholder="Describe what you see: e.g. Yellow spots on lower leaves, brown curling margins, powdery white coating on underside..."
            rows={3}
            error={errors.symptoms?.message}
            {...register('symptoms')}
          />
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            {t.common.submit}
          </Button>
        </div>
      </form>
    </div>
  );
};

