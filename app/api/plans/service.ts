"use server";

import dbConnect from "@/lib/mongodb";
import Plan from "@/app/models/plan/plan.model";
import Subscription from "@/app/models/subscription/subscription.model";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

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
    console.error("Error fetching plans from DB:", error);
  }

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
    .populate("plan") // Fill in the plan details (name, features, etc)
    .lean();

  if (!subscription) {
    return null;
  }

  // Fetch upcoming invoice from Stripe to get next billing details
  let nextBilling = null;
  if (subscription.isActive && !subscription.cancelAtPeriodEnd && subscription.stripeCustomerId) {
    try {
      const upcomingInvoice = await stripe.invoices.createPreview({
        customer: subscription.stripeCustomerId,
        subscription: subscription.stripeSubscriptionId,
      });
      nextBilling = {
        amount: upcomingInvoice.amount_due / 100,
        date: upcomingInvoice.next_payment_attempt ? new Date(upcomingInvoice.next_payment_attempt * 1000).toISOString() : null,
      };
    } catch (error) {
      console.log("Could not fetch upcoming invoice (might be cancelled or null):", error);
    }
  }


  // Serialize the nested data structures
  return {
    ...subscription,
    _id: subscription._id.toString(),
    user: subscription.user.toString(),
    // Handle the populated plan object
    plan: {
      // @ts-ignore - we know this is populated now
      ...subscription.plan,
      // @ts-ignore
      _id: subscription.plan._id.toString(),
    },
    startDate: subscription.startDate.toISOString(),
    endDate: subscription.endDate.toISOString(),
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    nextBilling
  };
}
