'use client';

import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EnhancedVersion } from './types';

interface EnhancerResultsProps {
  parsedVersions: EnhancedVersion[];
  isLoading: boolean;
  copiedIndex: number | null;
  copyToClipboard: (content: string, index: number) => void;
  replaceText: (newText: string) => void;
  completion?: string; // Fallback for raw text
}

export function EnhancerResults({
  parsedVersions,
  copiedIndex,
  copyToClipboard,
  completion,
}: EnhancerResultsProps) {
  // If we have parsed versions, show cards
  if (parsedVersions.length > 0) {
    return (
      <div className='flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full'>
        {parsedVersions.map((version, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: List is static for this render
            key={index}
            className='bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group relative'
          >
            {/* Header / Top part for Mobile, Left part for Desktop */}
            <div className='flex items-center justify-between w-full sm:w-auto'>
              <div className='flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider sm:w-[130px] md:w-[140px] shrink-0 justify-start'>
                <span className='text-sm sm:text-base'>{version.icon}</span>
                {version.title}
              </div>

              {/* Copy button Top Right on mobile */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => copyToClipboard(version.text, index)}
                className='sm:hidden h-8 w-8 shrink-0 cursor-pointer p-0 text-gray-400 hover:text-brand-blue hover:bg-blue-50 transition-colors'
              >
                {copiedIndex === index ? (
                  <Check className='w-4 h-4' />
                ) : (
                  <Copy className='w-4 h-4' />
                )}
                <span className='sr-only'>Copy</span>
              </Button>
            </div>

            {/* Vertical Divider (Hidden on Mobile) */}
            <div className='hidden sm:block w-px h-8 bg-gray-200 mx-1 shrink-0'></div>

            {/* Text Content */}
            <div className='text-gray-600 text-[13px] text-left sm:text-sm leading-relaxed flex-1 break-words pb-1 sm:py-1'>
              {version.text}
            </div>

            {/* Copy button Right side on desktop */}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => copyToClipboard(version.text, index)}
              className='hidden sm:flex h-8 w-8 shrink-0 cursor-pointer p-0 text-gray-400 hover:text-brand-blue hover:bg-blue-50 opacity-100 transition-opacity'
            >
              {copiedIndex === index ? (
                <Check className='w-4 h-4' />
              ) : (
                <Copy className='w-4 h-4' />
              )}
              <span className='sr-only'>Copy</span>
            </Button>
          </div>
        ))}
      </div>
    );
  }

  // Fallback: If streaming but not yet parsed (or raw text mode), show simple loading or raw text
  if (completion) {
    return (
      <div className='bg-white rounded-[24px] shadow-[0_16px_16px_-8px_#CCE5FF] border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        <div className='whitespace-pre-wrap text-[#1a1a1a] leading-relaxed text-[18px]'>
          {completion}
        </div>
      </div>
    );
  }

  return null;
}
