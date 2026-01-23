"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do you offer refunds?",
    answer:
      "We do not offer refunds but you can cancel your subscription before the next billing cycle or before your trial ends by navigating to your account page and clicking on 'Manage Plan'.",
  },
  {
    question: "What forms of payment do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal for secure transactions.",
  },
  {
    question: "How do I contact the support team?",
    answer:
      "You can reach our support team 24/7 via the 'Support' link in your dashboard or by emailing support@openup.com.",
  },
  {
    question: "How long does the free trial last?",
    answer:
      "Our free trial lasts for 3 days, giving you full access to test our premium features before committing.",
  },
  {
    question: "Will I be charged during the free trial period?",
    answer:
      "No, you will not be charged during the free trial period. You will only be charged if you continue your subscription after the trial ends.",
  },
];

const FaqSection = () => {
  return (
    <section className="bg-[#303030] py-20 px-4 md:px-8">
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-[30px] space-y-[40px]">
          <span className="text-brand-blue font-semibold text-[22px] uppercase tracking-wider">
            Faq
          </span>
          <h2 className="text-[20px] md:text-[36px] font-bold text-white leading-tight">
            Questions About our OpenUp?
            <br />
            We have Answers!
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-700 px-2"
            >
              <AccordionTrigger className="text-white hover:no-underline text-[18px] md:text-[20px] font-medium py-2 [&[data-state=open]]:text-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#D8D8D8] text-[14px] md:text-[16px] leading-relaxed pb-3 mt-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
