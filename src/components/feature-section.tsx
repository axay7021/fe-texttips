'use client';

import cartoonCharacter from '@public/cartoon-character.png';
import chromeIcon from '@public/chrome-icon.png';
import Image from 'next/image';
import Link from 'next/link';

const FeatureSection = () => {
  return (
    <section id='extension' className='py-10 pb-30 px-4 md:px-8 bg-white'>
      <div
        className='max-w-[1119px] mx-auto p-6 md:p-[40px] rounded-[20px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4'
        style={{
          background:
            'linear-gradient(260deg,rgba(255, 255, 255, 1) 0%, rgba(242, 242, 242, 1) 100%)',
          boxShadow:
            '0px 16px 32px -4px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05)',
        }}
      >
        <div className='space-y-3 md:space-y-1 text-center md:text-left'>
          <h1 className='text-brand-blue text-lg md:text-[22px] font-semibold'>
            Free Download Extension
          </h1>
          <h2 className='text-black text-2xl md:text-[36px] font-semibold'>
            Download the Extension Now
          </h2>
          <p className='text-[#878787] text-lg md:text-[22px] font-normal max-w-none md:max-w-[627px] leading-[1.4]'>
            Make your browser smarter with powerful AI tools built right inside
            Chrome. Install in seconds and start working faster today.
          </p>
          <Link
            target='_blank'
            href='https://chromewebstore.google.com/detail/text-tips-rewrite-enhance/dandccdiknfjlhcofajmflbmnkbkakji'
            className='bg-black w-fit text-white group rounded-full mt-6 text-[18px] h-auto px-6 py-3 cursor-pointer flex items-center gap-2 mx-auto md:mx-0'
          >
            <Image
              src={chromeIcon}
              alt='chrome-icon'
              className='group-hover:scale-110 transition-all duration-300 ease-in-out'
              width={20}
              height={20}
            />
            Install Chrome Extension
          </Link>
        </div>

        <Image
          src={cartoonCharacter}
          alt='Feature Section'
          width={362}
          height={216}
          className='max-w-[280px] md:max-w-[362px] w-full h-auto'
        />
      </div>
    </section>
  );
};

export default FeatureSection;
