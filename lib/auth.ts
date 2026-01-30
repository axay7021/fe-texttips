import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/better-auth-db',
);
const db = client.db();

import Plan from '@/app/models/plan/plan.model';
import type { IPlan } from '@/app/models/plan/plan.types';
import Subscription from '@/app/models/subscription/subscription.model';
import { sendEmail } from './email';
import dbConnect from './mongodb';

export const auth = betterAuth({
  plugins: [],
  appName: 'My Better Auth App',
  experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    sendResetPassword: async ({ user: _user, url }) => {
      // biome-ignore lint/suspicious/noConsole: Allow logging
      console.log(`Attempting to send reset password email to: ${_user.email}`);
      const { success, error } = await sendEmail({
        to: _user.email,
        subject: 'Reset your password',
        html: `Click the link to reset your password: <a href="${url}">Reset Password</a>`,
      });

      if (!success) {
        // biome-ignore lint/suspicious/noConsole: Allow logging
        console.error('Failed to send reset email:', error);
      } else {
        // biome-ignore lint/suspicious/noConsole: Allow logging
        console.log('Reset email sent successfully');
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user: _user, url }) {
      // biome-ignore lint/suspicious/noConsole: Allow logging
      console.log('Verify your email by clicking here:', url);
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),
  user: {
    modelName: 'users',
  },
  session: {
    modelName: 'session',
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user, _context) => {
          await dbConnect();

          const freePlan = (await Plan.findOne({
            name: 'Free',
          })) as IPlan | null;
          if (!freePlan) {
            throw new Error('Free plan not found');
          }

          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(startDate.getMonth() + 1);

          await Subscription.create({
            user: user.id,
            plan: freePlan._id,
            stripeCustomerId: user.id,
            isActive: true,
            startDate,
            endDate,
          });
        },
      },
    },
  },
});
