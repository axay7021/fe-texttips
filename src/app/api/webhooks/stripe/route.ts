import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import { stripe } from '@/lib/stripe';
import Subscription from '@/models/subscription/subscription.model';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  await dbConnect();

  // Handle specific events
  if (event.type === 'checkout.session.completed') {
    // biome-ignore lint/suspicious/noConsole: Allow logging
    console.log('👉 Checkout session completed:', session.id);
    const subscriptionId = session.subscription as string;
    // biome-ignore lint/suspicious/noConsole: Allow logging
    console.log('👉 Subscription ID:', subscriptionId);

    if (subscriptionId) {
      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId,
      )) as any;
      // biome-ignore lint/suspicious/noConsole: Allow logging
      console.log('👉 Retrieved subscription from Stripe:', subscription.id);

      // Get the Plan ID we stored in metadata during checkout
      const planId = session.metadata?.planId;
      const userId = session.metadata?.userId;
      // biome-ignore lint/suspicious/noConsole: Allow logging
      console.log('👉 Metadata:', session.metadata);

      if (userId && planId) {
        // biome-ignore lint/suspicious/noConsole: Allow logging
        console.log('👉 Updating DB for user:', userId, 'plan:', planId);
        // biome-ignore lint/suspicious/noConsole: Allow logging
        console.log('👉 Raw Dates:', {
          start: subscription.current_period_start,
          end: subscription.current_period_end,
        });

        const startDate =
          typeof subscription.current_period_start === 'number'
            ? new Date(subscription.current_period_start * 1000)
            : new Date();

        const endDate =
          typeof subscription.current_period_end === 'number'
            ? new Date(subscription.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // Try updating by User ID
        let updated = await Subscription.findOneAndUpdate(
          { user: userId },
          {
            stripeCustomerId: session.customer as string,
            plan: planId,
            isActive: true,
            startDate: startDate,
            endDate: endDate,
          },
          { new: true },
        );

        // If not found by User ID, try finding by Stripe Customer ID (fallback)
        if (!updated) {
          // biome-ignore lint/suspicious/noConsole: Allow logging
          console.warn(
            '⚠️ Could not find subscription by userId, trying stripeCustomerId...',
          );
          updated = await Subscription.findOneAndUpdate(
            { stripeCustomerId: session.customer as string },
            {
              // We might not want to overwrite 'user' depending on logic, but we must update the plan
              plan: planId,
              isActive: true,
              startDate: startDate,
              endDate: endDate,
            },
            { new: true },
          );
        }

        // biome-ignore lint/suspicious/noConsole: Allow logging
        console.log('👉 DB Update Result:', updated);
      } else {
        // biome-ignore lint/suspicious/noConsole: Allow logging
        console.error('❌ Missing userId or planId in metadata');
      }
    } else {
      // biome-ignore lint/suspicious/noConsole: Allow logging
      console.error('❌ No subscription ID found in session');
    }
  }

  // Handle renewals (Stripe automatically charges next month)
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as any;
    const subscriptionId = invoice.subscription as string;

    if (subscriptionId) {
      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId,
      )) as any;

      await Subscription.findOneAndUpdate(
        { stripeCustomerId: invoice.customer as string },
        {
          startDate: new Date(subscription.current_period_start * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
          isActive: true,
        },
      );
    }
  }

  return new NextResponse(null, { status: 200 });
}
