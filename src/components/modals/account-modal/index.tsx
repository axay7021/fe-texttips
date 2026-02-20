'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PlanTab } from './PlanTab';
import { ProfileTab } from './ProfileTab';
import { Sidebar } from './Sidebar';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  subscription?: any;
}

export function AccountModal({
  isOpen,
  onClose,
  user,
  subscription,
}: AccountModalProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('profile');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/20 z-[100] backdrop-blur-sm'
          />

          {/* Modal Container */}
          <div className='fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none'>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className='bg-white rounded-[24px] shadow-2xl w-[95%] sm:w-full max-w-[850px] overflow-hidden pointer-events-auto flex flex-col sm:flex-row h-auto max-h-[90vh] sm:h-[600px] relative'
            >
              {/* Close Button */}
              <div className='absolute top-4 right-4 sm:top-6 sm:right-6 z-50'>
                <button
                  type='button'
                  onClick={onClose}
                  className='h-8 w-8 cursor-pointer flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              {/* Sidebar */}
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

              {/* Main Content */}
              <div className='flex-1 flex flex-col relative w-full min-w-0 bg-white'>
                {/* Scrollable Area */}
                <div className='flex-1 overflow-y-auto p-6 sm:p-10'>
                  <div className='max-w-2xl mx-auto mt-4 sm:mt-0'>
                    {/* Header for content */}
                    <div className='mb-8'>
                      <h3 className='text-2xl font-bold text-gray-900'>
                        {activeTab === 'profile' ? 'General' : 'Subscription'}
                      </h3>
                    </div>

                    <AnimatePresence mode='wait'>
                      {activeTab === 'profile' && (
                        <ProfileTab key='profile' user={user} />
                      )}

                      {activeTab === 'plan' && (
                        <PlanTab
                          key='plan'
                          subscription={subscription}
                          onClose={onClose}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
