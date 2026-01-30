import { Monitor, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className='w-[260px] bg-[#F9FAFB] border-r border-gray-100 p-6 flex flex-col gap-2 shrink-0'>
      <h2 className='text-xl font-bold text-[#1a1a1a] px-3 mb-4'>Settings</h2>

      <div className='space-y-1'>
        <button
          type='button'
          onClick={() => setActiveTab('profile')}
          className={`w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
            activeTab === 'profile'
              ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-100'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <User
            className={`w-5 h-5 ${activeTab === 'profile' ? 'text-brand-blue' : 'text-gray-400'}`}
          />
          <span>General</span>
        </button>
        <button
          type='button'
          onClick={() => setActiveTab('plan')}
          className={`w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
            activeTab === 'plan'
              ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-100'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Monitor
            className={`w-5 h-5 ${activeTab === 'plan' ? 'text-brand-blue' : 'text-gray-400'}`}
          />
          <span>Subscription</span>
        </button>
      </div>
    </div>
  );
}
