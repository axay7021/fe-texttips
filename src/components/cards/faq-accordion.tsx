'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is TextTips?',
    answer:
      'TextTips is an AI-powered writing assistant that helps you rewrite and enhance your text. Whether you need to sound more professional, friendly, or concise, TextTips provides instant suggestions to elevate your communication.',
  },
  {
    question: 'Is it free to use?',
    answer:
      'Yes! You can use TextTips for free with a limited number of daily rewrites. For unlimited access and advanced features, you can upgrade to our Pro plan.',
  },
  {
    question: 'How does the AI enhancement work?',
    answer:
      'We use advanced AI models (like Google Gemini) to analyze your input and generate multiple rewritten versions in different tones (Professional, Friendly, Concise, Polished, Clear, Confident).',
  },
  {
    question: 'What is included in the Pro plan?',
    answer:
      'The Pro plan unlocks unlimited daily rewrites, access to all premium tones, faster processing speeds, and priority support.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Absolutely. You can manage or cancel your subscription at any time directly from your dashboard settings. Your access will continue until the end of the current billing cycle.',
  },
];

export const FaqAccordion = () => {
  return (
    <Accordion type='single' collapsible className='w-full space-y-4'>
      {faqs.map((faq, index) => (
        <AccordionItem
          // biome-ignore lint/suspicious/noArrayIndexKey: Static list
          key={index}
          value={`item-${index}`}
          className='border-b border-gray-700 px-2'
        >
          <AccordionTrigger className='text-white hover:no-underline text-[18px] md:text-[20px] font-medium py-2 [&[data-state=open]]:text-white'>
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className='text-[#D8D8D8] text-[14px] md:text-[16px] leading-relaxed pb-3 mt-5'>
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
