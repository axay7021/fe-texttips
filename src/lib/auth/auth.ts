import { stripe } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';

import { MongoClient } from 'mongodb';
import config from '@/config';

const client = new MongoClient(
  config.MONGODB_URI || 'mongodb://localhost:27017/better-auth-db',
);
const db = client.db();

import { STRIPE_PLANS, stripeClient } from '@/lib/stripe';
import { sendEmailVerificationEmail, sendPasswordResetEmail } from '../email';

export const auth = betterAuth({
  appName: 'TextTips',
  user: {
    modelName: 'users',
  },
  session: {
    modelName: 'sessions',
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url });
    },
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmailVerificationEmail({ user, url });
    },
  },
  socialProviders: {
    github: {
      clientId: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
    },
    google: {
      prompt: 'select_account',
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [
    nextCookies(),
    stripe({
      stripeClient,
      stripeWebhookSecret: config.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: STRIPE_PLANS,
      },
    }),
  ],

  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),

  // databaseHooks: {
  //   user: {
  //     create: {
  //       after: async (user, _context) => {
  //         await dbConnect();

  //         const freePlan = await Plan.findOne({
  //           name: "Free",
  //         });
  //         if (!freePlan) {
  //           throw new Error("Free plan not found");
  //         }

  //         const startDate = new Date();
  //         const endDate = new Date();
  //         endDate.setMonth(startDate.getMonth() + 1);

  //         await Subscription.create({
  //           user: user.id,
  //           plan: freePlan._id,
  //           stripeCustomerId: user.id,
  //           isActive: true,
  //           startDate,
  //           endDate,
  //         });
  //       },
  //     },
  //   },
  // },
});
