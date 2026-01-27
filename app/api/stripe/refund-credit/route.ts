import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Adjust import based on your auth setup
import dbConnect from "@/lib/mongodb";
import User from "@/app/models/user/user.model";
import Payment from "@/app/models/payment/payment.model";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const user = await User.findById(userId);

        if (!user || !user.creditBalance || user.creditBalance <= 0) {
            return NextResponse.json({ error: "No credit balance available to refund" }, { status: 400 });
        }

        const refundAmountDollars = user.creditBalance;
        const refundAmountCents = Math.round(refundAmountDollars * 100);

        // Find a refundable payment (most recent succeeded payment)
        // We look for a payment that has a stripePaymentId (PaymentIntent) and hasn't been fully refunded.
        // Simplifying: We just try to refund the most recent 'subscription_create' or 'subscription_renew'
        const lastPayment = await Payment.findOne({
            user: userId,
            status: 'succeeded',
            type: { $in: ['subscription_create', 'subscription_renew'] },
            stripePaymentId: { $exists: true }
        }).sort({ createdAt: -1 });

        if (!lastPayment || !lastPayment.stripePaymentId) {
            console.error("Refund Error: No eligible payment found for user", userId);
            console.log("Last Payment Query Result:", lastPayment);
            return NextResponse.json({
                error: "No eligible payment method found to refund to. You may need to make a new payment first."
            }, { status: 400 });
        }

        // Attempt Stripe Refund
        try {
            const refund = await stripe.refunds.create({
                payment_intent: lastPayment.stripePaymentId,
                amount: refundAmountCents, // Stripe expects cents
                reason: 'requested_by_customer',
                metadata: {
                    userId: userId,
                    reason: 'store_credit_cashout'
                }
            });

            // Decrement Balance
            user.creditBalance = 0;
            await user.save();

            // Record Payout in History
            await Payment.create({
                user: userId,
                amount: refundAmountDollars,
                currency: refund.currency,
                status: 'succeeded',
                type: 'payout_refund', // New Types
                stripePaymentId: refund.payment_intent as string,
                stripeInvoiceId: lastPayment.stripeInvoiceId,
                metadata: {
                    refundId: refund.id,
                    note: 'Cashed out store credit'
                }
            });

            return NextResponse.json({ success: true, message: "Refund processed successfully", amount: refundAmountDollars });

        } catch (stripeError: any) {
            console.error("Stripe Refund Error:", stripeError);
            return NextResponse.json({ error: stripeError.message || "Stripe refund failed" }, { status: 500 });
        }

    } catch (error) {
        console.error("Refund API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
