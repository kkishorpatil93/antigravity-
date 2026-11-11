import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, KeyRound } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { ResetPasswordSchema } from '../../schemas';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

type FormValues = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setErrorMsg(null);
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setErrorMsg(error.message || 'Failed to update password');
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
        <h2 className="text-2xl font-bold text-agri-950">Set New Password</h2>
        <p className="mt-1 text-xs text-gray-500">
          Enter your new secure password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-earth-100 rounded-2xl sm:px-10">
          {errorMsg && (
            <Alert type="danger" className="mb-5">
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isSubmitting}
              icon={<KeyRound className="w-4 h-4" />}
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

