import { Monitor, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className='w-full sm:w-[260px] bg-[#F9FAFB] border-b sm:border-b-0 sm:border-r border-gray-100 p-4 sm:p-6 flex flex-col gap-2 shrink-0 sm:shrink-0'>
      <h2 className='hidden sm:block text-xl font-bold text-[#1a1a1a] px-3 mb-4'>
        Settings
      </h2>

      <div className='flex flex-row sm:flex-col gap-2 overflow-x-auto pb-2 hide-scrollbar'>
        <button
          type='button'
          onClick={() => setActiveTab('profile')}
          className={`shrink-0 sm:w-full flex cursor-pointer items-center gap-2 sm:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-sm sm:text-[15px] font-medium transition-all duration-200 ${
            activeTab === 'profile'
              ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-100'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <User
            className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'profile' ? 'text-brand-blue' : 'text-gray-400'}`}
          />
          <span className='whitespace-nowrap'>General</span>
        </button>
        <button
          type='button'
          onClick={() => setActiveTab('plan')}
          className={`shrink-0 sm:w-full flex items-center cursor-pointer gap-2 sm:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-sm sm:text-[15px] font-medium transition-all duration-200 ${
            activeTab === 'plan'
              ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-100'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Monitor
            className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'plan' ? 'text-brand-blue' : 'text-gray-400'}`}
          />
          <span className='whitespace-nowrap'>Subscription</span>
        </button>
      </div>
    </div>
  );
}
