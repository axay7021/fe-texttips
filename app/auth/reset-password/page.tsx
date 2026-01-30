'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import { ResetPasswordSchema } from '@/lib/zod';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/auth/forgot-password');
    }
  }, [token, router]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  if (!token) {
    return null; // Don't render anything while redirecting
  }

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authClient.resetPassword(
        {
          newPassword: values.password,
          token: token as string,
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setSuccess('Your password has been reset successfully.');
            setLoading(false);
            setTimeout(() => {
              router.push('/auth/sign-in');
            }, 2000);
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
          },
        },
      );
    } catch (_err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center relative overflow-hidden px-4'
      style={{
        background:
          'linear-gradient(180deg, rgba(58, 130, 246, 0.08) 0%, rgba(255, 255, 255, 1) 100%)',
      }}
    >
      <div className='w-full max-w-[440px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 relative z-10 border border-gray-100'>
        <div className='text-center mb-8'>
          <h1 className='text-[32px] font-bold text-[#333] mb-2 tracking-tight'>
            Reset Password
          </h1>
          <p className='text-[#666] text-[15px] font-medium'>
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          {error && (
            <div className='rounded-lg bg-red-50 p-3 text-sm text-red-500 text-center border border-red-100'>
              {error}
            </div>
          )}
          {success && (
            <div className='rounded-lg bg-green-50 p-3 text-sm text-green-600 text-center border border-green-100'>
              {success}
            </div>
          )}

          <div className='space-y-1.5'>
            <label
              className='block text-sm font-medium text-gray-700 ml-1'
              htmlFor='password'
            >
              New Password
            </label>
            <input
              id='password'
              {...register('password')}
              disabled={loading}
              type='password'
              placeholder='••••••••'
              className='w-full h-[46px] rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-[#3a82f6]/20 focus:border-[#3a82f6] outline-none transition-all text-gray-800 placeholder:text-gray-400 disabled:bg-gray-50'
            />
            {errors.password && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <label
              className='block text-sm font-medium text-gray-700 ml-1'
              htmlFor='confirmPassword'
            >
              Confirm New Password
            </label>
            <input
              id='confirmPassword'
              {...register('confirmPassword')}
              disabled={loading}
              type='password'
              placeholder='••••••••'
              className='w-full h-[46px] rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-[#3a82f6]/20 focus:border-[#3a82f6] outline-none transition-all text-gray-800 placeholder:text-gray-400 disabled:bg-gray-50'
            />
            {errors.confirmPassword && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full h-[46px] rounded-lg bg-[#3a82f6] text-white font-bold text-[15px] hover:bg-[#3272d9] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className='mt-8 text-center text-[14px] text-gray-500'>
          Already have an account?{' '}
          <Link
            href='/auth/sign-in'
            className='font-semibold text-[#3a82f6] hover:text-[#3272d9] transition-colors'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
