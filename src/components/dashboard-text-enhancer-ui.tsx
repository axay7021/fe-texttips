'use client';

import { useCompletion } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import { parseEnhancementResult } from '@/utils/text-enhancer';
import { EnhancerInput } from './enhancer/enhancer-input';
import { EnhancerResults } from './enhancer/enhancer-results';
import type { EnhancedVersion } from './enhancer/types';

interface DashboardTextEnhancerUIProps {
  isPro?: boolean;
}

export function DashboardTextEnhancerUI({
  isPro = false,
}: DashboardTextEnhancerUIProps) {
  const [showTip, setShowTip] = useState(true);
  const [usageCount, setUsageCount] = useState(3);
  const maxUsage = 3;
  const maxLength = 2000;

  const [parsedVersions, setParsedVersions] = useState<EnhancedVersion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { input, setInput, completion, isLoading, complete } = useCompletion({
    api: '/api/enhance',
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

    if (!isPro) {
      if (usageCount <= 0) return;
      setUsageCount((prev) => prev - 1);
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
        usageCount={usageCount}
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
