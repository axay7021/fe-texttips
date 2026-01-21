"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoSparkles } from "react-icons/io5";

export function TextEnhancerUI() {
  const [text, setText] = useState("");
  const maxLength = 2000;

  return (
    <div className="w-full mx-auto relative z-20">
      <div className="bg-white rounded-3xl shadow-[0_16px_16px_-8px_#CCE5FF] border border-[#D9ECFF] p-5 flex flex-col relative transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)]">
        <textarea
          value={text}
          rows={4}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add Your text here"
          maxLength={maxLength}
          className="w-full flex-1 resize-none border-none outline-none text-[16px] text-[#000000] placeholder:text-[#000000] bg-transparent font-normal"
          spellCheck={false}
        />

        <div className="flex items-center justify-between mt-1">
          <span className="text-gray-400 text-[16px] font-medium">
            {text.length}/{maxLength}
          </span>
          <Button className="bg-brand-blue hover:bg-blue-600 text-white rounded-full w-[46px] h-[46px] p-0 md:w-auto md:py-6 md:px-[20px]! font-medium shadow-lg shadow-blue-200/50 transition-all hover:shadow-blue-300/50 hover:-translate-y-0.5 text-base md:text-[20px] cursor-pointer flex items-center justify-center">
            <IoSparkles className="w-5 h-5 md:mr-1 md:w-5 md:h-5" />
            <span className="hidden md:block">Rewrite</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
