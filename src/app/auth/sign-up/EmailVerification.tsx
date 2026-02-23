'use client';

import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import BetterAuthActionButton from '@/components/auth/BetterAuthActionButton';
import { useAuth } from '@/hooks/use-auth';

export function EmailVerification() {
  const { sendVerificationEmail } = useAuth();

  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    startEmailVerificationCountdown();
  }, []);

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time);

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  }

  return (
    <div
      className='min-h-screen flex items-center justify-center relative overflow-hidden px-4'
      style={{
        background:
          'linear-gradient(180deg, rgba(58, 130, 246, 0.08) 0%, rgba(255, 255, 255, 1) 100%)',
      }}
    >
      <div className='w-full max-w-[440px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 relative z-10 border border-gray-100 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-blue-50 text-[#3a82f6] rounded-full flex items-center justify-center mb-6'>
          <Mail className='w-8 h-8' />
        </div>

        <h1 className='text-[28px] font-bold text-[#333] mb-3 tracking-tight'>
          Check your email
        </h1>

        <p className='text-[#666] text-[15px] font-medium leading-relaxed mb-8'>
          We sent a verification link to your email address. Please click the
          link to verify your account and continue.
        </p>

        <BetterAuthActionButton
          variant='outline'
          className='w-full h-[46px] rounded-lg border-2 border-gray-200 hover:border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
          successMessage='Verification email sent!'
          disabled={timeToNextResend > 0}
          action={() => {
            startEmailVerificationCountdown();
            return sendVerificationEmail();
          }}
        >
          {timeToNextResend > 0
            ? `Resend Email in ${timeToNextResend}s`
            : 'Resend Email'}
        </BetterAuthActionButton>

        <p className='mt-8 text-center text-[14px] text-gray-500'>
          Back to{' '}
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
