import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Your better-auth instance
import dbConnect from '@/lib/mongodb';
import { stripe } from '@/lib/stripe';
import Plan from '@/models/plan/plan.model';
import Subscription from '@/models/subscription/subscription.model';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { planId } = await req.json();

    await dbConnect();

    // 1. Get the plan details from DB
    const plan = await Plan.findById(planId);
    if (!plan) return new NextResponse('Plan not found', { status: 404 });

    // 2. Get user's current subscription to find their Stripe Customer ID
    const subscription = await Subscription.findOne({ user: session.user.id });

    let stripeCustomerId = subscription?.stripeCustomerId;

    // FIX: If the currenet stripeCustomerId is just the user.id (from your seed script),
    // we need to create a REAL Stripe Customer.
    if (!stripeCustomerId || stripeCustomerId === session.user.id) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          userId: session.user.id,
        },
      });
      stripeCustomerId = customer.id;

      // Save this real ID back to your DB so we don't create it again
      if (subscription) {
        subscription.stripeCustomerId = stripeCustomerId;
        await subscription.save();
      }
    }

    // 3. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: Math.round(plan.priceUsd * 100), // Stripe expects cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        planId: planId, // Important: Pass the plan ID so our webhook knows what they bought
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Allow logging
    console.error('[STRIPE_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
