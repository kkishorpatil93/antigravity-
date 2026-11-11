import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { CropRecommendationFormSchema } from '../../schemas';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

type FormValues = z.infer<typeof CropRecommendationFormSchema>;

export const CropRecommendationPage: React.FC = () => {
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
    resolver: zodResolver(CropRecommendationFormSchema),
    defaultValues: {
      state: 'Karnataka',
      district: 'Mandya',
      season: 'Kharif',
      soilType: 'Red Soil (ಕೆಂಪು ಮಣ್ಣು)',
      farmArea: 2,
      areaUnit: 'acres',
      waterAvailability: 'Good (Borewell / Canal source)',
      farmingObjective: 'Maximize commercial yield and market profitability',
      preferredLanguage: language,
    },
  });

  useEffect(() => {
    if (profile) {
      if (profile.state) setValue('state', profile.state);
      if (profile.district) setValue('district', profile.district);
      if (profile.soil_type) setValue('soilType', profile.soil_type);
      if (profile.farm_area) setValue('farmArea', Number(profile.farm_area));
      if (profile.farm_area_unit) setValue('areaUnit', profile.farm_area_unit);
      if (profile.irrigation_type) setValue('irrigationMethod', profile.irrigation_type);
    }
  }, [profile, setValue]);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      const response = await api.advisory.cropRecommendation({
        ...values,
        preferredLanguage: language,
      });
      navigate(`/advisory/crop-recommendation/result/${response.id}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to generate recommendations');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <Sprout className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-agri-950">
            {t.nav.cropRecommendation}
          </h1>
          <p className="text-xs text-gray-500">
            AI-driven agro-climatic crop matching based on soil chemistry, season, and water availability
          </p>
        </div>
      </div>

      {submitError && (
        <Alert type="danger" title="Inference Error">
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Seasonal & Location Parameters">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={t.forms.state}
              error={errors.state?.message}
              {...register('state')}
            />
            <Input
              label={t.forms.district}
              error={errors.district?.message}
              {...register('district')}
            />
            <Select
              label={t.forms.season}
              options={[
                { value: 'Kharif', label: 'Kharif (Monsoon: June - Oct)' },
                { value: 'Rabi', label: 'Rabi (Winter: Oct - March)' },
                { value: 'Zaid', label: 'Zaid (Summer: March - June)' },
                { value: 'Year-round', label: 'Year-round Cultivation' },
              ]}
              error={errors.season?.message}
              {...register('season')}
            />
          </div>
        </Card>

        <Card title="Soil & Land Measurements">
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
              placeholder="e.g. 6.5"
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

        <Card title="Water Setup & Strategic Goals">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label={t.forms.waterAvailability}
              placeholder="e.g. High (Borewell available 6 hrs/day) or Rainfed"
              error={errors.waterAvailability?.message}
              {...register('waterAvailability')}
            />
            <Input
              label={t.forms.irrigationMethod}
              placeholder="e.g. Drip, Sprinkler, Furrow, Rainfed"
              error={errors.irrigationMethod?.message}
              {...register('irrigationMethod')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t.forms.previousCrop}
              placeholder="e.g. Paddy, Sugarcane, Maize, Fallow"
              error={errors.previousCrop?.message}
              {...register('previousCrop')}
            />
            <Input
              label={t.forms.objective}
              placeholder="e.g. Maximum Profit, Low Water Consumption, Organic"
              error={errors.farmingObjective?.message}
              {...register('farmingObjective')}
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

