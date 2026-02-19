'use client';

import heroImage from '@public/hero-bg-pattern.png';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function BackgroundAnimation() {
  const lineCount = 6; // Number of vertical lines to match the design roughly

  return (
    <>
      <div className='absolute inset-0 z-[-10] overflow-hidden pointer-events-none flex justify-between w-full mx-auto px-4 md:px-24'>
        {/* Generate vertical lines */}
        {Array.from({ length: lineCount }).map((_, i) => {
          const duration = 5 + Math.random() * 4; // Increased speed (lower duration)
          const delayOffset = Math.random() * 10; // Random start time for the column

          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Static array
              key={i}
              className='relative w-px h-full bg-[#f0f7ff]' // Very faint blue line
            >
              {/* Animated beams moving down */}
              {Array.from({ length: 2 }).map((_, j) => (
                <motion.div
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static array
                  key={j}
                  initial={{ top: '-20%', opacity: 0 }}
                  animate={{
                    top: ['-20%', '120%'],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: delayOffset + j * (duration / 2), // Perfectly spaced delays (halfway point)
                  }}
                  className='absolute w-[3px] h-[10vh] -left-px bg-[#c9e4ff]'
                />
              ))}
            </div>
          );
        })}
      </div>
      {/* Background Pattern */}
      <div className='absolute inset-0 pointer-events-none opacity-0.7'>
        <Image
          src={heroImage}
          alt='Hero Pattern'
          fill
          className='object-contain scale-85 -translate-y-12'
          priority
        />
      </div>
    </>
  );
}
