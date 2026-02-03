'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { z } from 'zod';
import { authClient } from '@/lib/auth/auth-client';
import type {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from '@/lib/zod';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [verifyEmail, setVerifyEmail] = useState('');
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);

  const signUp = async (values: z.infer<typeof SignUpSchema>) => {
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
          setVerifyEmail(values.email);
          setShowVerifyEmail(true);
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  };

  const signIn = async (values: z.infer<typeof SignInSchema>) => {
    setLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  };

  const forgotPassword = async (
    values: z.infer<typeof ForgotPasswordSchema>,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authClient.requestPasswordReset(
        {
          email: values.email,
          redirectTo: '/auth/reset-password',
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: (success: any) => {
            setSuccess(
              success.data.message ||
                'Reset password link has been sent to your email.',
            );
            setLoading(false);
          },
          onError: (ctx: any) => {
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

  const resetPassword = async (
    values: z.infer<typeof ResetPasswordSchema>,
    token: string,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authClient.resetPassword(
        {
          newPassword: values.password,
          token: token,
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

  const signInWithSocial = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);
    await authClient.signIn.social({
      provider,
      callbackURL: '/',
      errorCallbackURL: '/auth/sign-in',
    });
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/sign-in');
          router.refresh();
        },
      },
    });
    setLoading(false);
  };

  const sendVerificationEmail = async () => {
    return authClient.sendVerificationEmail({
      email: verifyEmail,
      callbackURL: '/',
    });
  };

  return {
    loading,
    error,
    success,
    setLoading,
    setError,
    setSuccess,
    signUp,
    signIn,
    forgotPassword,
    resetPassword,
    signInWithSocial,
    handleLogout,
    verifyEmail,
    showVerifyEmail,
    sendVerificationEmail,
  };
};
