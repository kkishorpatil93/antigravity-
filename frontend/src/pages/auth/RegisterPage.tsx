import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { RegisterSchema } from '../../schemas';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      preferredLanguage: 'en',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setAuthError(null);
    const { error } = await signUp(
      values.email,
      values.password,
      values.fullName,
      values.preferredLanguage
    );
    if (error) {
      setAuthError(error.message || 'Registration failed');
      return;
    }
    navigate('/profile');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-agri-700 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Sprout className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-agri-950">
          {t.auth.registerTitle}
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          {t.common.karnatakaFocus}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-earth-100 rounded-2xl sm:px-10">
          {authError && (
            <Alert type="danger" className="mb-6">
              {authError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t.auth.fullNameLabel}
              type="text"
              autoComplete="name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label={t.auth.emailLabel}
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label={t.auth.passwordLabel}
              type="password"
              autoComplete="new-password"
              helperText="Must be at least 6 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <Select
              label={t.auth.preferredLangLabel}
              options={[
                { value: 'en', label: 'English' },
                { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
              ]}
              error={errors.preferredLanguage?.message}
              {...register('preferredLanguage')}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isSubmitting}
              icon={<UserPlus className="w-4 h-4" />}
            >
              {t.common.register}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            {t.auth.haveAccount}{' '}
            <Link
              to="/login"
              className="font-bold text-agri-700 hover:text-agri-900"
            >
              {t.common.login}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

