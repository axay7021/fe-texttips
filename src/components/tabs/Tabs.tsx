'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { FaBriefcase } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface TabsProps {
  activeTab: 'personal' | 'business';
  setActiveTab: (tab: 'personal' | 'business') => void;
}

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  const tabs = [
    { id: 'personal', label: 'Personal', Icon: User },
    { id: 'business', label: 'Business', Icon: FaBriefcase },
  ] as const;

  return (
    <div className='flex items-center shadow-soft bg-[#EBF5FF] w-[95%] max-w-[347px] p-1.5 sm:p-2 rounded-full shadow-sm mx-auto mb-10 sm:mb-16 relative space-x-1 sm:space-x-2'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            type='button'
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-sm sm:text-xl font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2.5 relative flex-1 justify-center outline-none',
              isActive
                ? 'text-white'
                : 'bg-white text-brand-blue hover:bg-gray-50',
            )}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {isActive && (
              <motion.div
                layoutId='active-pill'
                className='absolute inset-0 bg-brand-blue rounded-full shadow-md'
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ zIndex: 0 }}
              />
            )}
            <span className='relative z-10 flex items-center gap-1.5 sm:gap-2.5'>
              <tab.Icon className='w-4 h-4 sm:w-6 sm:h-6 fill-current' />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
