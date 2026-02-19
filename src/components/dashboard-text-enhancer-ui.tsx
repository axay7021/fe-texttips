'use client';

import { useCompletion } from '@ai-sdk/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
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
  const { data: usageData, refetch: refetchUsage } = useQuery({
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

  const { input, setInput, completion, isLoading, complete } = useCompletion({
    api: '/api/enhance',
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

  const handleRewrite = () => {
    if (!input.trim()) return;

    if (remaining <= 0 && !isPro) {
      // Optional: Trigger upgrade modal or alert
      return;
    }

    setParsedVersions([]);
    complete(input);
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
    <div className='w-full mx-auto relative z-20 flex flex-col gap-6'>
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
