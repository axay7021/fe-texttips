import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Subscription from "@/app/models/subscription/subscription.model";
import User from "@/app/models/user/user.model";
import Payment from "@/app/models/payment/payment.model";
import dbConnect from "@/lib/mongodb";
import Stripe from "stripe";

export async function POST(req: Request) {
  //   console.log("🔔 Webhook received! Method:", req.method);
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  //   console.log("🔔 Signature:", signature ? "Present" : "Missing");

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
  if (event.type === "checkout.session.completed") {
    // console.log("👉 Checkout session completed:", session.id);
    const subscriptionId = session.subscription as string;
    // console.log("👉 Subscription ID:", subscriptionId);

    if (subscriptionId) {
      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId,
      )) as any;
      //   console.log("👉 Retrieved subscription from Stripe:", subscription.id);

      // Get the Plan ID we stored in metadata during checkout
      const planId = session.metadata?.planId;
      const userId = session.metadata?.userId;
      //   console.log("👉 Metadata:", session.metadata);

      if (userId && planId) {
        // console.log("👉 Updating DB for user:", userId, "plan:", planId);
        // console.log("👉 Raw Dates:", {
        //   start: subscription.current_period_start,
        //   end: subscription.current_period_end,
        // });

        // Create Dates from Stripe Timestamps (seconds)
        // console.log("👉 Full Subscription Object Keys:", Object.keys(subscription));

        const startDate =
          typeof subscription.current_period_start === "number"
            ? new Date(subscription.current_period_start * 1000)
            : new Date();

        const endDate =
          typeof subscription.current_period_end === "number"
            ? new Date(subscription.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // --- NEW: Handle Overlap / Upgrade (Cancel Old Subs) ---
        try {
          // List all active subscriptions for this customer from Stripe
          const activeSubs = await stripe.subscriptions.list({
            customer: session.customer as string,
            status: 'active',
          });

          // We iterate through them. Any sub that is NOT the current one (subscriptionId) should be cancelled/refunded.
          for (const sub of activeSubs.data) {
            if (sub.id !== subscriptionId) {
              //   console.log(`⚠️ Found overlapping active subscription: ${sub.id}. Cancelling...`);

              // Cancel with proration (Stripe gives credit for unused time)
              await stripe.subscriptions.cancel(sub.id, { prorate: true });

              // Refund Calculation (for DB verification only)
              const subAny = sub as any;

              const start = subAny.current_period_start || subAny.currentPeriodStart;
              const end = subAny.current_period_end || subAny.currentPeriodEnd;

              //   console.log("👉 Sub Dates Debug:", { start, end, keys: Object.keys(subAny) });

              // Defensive check for timestamps
              if (!start || !end) {
                console.warn("⚠️ Missing period start/end on subscription object, skipping refund calc.");
                // Log full object to debug
                // console.log("FULL SUB OBJECT:", JSON.stringify(subAny, null, 2));
                continue;
              }

              const periodStart = start * 1000;
              const periodEnd = end * 1000;
              const totalDuration = periodEnd - periodStart;
              const now = new Date();
              const unusedDuration = periodEnd - now.getTime();

              try {
                // console.log(`📅 Period: ${new Date(periodStart).toISOString()} - ${new Date(periodEnd).toISOString()}`);
              } catch (e) {
                // console.log("📅 Period: Date parsing error");
              }
              //   console.log(`⏱️ Unused Duration (ms): ${unusedDuration}`);

              // Check for invoice
              const latestInvoice = subAny.latest_invoice || subAny.latestInvoice;

              if (latestInvoice) {
                const invoiceId = typeof latestInvoice === 'string'
                  ? latestInvoice
                  : latestInvoice.id;

                const invoice = (await stripe.invoices.retrieve(invoiceId)) as any;

                // console.log(`🧾 Invoice Amount: ${invoice.amount_paid}, Payment Intent: ${invoice.payment_intent}`);

                if (invoice.amount_paid > 0 && unusedDuration > 0) {
                  // We still use payment_intent to enable a refund if needed later, but here we just record the credit
                  const ratio = unusedDuration / totalDuration;
                  const refundAmount = Math.floor(invoice.amount_paid * ratio);
                  //   console.log(`💰 Proration Credit Amount: ${refundAmount}`);

                  if (refundAmount > 0) {
                    // DO NOT call stripe.refunds.create() because prorate:true handles the money side (as credit).

                    // Record Refund/Credit in History
                    await Payment.create({
                      user: userId,
                      amount: refundAmount / 100, // Convert to dollars
                      currency: invoice.currency,
                      status: 'succeeded', // It succeeded as a credit
                      type: 'proration_credit', // Distinguish from cash refund
                      stripePaymentId: invoice.payment_intent as string, // Link to original payment
                      stripeInvoiceId: invoice.id,
                      metadata: {
                        replacedBy: subscriptionId,
                        oldStripeSubId: sub.id,
                        note: 'Stripe Account Credit'
                      }
                    });

                    // Update User Balance (Store Credit)
                    // Convert refundAmount (cents) to dollars for DB
                    const creditDollars = refundAmount / 100;
                    const user = await User.findById(userId);
                    if (user) {
                      user.creditBalance = (user.creditBalance || 0) + creditDollars;
                      await user.save();
                      //   console.log(`💳 Updated User Balance: +$${creditDollars}, New Total: $${user.creditBalance}`);
                    }

                    // console.log(`📝 Recorded proration credit of ${creditDollars} for sub ${sub.id}`);
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error("Error handling overlaps:", err);
        }

        // Try updating by User ID
        let updated = await Subscription.findOneAndUpdate(
          { user: userId },
          {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId, // Store the NEW ID
            plan: planId,
            isActive: true,
            cancelAtPeriodEnd: false,
            startDate: startDate,
            endDate: endDate,
          },
          { new: true, upsert: true, setDefaultsOnInsert: true },
        );

        // console.log("👉 DB Update Result:", updated);

        // RECORD PAYMENT (Initial)
        // Note: checkout.session.completed usually means payment succeeded
        if (session.payment_status === 'paid') {
          // payment_intent is on the session if mode=payment, but for subscription it might be on the invoice.
          // However, session.payment_intent exists if the payment happened during the session.
          // If it's null, we can try to look at the invoice.
          let paymentId = session.payment_intent as string;

          if (!paymentId && session.invoice) {
            // If payment_intent is missing on session (common for subscriptions), fetch from invoice
            const invId = typeof session.invoice === 'string' ? session.invoice : session.invoice.id;
            const inv = await stripe.invoices.retrieve(invId);
            paymentId = inv.payment_intent as string;
          }

          await Payment.create({
            user: userId,
            subscription: updated._id,
            amount: (session.amount_total || 0) / 100, // Convert to dollars
            currency: session.currency || 'usd',
            status: 'succeeded',
            type: 'subscription_create',
            stripePaymentId: paymentId,
            stripeInvoiceId: session.invoice as string,
          });
        }

      } else {
        console.error("❌ Missing userId or planId in metadata");
      }
    } else {
      console.error("❌ No subscription ID found in session");
    }
  }

  // Handle renewals (Stripe automatically charges next month)
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as any;
    const subscriptionId = invoice.subscription as string;

    // Only process renewals, not the initial checkout (checking billing_reason helps)
    if (subscriptionId && invoice.billing_reason === 'subscription_cycle') {
      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId,
      )) as any;

      const updatedSub = await Subscription.findOneAndUpdate(
        { stripeCustomerId: invoice.customer as string },
        {
          startDate: new Date(subscription.current_period_start * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
          isActive: true,
        },
        { new: true }
      );

      if (updatedSub) {
        // Record Renewal Payment
        await Payment.create({
          user: updatedSub.user,
          subscription: updatedSub._id,
          amount: invoice.amount_paid / 100, // Convert to dollars
          currency: invoice.currency,
          status: 'succeeded',
          type: 'subscription_renew',
          stripePaymentId: invoice.payment_intent as string,
          stripeInvoiceId: invoice.id,
        });
      }
    }
  }

  // Handle Cancellations / Updates
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    if (subscription.cancel_at_period_end) {
      //   console.log(`⚠️ Subscription ${subscription.id} set to cancel at period end`);
      await Subscription.findOneAndUpdate(
        {
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id
        },
        { cancelAtPeriodEnd: true }
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    // console.log(`❌ Subscription ${subscription.id} deleted (expired/canceled)`);
    await Subscription.findOneAndUpdate(
      {
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id
      },
      { isActive: false }
    );
  }

  return new NextResponse(null, { status: 200 });
}
