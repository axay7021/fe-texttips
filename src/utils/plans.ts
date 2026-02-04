interface Plan {
  name: string;
  originalPriceUsd: number;
  priceUsd: number;
  description: string;
  wordLimit: number;
  features: string[];
  isActive: boolean;
  type: 'personal' | 'business';
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    originalPriceUsd: 0,
    priceUsd: 0,
    description: 'See what AI can do',
    wordLimit: 1000,
    features: [
      'Get simple explanations',
      'Have short chats for common questions',
      '1000 words per month',
    ],
    isActive: true,
    type: 'personal',
  },
  {
    name: 'Plus',
    originalPriceUsd: 19,
    priceUsd: 19,
    description: 'Get more out of AI',
    wordLimit: 10000,
    features: [
      'Explore topics in depth',
      'Longer chats for in-depth conversations',
      '10,000 words per month',
      'Get more memory for smarter replies',
    ],
    isActive: true,
    type: 'personal',
    isPopular: true,
  },
  {
    name: 'Pro',
    originalPriceUsd: 29,
    priceUsd: 29,
    description: 'Get more done with AI',
    wordLimit: 10000,
    features: [
      'Master advanced tasks and topics',
      'Tackle big projects with unlimited messages',
    ],
    isActive: true,
    type: 'personal',
  },
  {
    name: 'Business',
    originalPriceUsd: 49,
    priceUsd: 49,
    description: 'Get more work done with AI for teams',
    wordLimit: 100000,
    features: [
      'Conduct professional analysis',
      'Tackle big projects with unlimited messages',
    ],
    isActive: true,
    type: 'business',
  },
];

export default plans;
