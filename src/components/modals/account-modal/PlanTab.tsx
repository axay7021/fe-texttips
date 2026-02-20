import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { IoSparkles } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import plans from '@/utils/plans';

interface PlanTabProps {
  subscription?: any;
  onClose?: () => void;
}

export function PlanTab({ subscription, onClose: _onClose }: PlanTabProps) {
  // Handle subscription array or object
  const activeSub = Array.isArray(subscription)
    ? subscription[0]
    : subscription;

  // Find plan details from utils
  // activeSub.plan might be "Plus" or "price_..." depending on source
  // We try to match by name or ID if possible.
  // Custom upgrade sets planId="Plus", better-auth might use "price_..."
  const planName = activeSub?.plan || activeSub?.planId || 'Free';
  const planDetails =
    plans.find((p) => p.name.toLowerCase() === planName.toLowerCase()) ||
    plans.find((p) => p.name === 'Free');

  // Fetch Usage Data
  const { data: usageData } = useQuery({
    queryKey: ['user-limit'],
    queryFn: async () => {
      const res = await axios.get('/api/user/limit');
      return res.data;
    },
  });

  const usageCount = usageData ? usageData.usage : 0;
  const limit = usageData ? usageData.limit : 3;
  const percentage = Math.min((usageCount / limit) * 100, 100);

  const isActive = !!activeSub && activeSub.status === 'active';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      {/* Plan Card */}
      <div className='p-6 rounded-2xl border border-gray-200 bg-gray-50/30 relative overflow-hidden'>
        <div className='absolute top-0 right-0 p-4'>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isActive ? 'Active' : 'Free Tier'}
          </span>
        </div>

        <div className='mb-4'>
          <div className='text-sm text-gray-500 font-medium mb-1'>
            Current Plan
          </div>
          <div className='text-2xl font-bold text-gray-900'>
            {planDetails?.name || 'Free'} Plan
          </div>
        </div>

        <div className='flex gap-4'>
          <Button
            className='w-full bg-brand-blue cursor-pointer hover:bg-blue-600 text-white shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all rounded-xl h-10 px-6'
            onClick={() => {
              window.location.href =
                'mailto:sales@softcolon.com?subject=Upgrade Inquiry';
            }}
          >
            <IoSparkles className='w-4 h-4 mr-2' />
            Contact Sales
          </Button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className='p-5 rounded-2xl border border-gray-100 bg-white shadow-sm'>
        <div className='flex justify-between items-center mb-2'>
          <div className='text-sm text-gray-500 font-medium'>Monthly Usage</div>
          <div className='text-sm font-bold text-gray-900'>
            {usageCount} / {limit}
          </div>
        </div>
        <div className='w-full bg-gray-100 rounded-full h-2.5'>
          <div
            className='bg-brand-blue h-2.5 rounded-full'
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className='text-xs text-gray-400 mt-2'>
          Renews on{' '}
          {activeSub?.periodEnd
            ? new Date(activeSub.periodEnd).toLocaleDateString()
            : 'N/A'}
        </div>
      </div>

      {/* Billing History Section */}
      <div className='pt-2'>
        <h4 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
          <History className='w-4 h-4' /> Billing History
        </h4>
        <div className='border border-gray-100 rounded-xl overflow-x-auto hide-scrollbar'>
          <table className='w-full min-w-[500px] text-sm text-left'>
            <thead className='bg-gray-50 text-gray-500 font-medium'>
              <tr>
                <th className='px-4 py-3'>Date</th>
                <th className='px-4 py-3'>Plan</th>
                <th className='px-4 py-3'>Amount</th>
                <th className='px-4 py-3'>Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {isActive ? (
                <tr>
                  <td className='px-4 py-3'>
                    {activeSub.startDate
                      ? new Date(activeSub.startDate).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3'>{planDetails?.name || planName}</td>
                  <td className='px-4 py-3'>${planDetails?.priceUsd || 0}</td>
                  <td className='px-4 py-3'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800'>
                      Paid
                    </span>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className='px-4 py-6 text-center text-gray-400'
                  >
                    No payment history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features List (Optional, can keep or remove if too cluttered) */}
      {/* ... */}
    </motion.div>
  );
}
