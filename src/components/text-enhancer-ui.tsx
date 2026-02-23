'use client';

import { useCompletion } from '@ai-sdk/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoSparkles } from 'react-icons/io5';
import { toast } from 'sonner';
import { EnhancerResults } from '@/components/enhancer/enhancer-results';
import type { EnhancedVersion } from '@/components/enhancer/types';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { parseEnhancementResult } from '@/utils/text-enhancer';

export function TextEnhancerUI() {
  const [text, setText] = useState('');
  const [parsedVersions, setParsedVersions] = useState<EnhancedVersion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const hasSwitchedRef = useRef(false);

  /* Limit for guests */
  const maxLength = 100;
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch Usage Limit
  const {
    data: usageData,
    refetch: refetchUsage,
    isPending,
  } = useQuery({
    queryKey: ['user-limit-hero'],
    queryFn: async () => {
      const res = await axios.get('/api/user/limit');
      return res.data;
    },
    // Don't refetch on window focus to avoid jumping numbers if not needed often
    refetchOnWindowFocus: false,
  });

  const credits = usageData ? usageData.remaining : 3;
  const isPro = usageData?.type === 'subscription';

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/enhance',
    onError: (error) => {
      // biome-ignore lint/suspicious/noConsole: Log error for debugging
      console.error('Enhancement error:', error);
      const errorStr = error?.message || '';

      if (
        errorStr.toLowerCase().includes('quota') ||
        errorStr.toLowerCase().includes('rate limit') ||
        errorStr.toLowerCase().includes('429')
      ) {
        toast.error(
          'AI provider generation limits reached. Please try again later.',
        );
      } else {
        toast.error(
          'An error occurred while enhancing your text. Please try again.',
        );
      }
    },
    onFinish: () => {
      // Refetch usage after completion to update count
      refetchUsage();
    },
  });

  // Real-time parsing of the stream
  useEffect(() => {
    if (completion) {
      setParsedVersions(parseEnhancementResult(completion));
      if (!showResults && completion.length > 0 && !hasSwitchedRef.current) {
        setShowResults(true);
        hasSwitchedRef.current = true;
      }
    } else {
      setParsedVersions([]);
    }
  }, [completion, showResults]);

  const handleRewrite = useCallback(() => {
    if (!text.trim()) return;

    // Backend will enforce limit, but client-side check prevents call
    if (credits <= 0 && !isPro) return;

    // setText is already updating state
    // No need to manually decrement credits, backend handles it and we refetch
    // setShowResults(true); // Moved to useEffect
    setParsedVersions([]);
    hasSwitchedRef.current = false;
    complete(text);
  }, [text, credits, isPro, complete]);

  const handleReset = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setText('');
    setShowResults(false);
    setParsedVersions([]);
  };

  const copyToClipboard = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: Log error
      console.error('Failed to copy', err);
    }
  };

  const isOutOfCredits = credits <= 0 && !isPro;

  if (isPending) {
    return (
      <div className='w-full max-w-xl mx-auto relative z-20 flex flex-col gap-6 animate-pulse'>
        <div className='bg-white rounded-3xl shadow-[0_16px_16px_-8px_#CCE5FF] border border-[#D9ECFF] p-5 flex flex-col relative h-[142px]'>
          <div className='w-full h-10 bg-gray-50 rounded-xl mb-auto'></div>
          <div className='flex items-center justify-between mt-4'>
            <div className='w-12 h-4 bg-gray-100 rounded text-[16px]'></div>
            <div className='bg-gray-100 rounded-full w-[100px] h-[46px]'></div>
          </div>
        </div>
        <div className='text-center mt-2'>
          <div className='h-4 bg-gray-100 rounded w-64 mx-auto'></div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div
        ref={containerRef}
        className='w-full max-w-xl mx-auto relative z-20 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700'
      >
        <div className='bg-white rounded-3xl shadow-[0_8px_16px_-8px_#CCE5FF] border border-[#D9ECFF] p-5 flex flex-col relative'>
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>
            Original Text
          </p>
          <p className='text-[16px] text-gray-800 font-normal whitespace-pre-wrap leading-relaxed'>
            {text}
          </p>
        </div>

        <EnhancerResults
          parsedVersions={parsedVersions}
          isLoading={isLoading}
          copiedIndex={copiedIndex}
          copyToClipboard={copyToClipboard}
          replaceText={setText}
          completion={completion}
        />

        <div className='flex flex-col items-center gap-3 mt-4'>
          {!isOutOfCredits ? (
            <Button
              onClick={handleReset}
              className='bg-white hover:bg-gray-50 text-brand-blue border border-brand-blue/20 rounded-full px-8 h-12 text-base font-medium shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2'
            >
              <IoSparkles className='w-4 h-4' />
              Enhance New Content
            </Button>
          ) : (
            <Link href='/auth/sign-in'>
              <Button className='bg-brand-blue hover:bg-blue-600 text-white rounded-full px-8 h-12 text-base font-medium shadow-lg shadow-blue-200/50 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2'>
                <IoSparkles className='w-4 h-4' />
                Login to Enhance More
              </Button>
            </Link>
          )}

          <div className='flex flex-col items-center gap-1 mb-6'>
            <p className='text-gray-400 text-sm font-medium'>
              {isPro ? 'Unlimited' : credits}{' '}
              {isPro ? 'access' : 'free rewrites remaining'}
            </p>
            {!isPro && !isOutOfCredits && (
              <Link
                href='/auth/sign-in'
                className='text-brand-blue text-sm hover:underline font-medium'
              >
                Log in for unlimited access
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isOutOfCredits) {
    return (
      <div
        ref={containerRef}
        className='w-full max-w-xl mx-auto relative z-20 flex flex-col gap-6 mb-10'
      >
        <div className='bg-white rounded-3xl shadow-[0_16px_16px_-8px_#CCE5FF] border border-[#D9ECFF] p-8 flex flex-col items-center justify-center text-center gap-5 transition-all'>
          <div className='w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue mb-1'>
            <IoSparkles className='w-8 h-8' />
          </div>

          <div className='space-y-2 max-w-sm'>
            <h3 className='text-2xl font-bold text-gray-900'>
              Free Limit Reached
            </h3>
            <p className='text-gray-500 text-base leading-relaxed'>
              You've used your free enhancements. Log in now to unlock unlimited
              access and take your writing to the next level.
            </p>
          </div>

          <div className='flex flex-col gap-3 w-full max-w-xs mt-2'>
            <Link href='/auth/sign-in' className='w-full'>
              <Button className='w-full bg-brand-blue hover:bg-blue-600 text-white rounded-full h-12 text-base font-medium shadow-lg shadow-blue-200/50 transition-all hover:-translate-y-0.5'>
                Log In for Unlimited Access
              </Button>
            </Link>
            <div className='text-center mt-2'>
              <p className='text-gray-500 text-sm font-medium opacity-80'>
                ✨ Join thousands of users enhancing their writing daily.
              </p>
            </div>
            {/* Development only */}
            {process.env.NODE_ENV === 'development' && (
              <Button
                size='sm'
                variant='destructive'
                onClick={async () => {
                  await axios.post('/api/test/reset-limit');
                  refetchUsage();
                }}
                className='mt-2'
              >
                Reset Limit (Dev Test)
              </Button>
            )}
            {/* Development only */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className='w-full max-w-xl mx-auto relative z-20 flex flex-col gap-6'
    >
      <div className='bg-white rounded-3xl shadow-[0_16px_16px_-8px_#CCE5FF] border border-[#D9ECFF] p-5 flex flex-col relative transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)]'>
        <textarea
          value={text}
          rows={2}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isLoading && text.trim() && !isOutOfCredits) {
                handleRewrite();
              }
            }
          }}
          placeholder='I trust this message finds you well. How are you?'
          maxLength={maxLength}
          className='w-full flex-1 resize-none border-none outline-none text-[16px] text-[#000000] placeholder:text-gray-400 bg-transparent font-normal'
          spellCheck={false}
        />

        <div className='flex items-center justify-between mt-1'>
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <span className='text-gray-400 text-[16px] font-medium'>
                {text.length}/{maxLength}
              </span>
            </div>
            {isOutOfCredits && (
              <span className='text-red-500 text-sm font-medium hidden md:inline-block'>
                Out of free credits
              </span>
            )}
          </div>
          <Button
            onClick={handleRewrite}
            disabled={isLoading || !text.trim() || isOutOfCredits}
            className={`bg-brand-blue hover:bg-blue-600 text-white rounded-full w-[46px] h-[46px] p-0 md:w-auto md:py-6 md:px-[20px]! font-medium shadow-lg shadow-blue-200/50 transition-all hover:shadow-blue-300/50 hover:-translate-y-0.5 text-base md:text-[20px] cursor-pointer flex items-center justify-center ${
              isOutOfCredits ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className='animate-spin md:mr-1'>⏳</span>
            ) : (
              <IoSparkles className='w-5 h-5 md:mr-1 md:w-5 md:h-5' />
            )}
            <span className='hidden md:block'>
              {isLoading ? 'Rewriting...' : 'Rewrite'}
            </span>
          </Button>
        </div>
      </div>

      <div className='text-center mt-2'>
        {text.length >= maxLength * 0.8 && !isPro && (
          <Link
            href='/auth/sign-in'
            className='text-sm text-brand-blue hover:underline font-medium block mb-2'
          >
            Log in to write more
          </Link>
        )}
        <p className='text-gray-500 text-sm font-medium opacity-80'>
          ✨ You have{' '}
          <span
            className={`font-bold ${
              credits > 0 ? 'text-brand-blue' : 'text-red-500'
            }`}
          >
            {isPro ? 'Unlimited' : credits} {isPro ? 'access' : 'free rewrites'}
          </span>{' '}
          {isPro ? 'enabled' : 'remaining'}.{' '}
          {!isPro && 'No credit card required.'}
        </p>
      </div>
    </div>
  );
}
