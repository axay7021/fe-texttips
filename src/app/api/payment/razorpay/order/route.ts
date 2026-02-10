import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import razorpay from '@/lib/razorpay';
import Subscription from '@/models/subscription.model';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, planId, currency = 'INR' } = body;

    // Handle Free Plan (Bypass Payment)
    // You might want to use a specific ID or just check amount/planId
    if (planId === 'free' || planId === 'price_1SuQ47GZZeG7RU0Jpl7A1KBS') {
      // Update or create subscription
      await Subscription.findOneAndUpdate(
        { userId: session.user.id },
        {
          planId: planId,
          status: 'active',
          startDate: new Date(),
          // Initialize for new period
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          usageCount: 0,
          planLimit: 500, // Hardcoded limit for the 'free' plan, or fetch from plan details
          endDate: undefined, // Unlimited duration unless specified
        },
        { upsert: true, new: true },
      );

      return NextResponse.json({
        message: 'Free plan activated successfully',
        success: true,
        bypassPayment: true,
      });
    }

    // Normal Razorpay Order Creation
    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency,
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        planId,
        userId: session.user.id,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    // biome-ignore lint/suspicious/noConsole: Error logging
    console.error('Razorpay Error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 },
    );
  }
}
