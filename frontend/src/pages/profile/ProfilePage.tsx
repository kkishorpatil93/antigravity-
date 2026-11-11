import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { ProfileFormSchema } from '../../schemas';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { Save, CheckCircle } from 'lucide-react';

type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

const KARNATAKA_DISTRICTS = [
  'Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
  'Bidar', 'Chamarajanagara', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga',
  'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan',
  'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal',
  'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
  'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir', 'Other / Other State'
];

const SOIL_TYPES = [
  'Red Soil (ಕೆಂಪು ಮಣ್ಣು)',
  'Black Soil / Regur (ಕಪ್ಪು ಮಣ್ಣು)',
  'Alluvial Soil (ವಂಡಲು ಮಣ್ಣು)',
  'Laterite Soil (ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು)',
  'Sandy Loam (ಮರಳು ಮಿಶ್ರಿತ ಗೋಡು ಮಣ್ಣು)',
  'Clayey Soil (ಜೇಡಿ ಮಣ್ಣು)',
  'Mixed Soil (ಮಿಶ್ರ ಮಣ್ಣು)',
];

const IRRIGATION_TYPES = [
  'Drip Irrigation (ಹನಿ ನೀರಾವರಿ)',
  'Sprinkler Irrigation (ತುಂತುರು ನೀರಾವರಿ)',
  'Canal Water (ಕಾಲುವೆ ನೀರು)',
  'Borewell / Tube-well (ಬೋರ್‌ವೆಲ್ ನೀರು)',
  'Rainfed (ಮಳೆ ಆಶ್ರಿತ)',
  'Open Well / River Lift (ಬಾವಿ / ನದಿ ನೀರು)',
];

export const ProfilePage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const { t, setLanguage } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        state: profile.state || 'Karnataka',
        district: profile.district || 'Mandya',
        village: profile.village || '',
        preferred_language: profile.preferred_language || 'en',
        farming_experience_years: profile.farming_experience_years ?? 5,
        farm_area: profile.farm_area ?? 2,
        farm_area_unit: profile.farm_area_unit || 'acres',
        soil_type: profile.soil_type || SOIL_TYPES[0],
        irrigation_type: profile.irrigation_type || IRRIGATION_TYPES[0],
        farming_type: profile.farming_type || 'Mixed Crops',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setServerError(null);
    setSuccess(false);
    try {
      await api.profile.update(values);
      setSuccess(true);
      if (values.preferred_language) {
        setLanguage(values.preferred_language);
      }
      await refreshProfile();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setServerError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-agri-950">Farmer & Soil Profile</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Accurate land, location, and soil parameters ensure high-precision generative AI recommendations.
        </p>
      </div>

      {success && (
        <Alert type="success" title="Profile Updated">
          Your agricultural parameters and preferences have been successfully saved.
        </Alert>
      )}

      {serverError && (
        <Alert type="danger" title="Error">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card title="Personal & Contact Information" className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <Input
              label="Phone Number (Optional)"
              type="tel"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Select
              label="Preferred Language"
              options={[
                { value: 'en', label: 'English' },
                { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
              ]}
              error={errors.preferred_language?.message}
              {...register('preferred_language')}
            />
            <Input
              label="Farming Experience (Years)"
              type="number"
              min="0"
              max="70"
              error={errors.farming_experience_years?.message}
              {...register('farming_experience_years')}
            />
          </div>
        </Card>

        <Card title="Geographical Location & Farm Details" className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Input
              label="State"
              defaultValue="Karnataka"
              error={errors.state?.message}
              {...register('state')}
            />
            <Select
              label="District"
              options={KARNATAKA_DISTRICTS.map((d) => ({ value: d, label: d }))}
              error={errors.district?.message}
              {...register('district')}
            />
            <Input
              label="Village / Taluk / Locality (Optional)"
              error={errors.village?.message}
              {...register('village')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Total Farm Land Area"
                type="number"
                step="0.1"
                min="0.1"
                error={errors.farm_area?.message}
                {...register('farm_area')}
              />
              <Select
                label="Area Unit"
                options={[
                  { value: 'acres', label: 'Acres (ಎಕರೆ)' },
                  { value: 'guntas', label: 'Guntas (ಗುಂಟೆ)' },
                  { value: 'hectares', label: 'Hectares (ಹೆಕ್ಟೇರ್)' },
                ]}
                error={errors.farm_area_unit?.message}
                {...register('farm_area_unit')}
              />
            </div>
            <Input
              label="Farming Type / Primary Crop System"
              placeholder="e.g. Commercial Horticulture, Cereals, Mixed"
              error={errors.farming_type?.message}
              {...register('farming_type')}
            />
          </div>
        </Card>

        <Card title="Soil & Irrigation Infrastructure" className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Primary Topsoil Type"
              options={SOIL_TYPES.map((s) => ({ value: s, label: s }))}
              error={errors.soil_type?.message}
              {...register('soil_type')}
            />
            <Select
              label="Primary Irrigation Setup"
              options={IRRIGATION_TYPES.map((i) => ({ value: i, label: i }))}
              error={errors.irrigation_type?.message}
              {...register('irrigation_type')}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            icon={<Save className="w-5 h-5" />}
          >
            Save Profile & Farm Details
          </Button>
        </div>
      </form>
    </div>
  );
};

