'use client';

import { useCompletion } from '@ai-sdk/react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoSparkles } from 'react-icons/io5';
import { EnhancerResults } from '@/components/enhancer/enhancer-results';
import type { EnhancedVersion } from '@/components/enhancer/types';
import { Button } from '@/components/ui/button';
import { parseEnhancementResult } from '@/utils/text-enhancer';

export function TextEnhancerUI() {
  const [text, setText] = useState('');
  const [credits, setCredits] = useState<number>(3);
  const [parsedVersions, setParsedVersions] = useState<EnhancedVersion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const hasSwitchedRef = useRef(false);

  /* Limit for guests */
  const maxLength = 50;
  const containerRef = useRef<HTMLDivElement>(null);

  // Load credits from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCredits = localStorage.getItem('text-enhancer-credits');
      if (savedCredits !== null) {
        setCredits(parseInt(savedCredits, 10));
      } else {
        localStorage.setItem('text-enhancer-credits', '3');
        setCredits(3);
      }
    }
  }, []);

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/enhance',
    onError: (error) => {
      // biome-ignore lint/suspicious/noConsole: Log error for debugging
      console.error('Enhancement error:', error);
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
    if (!text.trim() || credits <= 0) return;

    // Decrement credits
    const newCredits = credits - 1;
    setCredits(newCredits);
    if (typeof window !== 'undefined') {
      localStorage.setItem('text-enhancer-credits', newCredits.toString());
    }

    // setShowResults(true); // Moved to useEffect
    setParsedVersions([]);
    hasSwitchedRef.current = false;
    complete(text);
  }, [text, credits, complete]);

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

  const isOutOfCredits = credits <= 0;

  if (showResults) {
    return (
      <div
        ref={containerRef}
        className='w-full max-w-xl mx-auto relative z-20 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700'
      >
        <EnhancerResults
          parsedVersions={parsedVersions}
          isLoading={isLoading}
          copiedIndex={copiedIndex}
          copyToClipboard={copyToClipboard}
          replaceText={setText}
          completion={completion}
        />

        <div className='flex flex-col items-center gap-3 mt-4'>
          <Button
            onClick={handleReset}
            className='bg-white hover:bg-gray-50 text-brand-blue border border-brand-blue/20 rounded-full px-8 h-12 text-base font-medium shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2'
          >
            <IoSparkles className='w-4 h-4' />
            Enhance New Content
          </Button>
          <div className='flex flex-col items-center gap-1'>
            <p className='text-gray-400 text-sm font-medium'>
              {credits} free rewrites remaining
            </p>
            <Link
              href='/auth/sign-in'
              className='text-brand-blue text-sm hover:underline font-medium'
            >
              Log in for unlimited access
            </Link>
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
          rows={4}
          onChange={(e) => setText(e.target.value)}
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
        {text.length >= maxLength * 0.8 && (
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
            {credits} free rewrites
          </span>{' '}
          remaining. No credit card required.
        </p>
      </div>
    </div>
  );
}
