'use client';

import { FaqAccordion } from './cards/faq-accordion';

const FaqSection = () => {
  return (
    <section className='bg-[#303030] py-20 px-4 md:px-8'>
      <div className='max-w-[1320px] mx-auto'>
        <div className='text-center mb-[30px] space-y-[40px]'>
          <span className='text-brand-blue font-semibold text-[22px] uppercase tracking-wider'>
            FAQ
          </span>
          <h2 className='text-[20px] md:text-[36px] font-bold text-white leading-tight'>
            Questions About TextTips?
            <br />
            We have Answers!
          </h2>
        </div>

        <FaqAccordion />
      </div>
    </section>
  );
};

export default FaqSection;
