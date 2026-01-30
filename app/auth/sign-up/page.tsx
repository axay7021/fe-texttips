'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import type { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import { SignUpSchema } from '@/lib/zod';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleSignUp = async (values: z.infer<typeof SignUpSchema>) => {
    setLoading(true);
    setError(null);

    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  };

  const handleSignUpWithGoogle = async () => {
    setLoading(true);
    setError(null);
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
      errorCallbackURL: '/auth/sign-in', // Redirect to sign-in on error usually
    });
  };

  const handleSignUpWithGithub = async () => {
    setLoading(true);
    setError(null);
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/',
      errorCallbackURL: '/auth/sign-in',
    });
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
            Sign up
          </h1>
          <p className='text-[#666] text-[15px] font-medium'>
            Sign in or create an account.
          </p>
        </div>

        <div className='space-y-4'>
          <form className='space-y-5' onSubmit={handleSubmit(handleSignUp)}>
            {error && (
              <div className='rounded-lg bg-red-50 p-3 text-sm text-red-500 text-center border border-red-100'>
                {error}
              </div>
            )}
            <div className='space-y-1.5'>
              <label
                className='block text-sm font-medium text-gray-700 ml-1'
                htmlFor='name'
              >
                Name
              </label>
              <input
                id='name'
                {...register('name')}
                type='text'
                placeholder='John Doe'
                className='w-full h-[46px] rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-[#3a82f6]/20 focus:border-[#3a82f6] outline-none transition-all text-gray-800 placeholder:text-gray-400'
              />
              {errors.name && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='space-y-1.5'>
              <label
                className='block text-sm font-medium text-gray-700 ml-1'
                htmlFor='email'
              >
                Email
              </label>
              <input
                id='email'
                {...register('email')}
                type='email'
                placeholder='name@work-email.com'
                className='w-full h-[46px] rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-[#3a82f6]/20 focus:border-[#3a82f6] outline-none transition-all text-gray-800 placeholder:text-gray-400'
              />
              {errors.email && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-1.5'>
              <label
                className='block text-sm font-medium text-gray-700 ml-1'
                htmlFor='password'
              >
                Password
              </label>
              <div className='relative'>
                <input
                  id='password'
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Min. 8 characters'
                  className='w-full h-[46px] rounded-lg border border-gray-300 px-4 pr-12 focus:ring-2 focus:ring-[#3a82f6]/20 focus:border-[#3a82f6] outline-none transition-all text-gray-800 placeholder:text-gray-400'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full h-[46px] rounded-lg bg-[#3a82f6] text-white font-bold text-[15px] hover:bg-[#3272d9] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200'
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className='relative flex items-center py-2'>
            <div className='flex-grow border-t border-gray-200'></div>
            <span className='flex-shrink-0 mx-4 text-gray-400 text-sm'>or</span>
            <div className='flex-grow border-t border-gray-200'></div>
          </div>

          <div className='grid gap-4'>
            {/* Google Button */}
            <button
              type='button'
              onClick={handleSignUpWithGoogle}
              disabled={loading}
              className='w-full h-[46px] rounded-lg border border-gray-300 bg-white flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed group'
            >
              <FcGoogle className='w-5 h-5' />
              <span className='text-[#444] font-medium text-[15px]'>
                Google
              </span>
            </button>

            {/* GitHub Button */}
            <button
              type='button'
              onClick={handleSignUpWithGithub}
              disabled={loading}
              className='w-full h-[46px] rounded-lg border border-gray-300 bg-white flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed group'
            >
              <FaGithub className='w-5 h-5 text-gray-800' />
              <span className='text-[#444] font-medium text-[15px]'>
                GitHub
              </span>
            </button>
          </div>
        </div>

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
