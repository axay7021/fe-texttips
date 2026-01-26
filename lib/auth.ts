import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://localhost:27017/better-auth-db",
);
const db = client.db();

import { sendEmail } from "./email";
import Plan from "@/app/models/plan/plan.model";
import dbConnect from "./mongodb";
import Subscription from "@/app/models/subscription/subscription.model";
import { IPlan } from "@/app/models/plan/plan.types";

export const auth = betterAuth({
  plugins: [],
  appName: "My Better Auth App",
  experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    sendResetPassword: async ({ user, url, token }) => {
      console.log(`Attempting to send reset password email to: ${user.email}`);
      const { success, error } = await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `Click the link to reset your password: <a href="${url}">Reset Password</a>`,
      });

      if (!success) {
        console.error("Failed to send reset email:", error);
      } else {
        console.log("Reset email sent successfully");
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      console.log("Verify your email by clicking here:", url);
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),
  user: {
    modelName: "users",
  },
  session: {
    modelName: "session",
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
          await dbConnect();

          const freePlan = (await Plan.findOne({
            name: "Free",
          })) as IPlan | null;
          if (!freePlan) {
            throw new Error("Free plan not found");
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
