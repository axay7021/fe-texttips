
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Payment, { IPayment } from "@/app/models/payment/payment.model";
import User from "@/app/models/user/user.model";

export async function getPaymentHistory() {
    await dbConnect();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) return [];

    const payments = await Payment.find({ user: session.user.id })
        .sort({ createdAt: -1 })
        .lean();

    // Serialize for client component
    return JSON.parse(JSON.stringify(payments));
}

import { stripe } from "@/lib/stripe";

export async function getUserCreditBalance() {
    await dbConnect();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) return 0;

    const user = await User.findById(session.user.id);
    if (!user || !user.stripeCustomerId) return 0;

    try {
        // Fetch directly from Stripe to ensure source of truth
        const customer = await stripe.customers.retrieve(user.stripeCustomerId) as any;

        // Stripe balance: Negative means credit (we owe them). Positive means debit (they owe us).
        // We want to display "Credit Available", so we invert the negative balance.
        const stripeBalanceCents = customer.balance || 0;
        let creditBalanceDollars = 0;

        // Only count negative balance (credit) as available funds
        if (stripeBalanceCents < 0) {
            creditBalanceDollars = Math.abs(stripeBalanceCents) / 100;
        }

        // Sync to DB if different
        if (user.creditBalance !== creditBalanceDollars) {
            console.log(`🔄 Syncing Stripe Balance ($${creditBalanceDollars}) to DB`);
            user.creditBalance = creditBalanceDollars;
            await user.save();
        }

        return creditBalanceDollars;

    } catch (err) {
        console.error("Error fetching Stripe balance:", err);
        // Fallback to DB
        return user.creditBalance || 0;
    }
}
