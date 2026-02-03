import type { StripePlan } from '@better-auth/stripe';
import Stripe from 'stripe';
import config from '@/config';

export const stripeClient = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover', // Use the latest version from your VS Code autocomplete or Stripe dash
  typescript: true,
});

export const STRIPE_PLANS = [
  {
    name: 'free',
    priceId: process.env.STRIPE_FREE_PRICE_ID!,
    limits: {
      words: 1000,
    },
  },
  {
    name: 'plus',
    priceId: process.env.STRIPE_PLUS_PRICE_ID!,
    limits: {
      words: 10000,
    },
  },
  {
    name: 'pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    limits: {
      words: 10000,
    },
  },
  {
    name: 'business',
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
    limits: {
      words: 100000,
    },
  },
] as const satisfies StripePlan[];

export const PLAN_TO_PRICE: Record<string, number> = {
  free: 0,
  plus: 19,
  pro: 29,
  business: 49,
};

export const plans = [
  {
    name: 'Free',
    originalPriceUsd: 0,
    priceUsd: 0,
    stripeProductId: 'prod_TpwiIEWAK8ZbWB',
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
    stripeProductId: 'prod_TpwifxegrEtG9e',
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
    stripeProductId: 'prod_Tpwjl71iZtoTGS',
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
    stripeProductId: 'prod_TpwjBkjW5VfkGo',
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
