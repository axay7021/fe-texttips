import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Subscription from "@/app/models/subscription/subscription.model";
import User from "@/app/models/user/user.model";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await dbConnect();

        // 1. Find User to get Stripe Customer ID
        const user = await User.findById(session.user.id);
        if (!user || !user.stripeCustomerId) {
            return new NextResponse("No subscription found to cancel", { status: 404 });
        }

        // 2. Find active local subscription
        const currentSubscription = await Subscription.findOne({
            user: session.user.id,
            isActive: true,
        });

        if (!currentSubscription) {
            return new NextResponse("No active subscription found", { status: 404 });
        }

        // 3. Find active Stripe Subscription
        // (We look up by customer ID because we didn't store stripeSubId in our simplified model initially)
        const stripeSubs = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'active',
            limit: 1
        });

        const activeStripeSub = stripeSubs.data[0];

        if (activeStripeSub) {
            // 4. Cancel at period end in Stripe
            await stripe.subscriptions.update(activeStripeSub.id, {
                cancel_at_period_end: true
            });
        }

        // 5. Update Local DB
        currentSubscription.cancelAtPeriodEnd = true;
        await currentSubscription.save();

        return NextResponse.json({ message: "Subscription cancelled at period end" });

    } catch (error) {
        console.error("[STRIPE_CANCEL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
