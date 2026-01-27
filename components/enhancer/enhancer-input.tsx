"use client";

import { Button } from "@/components/ui/button";
import { IoSparkles } from "react-icons/io5";
import { X, Infinity, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
}: EnhancerInputProps) {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_16px_16px_-8px_#CCE5FF] border border-gray-100 p-6 md:p-8 flex flex-col relative min-h-[400px]">
      {/* Info Banner - Only for Free Users */}
      {showTip && !isPro && (
        <div className="mb-4 flex items-start md:items-center justify-between bg-[#F8FAFC] border border-gray-100 px-4 py-3 rounded-xl text-sm text-gray-600 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span>
              You get{" "}
              <span className="font-semibold text-[#333]">
                {usageCount} free rewrites
              </span>
              . No credit card required.
            </span>
          </div>
          <button
            onClick={() => setShowTip(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg ml-2"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add your text here to enhance it..."
        maxLength={maxLength}
        className="w-full flex-1 resize-none border-none outline-none text-[18px] text-[#1a1a1a] placeholder:text-gray-300 bg-transparent font-normal leading-relaxed"
        spellCheck={false}
      />

      {/* Footer Area */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4 border-t border-gray-50 pt-4 md:border-none md:pt-0">
        {/* Left Side: Char Count + Usage Badge */}
        <div className="flex items-center gap-6 w-full md:w-auto">
          <span className="text-gray-300 text-sm font-medium">
            {text.length} / {maxLength}
          </span>

          {isPro ? (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-brand-blue border border-blue-100">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Pro Active
              </span>
              <span className="text-gray-300 mx-1">|</span>
              <Infinity className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Unlimited</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#F0F7FF] px-3 py-1.5 rounded-full">
              <div className="flex gap-1">
                {[...Array(maxUsage)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      i < usageCount ? "bg-brand-blue" : "bg-blue-200/40"
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-brand-blue text-xs font-bold ml-1">
                {usageCount} / {maxUsage} free
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Rewrite Button */}
        <Button
          onClick={handleRewrite}
          disabled={
            (!isPro && usageCount === 0) || text.length === 0 || isLoading
          }
          className={cn(
            "rounded-xl w-full md:w-auto py-6 px-8 font-medium shadow-lg transition-all text-lg cursor-pointer flex items-center justify-center gap-2",
            !isPro && usageCount === 0
              ? "bg-gray-100 text-gray-400 shadow-none cursor-not-allowed"
              : "bg-brand-blue hover:bg-blue-600 text-white shadow-blue-200/50 hover:shadow-blue-300/50 hover:-translate-y-0.5",
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <IoSparkles className="w-5 h-5" />
          )}
          <span>
            {isLoading
              ? "Enhancing..."
              : !isPro && usageCount === 0
                ? "Limit Reached"
                : "Enhance Text"}
          </span>
        </Button>
      </div>
    </div>
  );
}
