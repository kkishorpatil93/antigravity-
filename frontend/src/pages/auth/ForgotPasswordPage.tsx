import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ForgotPasswordSchema } from '../../schemas';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

type FormValues = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setErrorMsg(null);
    setSuccessMsg(false);
    const { error } = await resetPassword(values.email);
    if (error) {
      setErrorMsg(error.message || 'Failed to send reset link');
      return;
    }
    setSuccessMsg(true);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-agri-700 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Sprout className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-agri-950">Password Recovery</h2>
        <p className="mt-1 text-xs text-gray-500">
          Enter your registered email to receive recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-earth-100 rounded-2xl sm:px-10">
          {successMsg ? (
            <Alert type="success">
              Password reset link has been dispatched to your email address. Check your inbox and spam folder.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && <Alert type="danger">{errorMsg}</Alert>}

              <Input
                label="Registered Email Address"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
                icon={<Mail className="w-4 h-4" />}
              >
                Send Recovery Link
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            Remembered your password?{' '}
            <Link to="/login" className="font-bold text-agri-700 hover:text-agri-900">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

