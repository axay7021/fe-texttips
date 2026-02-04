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

    const subscriptions = await auth.api.listActiveSubscriptions({
      query: {
        referenceId: session?.user?.id,
        customerType: 'user',
      },
      // This endpoint requires session cookies.
      headers: await headers(),
    });

    return subscriptions as Subscription[];
  } catch (error) {
    console.log({ error });
    return [];
  }
};
