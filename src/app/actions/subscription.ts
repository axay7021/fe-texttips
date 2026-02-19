'use server';

import type { Subscription } from '@better-auth/stripe';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';

export const getUserSubscription = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return [];
    }

    // const subscriptions = await auth.api.listActiveSubscriptions({
    //   query: {
    //     referenceId: session?.user?.id,
    //     customerType: 'user',
    //   },
    //   // This endpoint requires session cookies.
    //   headers: await headers(),
    // });
    const subscriptions: Subscription[] = [];

    // Validated against custom Subscription model
    const SubscriptionModel = (await import('@/models/subscription.model'))
      .default;
    const customSub = await SubscriptionModel.findOne({
      userId: session.user.id,
      status: 'active',
    });

    if (customSub) {
      // Map custom subscription to Better Auth Subscription interface shape
      const mappedSub: Subscription = {
        id: customSub._id.toString(),
        status:
          customSub.status === 'cancelled'
            ? 'canceled'
            : (customSub.status as
                | 'active'
                | 'canceled'
                | 'past_due'
                | 'unpaid'
                | 'trialing'
                | 'paused'
                | 'incomplete'
                | 'incomplete_expired'),
        plan: customSub.planId,
        periodStart: customSub.currentPeriodStart,
        periodEnd: customSub.currentPeriodEnd,
        referenceId: session.user.id,
      };

      return [mappedSub, ...subscriptions];
    }

    // If no custom subscription and no Better Auth subscription, auto-provision trial
    if (subscriptions.length === 0) {
      // console.log('Auto-provisioning Plus Trial for user:', session.user.id);
      const now = new Date();
      const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const newSub = await SubscriptionModel.create({
        userId: session.user.id,
        planId: 'Plus',
        status: 'active',
        usageCount: 0,
        planLimit: 10000,
        currentPeriodStart: now,
        currentPeriodEnd: oneMonthLater,
        startDate: now,
        // endDate represents the absolute end of the subscription if it doesn't renew.
        // Since we want it to expire after 1 month and NOT renew automatically:
        endDate: oneMonthLater,
      });

      const mappedNewSub: Subscription = {
        id: newSub._id.toString(),
        status:
          newSub.status === 'cancelled'
            ? 'canceled'
            : (newSub.status as
                | 'active'
                | 'canceled'
                | 'past_due'
                | 'unpaid'
                | 'trialing'
                | 'paused'
                | 'incomplete'
                | 'incomplete_expired'),
        plan: newSub.planId,
        periodStart: newSub.currentPeriodStart,
        periodEnd: newSub.currentPeriodEnd,
        referenceId: session.user.id,
      };
      return [mappedNewSub];
    }

    return subscriptions as Subscription[];
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Error logging
    console.log({ error });
    return [];
  }
};

export const upgradeToPlus = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Import Subscription model dynamically or ensure it's available
    const Subscription = (await import('@/models/subscription.model')).default;

    // Update or create subscription for Plus plan
    await Subscription.findOneAndUpdate(
      { userId: session.user.id },
      {
        planId: 'Plus',
        status: 'active',
        // Reset usage on upgrade? Or keep? Let's reset for fresh start on new plan
        usageCount: 0,
        planLimit: 10000,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        startDate: new Date(),
        endDate: undefined,
      },
      { upsert: true, new: true },
    );

    return { success: true };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Error logging
    console.error('Upgrade Error:', error);
    return { success: false, error: 'Upgrade failed' };
  }
};
