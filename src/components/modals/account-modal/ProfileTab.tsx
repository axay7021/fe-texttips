import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileTabProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function ProfileTab({ user }: ProfileTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      {/* Avatar Section */}
      <div className='flex items-center flex-col gap-5 pb-8 border-b border-gray-100'>
        <Avatar className='w-[72px] h-[72px] ring-4 ring-gray-50'>
          <AvatarImage src={user.image || ''} />
          <AvatarFallback className='bg-brand-blue text-white text-2xl font-medium'>
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='space-y-1'>
          <div className='font-semibold text-gray-900'>Profile Picture</div>
        </div>
      </div>

      {/* Form Fields */}
      <div className='space-y-6'>
        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-700'>Display Name</p>
          <div className='flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50'>
            <span className='text-gray-900 font-medium'>{user.name}</span>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-700'>Email Address</p>
          <div className='flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50'>
            <span className='text-gray-900'>{user.email}</span>
            <div className='flex items-center gap-2 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium'>
              <CheckCircle className='w-3.5 h-3.5' />
              Verified
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
