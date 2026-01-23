"use client";

import { User } from "lucide-react";
import { FaBriefcase } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface TabsProps {
  activeTab: "personal" | "business";
  setActiveTab: (tab: "personal" | "business") => void;
}

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex items-center shadow-soft bg-[#EBF5FF] max-w-[347px] p-2 rounded-full shadow-sm mb-16 relative space-x-2">
      <button
        onClick={() => setActiveTab("personal")}
        className={cn(
          "px-4 py-2.5 rounded-full text-xl font-medium transition-all duration-300 flex items-center gap-2.5",
          activeTab === "personal"
            ? "bg-brand-blue text-white shadow-md relative z-10"
            : "bg-white text-brand-blue hover:bg-gray-50",
        )}
      >
        <User className="w-6 h-6 fill-current" />
        Personal
      </button>
      <button
        onClick={() => setActiveTab("business")}
        className={cn(
          "px-4 py-2.5 rounded-full text-xl font-medium transition-all duration-300 flex items-center gap-2.5",
          activeTab === "business"
            ? "bg-brand-blue text-white shadow-md relative z-10"
            : "bg-white text-brand-blue hover:bg-gray-50",
        )}
      >
        <FaBriefcase className="w-6 h-6 fill-current" />
        Business
      </button>
    </div>
  );
};

export default Tabs;
