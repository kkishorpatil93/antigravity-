import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Droplets, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { IrrigationFormSchema } from '../../schemas';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

type FormValues = z.infer<typeof IrrigationFormSchema>;

export const IrrigationPage: React.FC = () => {
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
    resolver: zodResolver(IrrigationFormSchema),
    defaultValues: {
      crop: '',
      growthStage: 'Vegetative Phase',
      soilType: 'Red Soil (ಕೆಂಪು ಮಣ್ಣು)',
      farmArea: 2,
      areaUnit: 'acres',
      irrigationMethod: 'Drip Irrigation (ಹನಿ ನೀರಾವರಿ)',
      waterAvailability: 'Medium (Borewell available 4-5 hours daily)',
      recentRainfall: 'No rain in last 7 days',
      soilMoisture: 'Top 2 inches dry, lower soil slightly moist',
      location: profile?.district ? `${profile.district}, Karnataka` : 'Karnataka, India',
      preferredLanguage: language,
    },
  });

  useEffect(() => {
    if (profile) {
      if (profile.soil_type) setValue('soilType', profile.soil_type);
      if (profile.farm_area) setValue('farmArea', Number(profile.farm_area));
      if (profile.farm_area_unit) setValue('areaUnit', profile.farm_area_unit);
      if (profile.irrigation_type) setValue('irrigationMethod', profile.irrigation_type);
    }
  }, [profile, setValue]);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      const response = await api.advisory.irrigation({
        ...values,
        preferredLanguage: language,
      });
      navigate(`/advisory/irrigation/result/${response.id}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to generate irrigation plan');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
          <Droplets className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-agri-950">
            {t.nav.irrigation}
          </h1>
          <p className="text-xs text-gray-500">
            Weather-adaptive watering intervals, critical moisture growth stages, and water conservation guidance
          </p>
        </div>
      </div>

      {submitError && (
        <Alert type="danger" title="Planner Error">
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Crop & Plot Dimensions">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label={t.forms.cropName}
              placeholder="e.g. Paddy, Cotton, Tomato, Groundnut"
              error={errors.crop?.message}
              {...register('crop')}
            />
            <Select
              label={t.forms.growthStage}
              options={[
                { value: 'Germination & Emergence', label: 'Germination & Emergence (ಮೊಳಕೆ ಹಂತ)' },
                { value: 'Early Vegetative / Tillering', label: 'Early Vegetative / Tillering (ಬೆಳವಣಿಗೆ ಹಂತ)' },
                { value: 'Flowering / Tasseling', label: 'Flowering / Tasseling (ಹೂವಾಡುವ ಹಂತ)' },
                { value: 'Pod / Grain / Fruit Fill', label: 'Pod / Grain / Fruit Fill (ಕಾಯಿ ಕಟ್ಟುವ ಹಂತ)' },
                { value: 'Maturity / Ripening', label: 'Maturity / Ripening (ಪಕ್ವತೆಯ ಹಂತ)' },
              ]}
              error={errors.growthStage?.message}
              {...register('growthStage')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={t.forms.soilType}
              error={errors.soilType?.message}
              {...register('soilType')}
            />
            <div className="grid grid-cols-2 gap-2 sm:col-span-2">
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

        <Card title="Water Availability & Field Conditions">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label={t.forms.irrigationMethod}
              placeholder="e.g. Drip Irrigation, Sprinkler, Ridge & Furrow, Flood"
              error={errors.irrigationMethod?.message}
              {...register('irrigationMethod')}
            />
            <Input
              label={t.forms.waterAvailability}
              placeholder="e.g. 4 hrs borewell daily, Canal on 10-day rotation, Rainfed"
              error={errors.waterAvailability?.message}
              {...register('waterAvailability')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t.forms.recentRainfall}
              placeholder="e.g. Moderate rainfall 2 days ago, or None"
              error={errors.recentRainfall?.message}
              {...register('recentRainfall')}
            />
            <Input
              label={t.forms.soilMoisture}
              placeholder="e.g. Dry crust on top, Moist at root zone"
              error={errors.soilMoisture?.message}
              {...register('soilMoisture')}
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

