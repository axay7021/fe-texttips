'use client';

import { Infinity as InfinityIcon, Loader2, X, Zap } from 'lucide-react';
import { IoSparkles } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancerInputProps {
  text: string;
  setText: (text: string) => void;
  handleRewrite: () => void;
  isLoading: boolean;
  isPro: boolean;
  usageCount: number;
  showTip: boolean;
  setShowTip: (show: boolean) => void;
  maxLength: number;
  maxUsage: number;
  hasResults?: boolean;
  handleReset?: () => void;
}

export function EnhancerInput({
  text,
  setText,
  handleRewrite,
  isLoading,
  isPro,
  usageCount,
  showTip,
  setShowTip,
  maxLength,
  maxUsage,
  hasResults,
  handleReset,
}: EnhancerInputProps) {
  return (
    <div className='bg-white rounded-[24px] shadow-[0_16px_16px_-8px_#CCE5FF] border border-gray-100 p-6 md:p-8 flex flex-col relative min-h-[400px]'>
      {/* Info Banner - Only for Free Users */}
      {showTip && !isPro && (
        <div className='mb-4 flex items-start md:items-center justify-between bg-[#F8FAFC] border border-gray-100 px-4 py-3 rounded-xl text-sm text-gray-600 animate-in fade-in slide-in-from-top-1 duration-300'>
          <div className='flex items-center gap-2'>
            <span className='text-xl'>✨</span>
            <span>
              You get{' '}
              <span className='font-semibold text-[#333]'>
                {usageCount} free rewrites
              </span>
              . No credit card required.
            </span>
          </div>
          <button
            type='button'
            onClick={() => setShowTip(false)}
            className='text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg ml-2'
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Add your text here to enhance it...'
        maxLength={maxLength}
        className='w-full flex-1 resize-none border border-transparent focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50/50 outline-none text-[18px] text-[#1a1a1a] placeholder:text-gray-400 bg-gray-50 rounded-2xl p-6 font-normal leading-relaxed transition-all duration-200'
        spellCheck={false}
      />

      {/* Footer Area */}
      <div className='flex flex-row items-center justify-between mt-auto border-t border-gray-100 pt-6'>
        {/* Left Side: Char Count + Usage Badge */}
        <div className='flex items-center gap-3 md:gap-6'>
          <span className='text-gray-400 text-sm md:text-base font-medium'>
            {text.length} / {maxLength}
          </span>

          {isPro ? (
            <div className='flex items-center gap-1.5 md:gap-2 bg-blue-50 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-brand-blue border border-blue-100'>
              <Zap className='w-3 h-3 md:w-3.5 md:h-3.5 fill-current' />
              <span className='text-[10px] md:text-xs font-bold uppercase tracking-wide hidden sm:inline-block'>
                Pro Active
              </span>
              <span className='text-[10px] md:text-xs font-bold uppercase tracking-wide sm:hidden'>
                Pro
              </span>
              <span className='text-gray-300 mx-0.5 md:mx-1'>|</span>
              <InfinityIcon className='w-3 h-3 md:w-3.5 md:h-3.5' />
              <span className='text-[10px] md:text-xs font-semibold hidden sm:inline-block'>
                Unlimited
              </span>
            </div>
          ) : (
            <div className='flex items-center gap-2 bg-[#F0F7FF] px-2.5 py-1 md:px-3 md:py-1.5 rounded-full'>
              <div className='flex gap-1 hidden sm:flex'>
                {[...Array(maxUsage)].map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: Static usage dots
                    key={i}
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors duration-300 ${
                      i < usageCount ? 'bg-brand-blue' : 'bg-blue-200/40'
                    }`}
                  ></div>
                ))}
              </div>
              <span className='text-brand-blue text-[10px] md:text-xs font-bold ml-0.5 md:ml-1'>
                {usageCount} / {maxUsage}{' '}
                <span className='hidden md:inline-block'>free</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Rewrite Button */}
        {hasResults ? (
          <Button
            onClick={handleReset}
            className='rounded-full md:rounded-xl w-[46px] h-[46px] p-0 md:w-auto md:py-6 md:px-8 font-medium shadow-sm transition-all text-base md:text-lg cursor-pointer flex items-center justify-center relative bg-white text-brand-blue border border-brand-blue hover:bg-blue-50 hover:-translate-y-0.5'
          >
            <IoSparkles className='w-5 h-5 absolute md:relative md:mr-2' />
            <span className='hidden md:block'>+ New Rewrite</span>
          </Button>
        ) : (
          <Button
            onClick={handleRewrite}
            disabled={
              (!isPro && usageCount === 0) || text.length === 0 || isLoading
            }
            className={cn(
              'rounded-full md:rounded-xl w-[46px] h-[46px] p-0 md:w-auto md:py-6 md:px-8 font-medium shadow-lg transition-all text-base md:text-lg cursor-pointer flex items-center justify-center relative',
              !isPro && usageCount === 0
                ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
                : 'bg-brand-blue hover:bg-blue-600 text-white shadow-blue-200/50 hover:shadow-blue-300/50 hover:-translate-y-0.5',
            )}
          >
            {isLoading ? (
              <Loader2 className='w-5 h-5 animate-spin absolute md:relative md:mr-2' />
            ) : (
              <IoSparkles className='w-5 h-5 absolute md:relative md:mr-2' />
            )}
            <span className='hidden md:block'>
              {isLoading
                ? 'Enhancing...'
                : !isPro && usageCount === 0
                  ? 'Limit Reached'
                  : 'Enhance Text'}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
