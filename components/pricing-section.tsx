"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tabs from "@/components/tabs/Tabs";

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "business">(
    "personal",
  );

  return (
    <section
      className="relative py-10 md:py-20 px-4 overflow-hidden bg-white"
      id="pricing"
    >
      {/* Background Pattern - Placeholder as requested */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* User will attach background pattern image here */}
      </div>

      {/* Pencile pattern */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <img
          src="/pricing-pencile-pattern.png"
          alt="Pattern"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-brand-blue font-semibold text-[22px]">
            Select your plan
          </span>
          <h2 className="text-3xl md:text-[36px] font-bold text-heading">
            Start your content
            <br className="hidden md:block" /> writing with AI
          </h2>
        </div>

        {/* Tabs */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
          {/* Free Plan */}
          <div
            style={{
              background:
                "linear-gradient(125deg,rgba(215, 215, 215, 1) 0%, rgba(249, 249, 249, 1) 84%)",
            }}
            className="rounded-[20px] p-1.5 pt-0 flex flex-col h-full relative overflow-hidden w-full max-w-[400px] mx-auto"
          >
            {/* Top Banner */}
            <div className="text-center py-2 text-paragraph font-bold text-sm font-medium">
              Free Trial for 3 Days*
            </div>

            {/* Main White Content Card */}
            <div className="bg-[#F7F7F7] rounded-[16px] px-4 py-6 flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-[22px] leading-tight font-semibold text-heading mb-2">
                  Free
                </h3>
                <p className="text-paragraph text-[15px] leading-relaxed mb-6 max-w-[90%]">
                  For those looking to fix spelling and grammatical errors for
                  limited use only.
                </p>
                <div className="mb-8">
                  <span className="text-5xl font-semibold text-heading tracking-tight">
                    $0.00
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-xl h-14 text-lg font-medium border-[#E5E5E5] text-[#AAAAAA] hover:bg-transparent hover:text-[#AAAAAA] cursor-default bg-white"
                  disabled={
                    false
                  } /* Visually disabled look but kept interactive if needed, or just disabled */
                >
                  Current Plan
                </Button>
              </div>

              <div className="space-y-6 mt-2">
                <div>
                  <h4 className="font-semibold text-heading text-[16px] mb-2">
                    Limited daily Use:
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>10 Writes& AI suggestions</span>
                    </li>
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>AI Generations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-heading text-[16px] mb-2">
                    Limited monthly Use:
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>3 Ai summarizations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-heading text-[16px] mb-2">
                    Unlimited:
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>Spelling corrections</span>
                    </li>
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>Grammar checks</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Plan */}
          <div className="bg-[#3B9DF8] rounded-[20px] p-1.5 flex flex-col h-full relative overflow-hidden shadow-xl shadow-blue-200 w-full max-w-[400px] mx-auto">
            {/* Recommended Banner */}
            <div className="text-center py-2 text-white font-bold text-sm tracking-wide uppercase">
              Recommended
            </div>

            {/* Main White Content Card */}
            <div className="bg-[#F8F9FB] rounded-[16px] px-4 py-6 flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-[22px] leading-tight font-semibold text-heading mb-2">
                  Advanced
                </h3>
                <p className="text-paragraph text-[15px] leading-relaxed mb-6 max-w-[90%]">
                  For those looking to perfect their writing — for limited daily
                  use.
                </p>
                <div className="mb-8">
                  <span className="text-5xl font-semibold text-heading tracking-tight">
                    $200.00
                  </span>
                </div>

                <Button className="w-full rounded-xl h-14 text-lg font-medium bg-transparent border border-[#3B9DF8] text-[#3B9DF8] hover:bg-[#3B9DF8] hover:text-white transition-all shadow-none">
                  Upgrade to Advanced
                </Button>
              </div>

              <div className="space-y-6 mt-2">
                <div>
                  <h4 className="font-semibold text-heading text-[16px] mb-2">
                    Limited daily Use:
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>10 Writes& AI suggestions</span>
                    </li>
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>AI Generations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-heading text-[16px] mb-2">
                    Limited monthly Use:
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>3 Ai summarizations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-heading text-[16px] mb-2">
                    Unlimited:
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>Spelling corrections</span>
                    </li>
                    <li className="flex items-center gap-3 text-paragraph text-[15px]">
                      <Check className="w-5 h-5 text-[#AAAAAA] stroke-[3]" />
                      <span>Grammar checks</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
