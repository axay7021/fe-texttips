"use client";

import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Check } from "lucide-react";
import { EnhancedVersion } from "./types";

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
  isLoading,
  copiedIndex,
  copyToClipboard,
  replaceText,
  completion,
}: EnhancerResultsProps) {
  // If we have parsed versions, show cards
  if (parsedVersions.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-lg mx-auto md:max-w-none md:grid-cols-2">
        {parsedVersions.map((version, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group relative"
          >
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                <span className="text-lg">{version.icon}</span>
                {version.title}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(version.text, index)}
                className="h-8 w-8 cursor-pointer p-0 text-gray-400 hover:text-brand-blue hover:bg-blue-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="sr-only">Copy</span>
              </Button>
            </div>

            <div className="text-gray-600 leading-relaxed min-h-[40px]">
              {version.text}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback: If streaming but not yet parsed (or raw text mode), show simple loading or raw text
  if (completion) {
    return (
      <div className="bg-white rounded-[24px] shadow-[0_16px_16px_-8px_#CCE5FF] border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="whitespace-pre-wrap text-[#1a1a1a] leading-relaxed text-[18px]">
          {completion}
        </div>
      </div>
    );
  }

  return null;
}
