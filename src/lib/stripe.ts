import type { StripePlan } from '@better-auth/stripe';
// import Stripe from 'stripe';
import config from '@/config';
import plans from '@/utils/plans';

// export const stripeClient = new Stripe(config.STRIPE_SECRET_KEY, {
//   apiVersion: '2025-12-15.clover', // Use the latest version from your VS Code autocomplete or Stripe dash
//   typescript: true,
// });

const STRIPE_PRODUCT_IDS: Record<string, string> = {
  free: 'price_1SuQ47GZZeG7RU0Jpl7A1KBS',
  plus: 'price_1SuQ4SGZZeG7RU0J2B0p87u1',
  pro: 'price_1SuQ4yGZZeG7RU0J0URhbQUn',
  business: 'price_1SuQ5CGZZeG7RU0JzdStvJtb',
};

export const STRIPE_PLANS = plans.map((plan) => ({
  name: plan.name.toLowerCase(),
  priceId: STRIPE_PRODUCT_IDS[plan.name.toLowerCase()],
})) as StripePlan[];
