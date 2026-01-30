'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import blogIcon from '@/public/icons/blog-icon.png';
import contentIcon from '@/public/icons/content-icon.png';
import copyWritingIcon from '@/public/icons/copy-writing-icon.png';
import robotIcon from '@/public/icons/robot-icon.png';
import userIcon from '@/public/icons/user-icon.png';
import writingIcon from '@/public/icons/writing-icon.png';

const badges = [
  {
    id: 1,
    imageSrc: writingIcon,
    text: 'Content Writing',
    position: 'top-[25%] left-[4%] xl:left-[6%]',
    delay: 0,
    type: 'small',
  },
  {
    id: 2,
    imageSrc: copyWritingIcon,
    text: 'Copy Writing',
    position: 'bottom-[30%] left-[1%] 2xl:left-[2%]',
    delay: 1.5,
    type: 'small',
  },
  {
    id: 3,
    imageSrc: contentIcon,
    title: 'Content',
    subtitle: '30k Rewrite',
    position: 'bottom-[50%] left-[12%] 2xl:left-[17%]',
    delay: 0.8,
    type: 'large',
    iconBg: 'bg-orange-400',
  },
  {
    id: 4,
    imageSrc: blogIcon,
    text: 'Blog Writing',
    position: 'top-[20%] right-[5%] 2xl:right-[8%]',
    delay: 2,
    type: 'small',
  },
  {
    id: 5,
    imageSrc: userIcon,
    title: '5K+',
    subtitle: 'Happy User',
    position: 'top-[45%] right-[12%] 2xl:right-[17%]',
    delay: 1.2,
    type: 'large',
    iconBg: 'bg-blue-500',
  },
  {
    id: 6,
    imageSrc: robotIcon,
    text: 'AI Content',
    position: 'bottom-[30%] right-[1%] 2xl:right-[2%]',
    delay: 2.5,
    type: 'small',
  },
];

export function HeroBadges() {
  return (
    <div className='absolute inset-0 pointer-events-none hidden xl:block overflow-hidden'>
      <div className='relative w-full h-full mx-auto'>
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: badge.delay * 0.2 },
              scale: { duration: 0.5, delay: badge.delay * 0.2 },
              y: {
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: badge.delay, // Float delay
              },
            }}
            className={`absolute ${badge.position} z-20`}
          >
            {badge.type === 'small' ? (
              <div className='flex items-center gap-[14px] px-4 py-[14px] bg-[#F3F9FF] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-sm'>
                <div className='w-8 h-8 flex items-center justify-center shrink-0'>
                  <Image
                    src={badge.imageSrc}
                    alt={badge.text || 'icon'}
                    width={32}
                    height={32}
                    className='object-contain'
                  />
                </div>
                <span className='text-[16px] font-semibold text-paragraph whitespace-nowrap font-semibold'>
                  {badge.text}
                </span>
              </div>
            ) : (
              <div className='flex items-center gap-3 px-5 py-4 bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 backdrop-blur-sm min-w-[160px]'>
                <Image
                  src={badge.imageSrc}
                  alt={badge.title || 'icon'}
                  width={40}
                  height={40}
                  className='object-contain'
                />
                <div className='flex flex-col'>
                  <span className='text-[20px] font-bold text-black leading-none mb-1'>
                    {badge.title}
                  </span>
                  <span className='text-[14px] font-normal text-paragraph tracking-wide'>
                    {badge.subtitle}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
