import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Plan from "@/app/models/plan/plan.model";
import Subscription from "@/app/models/subscription/subscription.model";
import User from "@/app/models/user/user.model";
import Payment from "@/app/models/payment/payment.model";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { planId } = await req.json();

    await dbConnect();

    // 1. Get the plan details from DB
    const plan = await Plan.findById(planId);
    if (!plan) return new NextResponse("Plan not found", { status: 404 });

    // 2. Get User and ensure Stripe Customer ID
    let user = await User.findById(session.user.id);
    // Explicitly check for null user
    if (!user) {
      // Fallback: If better-auth user exists but Mongoose can't find it (rare), 
      // we might rely on the session, but strictly we should have a user record.
      // For now, let's assume we must find it.
      return new NextResponse("User record not found", { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          userId: session.user.id,
        },
      });
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // 3. Check for EXISTING active subscription
    const currentSubscription = await Subscription.findOne({
      user: session.user.id,
      isActive: true,
    });

    if (currentSubscription && currentSubscription.plan.toString() === planId) {
      return new NextResponse("You are already subscribed to this plan", { status: 400 });
    }

    // 4. Create New Stripe Checkout Session (Full Price)
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product: plan.stripeProductId,
            unit_amount: Math.round(plan.priceUsd * 100),
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        planId: planId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
