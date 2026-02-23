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
    description: 'Experience instant writing assistance',
    wordLimit: 5000,
    features: [
      'Basic text enhancement',
      'Standard rewrite tones (Friendly, Professional)',
      'Up to 5,000 words per month',
      'Browser extension integration',
    ],
    isActive: true,
    type: 'personal',
  },
  {
    name: 'Plus',
    originalPriceUsd: 19,
    priceUsd: 19,
    description: 'Enhance your daily writing workflow',
    wordLimit: 50000,
    features: [
      'Unlimited daily rewrite actions',
      'Access to all premium styles & tones',
      'Up to 50,000 words per month',
      'Priority email customer support',
    ],
    isActive: true,
    type: 'personal',
    isPopular: true,
  },
  {
    name: 'Pro',
    originalPriceUsd: 29,
    priceUsd: 29,
    description: 'Maximum power for power writers',
    wordLimit: 200000,
    features: [
      'Create and save custom writing styles',
      'Context-aware long document rewrites',
      'Up to 200,000 words per month',
      'Early access to experimental features',
    ],
    isActive: true,
    type: 'personal',
  },
  {
    name: 'Business',
    originalPriceUsd: 49,
    priceUsd: 49,
    description: 'Empower your entire team with AI',
    wordLimit: 1000000,
    features: [
      'Everything in Pro for up to 5 members',
      'Share custom styles across your team',
      'Up to 1,000,000 shared words per month',
      'Centralized admin dashboard & billing',
    ],
    isActive: true,
    type: 'business',
  },
];

export default plans;
