'use client';

import { useCompletion } from '@ai-sdk/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { parseEnhancementResult } from '@/utils/text-enhancer';
import { EnhancerInput } from './enhancer/enhancer-input';
import { EnhancerResults } from './enhancer/enhancer-results';
import type { EnhancedVersion } from './enhancer/types';

export function DashboardTextEnhancerUI() {
  const [showTip, setShowTip] = useState(true);
  const maxLength = 2000;

  const [parsedVersions, setParsedVersions] = useState<EnhancedVersion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Fetch Usage Limit
  const {
    data: usageData,
    refetch: refetchUsage,
    isLoading: isUsageLoading,
  } = useQuery({
    queryKey: ['user-limit'],
    queryFn: async () => {
      const res = await axios.get('/api/user/limit');
      return res.data;
    },
  });

  const maxUsage = usageData ? usageData.limit : 3;
  // Calculate remaining locally for display logic or use from API
  const remaining = usageData ? usageData.remaining : 3;
  const isPro = usageData?.type === 'subscription';

  const { input, setInput, completion, setCompletion, isLoading, complete } =
    useCompletion({
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
    } else {
      setParsedVersions([]);
    }
  }, [completion]);

  if (isUsageLoading) {
    return (
      <div className='fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='animate-spin text-brand-blue w-10 h-10' />
          <p className='text-gray-500 font-medium text-lg'>
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  const handleRewrite = () => {
    if (!input.trim()) return;

    if (remaining <= 0 && !isPro) {
      // Optional: Trigger upgrade modal or alert
      return;
    }

    setParsedVersions([]);
    complete(input);
  };

  const handleReset = () => {
    setInput('');
    if (setCompletion) setCompletion('');
    setParsedVersions([]);
    setCopiedIndex(null);
  };

  const copyToClipboard = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: Allow logging
      console.error('Failed to copy', err);
    }
  };

  const replaceText = (newText: string) => {
    setInput(newText);
  };

  return (
    <div className='w-full mx-auto relative z-20 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700'>
      <EnhancerInput
        text={input}
        setText={setInput}
        handleRewrite={handleRewrite}
        isLoading={isLoading}
        isPro={isPro}
        usageCount={remaining} // Passing remaining as "usageCount" for display if that's what the component expects
        showTip={showTip}
        setShowTip={setShowTip}
        maxLength={maxLength}
        maxUsage={maxUsage}
        hasResults={parsedVersions.length > 0 || (!!completion && !isLoading)}
        handleReset={handleReset}
      />

      <EnhancerResults
        parsedVersions={parsedVersions}
        isLoading={isLoading}
        copiedIndex={copiedIndex}
        copyToClipboard={copyToClipboard}
        replaceText={replaceText}
        completion={completion}
      />
    </div>
  );
}
