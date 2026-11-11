import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LoginSchema } from '../../schemas';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

type LoginFormValues = z.infer<typeof LoginSchema>;

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      setAuthError(error.message || 'Invalid email or password');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-agri-700 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Sprout className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-agri-950">
          {t.auth.loginTitle}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-xs">
              <Link
                to="/forgot-password"
                className="text-agri-700 hover:text-agri-900 font-semibold"
              >
                {t.auth.forgotPassword}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              icon={<LogIn className="w-4 h-4" />}
            >
              {t.common.login}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            {t.auth.noAccount}{' '}
            <Link
              to="/register"
              className="font-bold text-agri-700 hover:text-agri-900"
            >
              {t.common.register}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

