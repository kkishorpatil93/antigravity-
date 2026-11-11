import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FlaskConical, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { FertilizerFormSchema } from '../../schemas';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

type FormValues = z.infer<typeof FertilizerFormSchema>;

export const FertilizerPage: React.FC = () => {
  const { profile } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FertilizerFormSchema),
    defaultValues: {
      crop: '',
      growthStage: 'Vegetative (30-45 DAS)',
      soilType: 'Red Soil (ಕೆಂಪು ಮಣ್ಣು)',
      farmArea: 2,
      areaUnit: 'acres',
      location: profile?.district ? `${profile.district}, Karnataka` : 'Karnataka, India',
      preferredLanguage: language,
    },
  });

  useEffect(() => {
    if (profile) {
      if (profile.soil_type) setValue('soilType', profile.soil_type);
      if (profile.farm_area) setValue('farmArea', Number(profile.farm_area));
      if (profile.farm_area_unit) setValue('areaUnit', profile.farm_area_unit);
    }
  }, [profile, setValue]);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      const response = await api.advisory.fertilizer({
        ...values,
        preferredLanguage: language,
      });
      navigate(`/advisory/fertilizer/result/${response.id}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to calculate fertilizer guidance');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
          <FlaskConical className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-agri-950">
            {t.nav.fertilizer}
          </h1>
          <p className="text-xs text-gray-500">
            Stage-wise split nutrient recommendations, NPK balancing, and organic manure alternatives
          </p>
        </div>
      </div>

      {submitError && (
        <Alert type="danger" title="Calculation Error">
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Crop & Growth Stage">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t.forms.cropName}
              placeholder="e.g. Tomato, Paddy, Maize, Sugarcane"
              error={errors.crop?.message}
              {...register('crop')}
            />
            <Select
              label={t.forms.growthStage}
              options={[
                { value: 'Basal / Pre-Sowing', label: 'Basal / Pre-Sowing (ಬಿತ್ತನೆ ಪೂರ್ವ)' },
                { value: 'Early Vegetative (15-30 DAS)', label: 'Early Vegetative (15-30 DAS)' },
                { value: 'Vegetative / Tillering (30-50 DAS)', label: 'Vegetative / Tillering (30-50 DAS)' },
                { value: 'Flowering & Panicle Initiation', label: 'Flowering & Panicle Initiation (ಹೂವಾಡುವ ಹಂತ)' },
                { value: 'Grain Fill / Fruit Development', label: 'Grain Fill / Fruit Development (ಕಾಯಿ ಕಟ್ಟುವ ಹಂತ)' },
                { value: 'Maturity / Pre-Harvest', label: 'Maturity / Pre-Harvest (ಕೊಯ್ಲಿನ ಹಂತ)' },
              ]}
              error={errors.growthStage?.message}
              {...register('growthStage')}
            />
          </div>
        </Card>

        <Card title="Soil Parameters & Field Area">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={t.forms.soilType}
              error={errors.soilType?.message}
              {...register('soilType')}
            />
            <Input
              label={t.forms.soilPh}
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="e.g. 6.8"
              error={errors.soilPh?.message}
              {...register('soilPh')}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label={t.forms.farmArea}
                type="number"
                step="0.1"
                min="0.1"
                error={errors.farmArea?.message}
                {...register('farmArea')}
              />
              <Select
                label={t.forms.areaUnit}
                options={[
                  { value: 'acres', label: 'Acres' },
                  { value: 'guntas', label: 'Guntas' },
                  { value: 'hectares', label: 'Hectares' },
                ]}
                error={errors.areaUnit?.message}
                {...register('areaUnit')}
              />
            </div>
          </div>
        </Card>

        <Card title="Nutrient Observations & Current Practices (Optional)">
          <div className="space-y-4">
            <Input
              label={t.forms.existingFertilizer}
              placeholder="e.g. 1 bag Urea and 50kg DAP applied at sowing"
              error={errors.existingFertilizer?.message}
              {...register('existingFertilizer')}
            />
            <Textarea
              label="Nutrient Deficiency Symptoms Observed"
              placeholder="e.g. Pale yellow lower leaves, stunted plant height, purplish stems..."
              rows={2}
              error={errors.symptoms?.message}
              {...register('symptoms')}
            />
            <Input
              label={t.forms.soilTestData}
              placeholder="e.g. Soil test card values: N low, P medium, K high"
              error={errors.soilTestData?.message}
              {...register('soilTestData')}
            />
          </div>
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

