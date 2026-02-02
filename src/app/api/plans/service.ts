'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/plan/plan.model';
import Subscription from '@/models/subscription/subscription.model';

// 1. Fetch Plans (Public)
export async function getPlans() {
  await dbConnect();

  try {
    const plans = await Plan.find({ isActive: true })
      .sort({ priceUsd: 1 })
      .lean();

    if (plans.length > 0) {
      return plans.map((plan: any) => ({
        ...plan,
        _id: plan._id.toString(),
      }));
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Allow logging
    console.error('Error fetching plans from DB:', error);
  }

  // Fallback to JSON if DB is empty or fails
  const plansData = await import('@/models/plan/plan.json');
  const plans = plansData.default || plansData;

  // Add fake _ids and ensure structure matches what UI expects
  return plans.map((plan: any, index: number) => ({
    ...plan,
    _id: `plan_${index}`,
  }));
}

// 2. Fetch User's Subscription (Protected)
export async function getUserSubscription() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  await dbConnect();

  // Find the active subscription for the logged-in user
  // .populate('plan') will replace the plan ID with actual plan details
  const subscription = await Subscription.findOne({
    user: session.user.id,
    isActive: true,
  })
    .populate('plan') // Fill in the plan details (name, features, etc)
    .lean();

  if (!subscription) {
    return null;
  }

  // Serialize the nested data structures
  return {
    ...subscription,
    _id: subscription._id.toString(),
    user: subscription.user.toString(),
    // Handle the populated plan object
    plan: {
      ...subscription.plan,
      _id: subscription.plan._id.toString(),
    },
    startDate: subscription.startDate.toISOString(),
    endDate: subscription.endDate.toISOString(),
  };
}
