import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import dbConnect from '@/lib/mongodb';
import DailyUsage from '@/models/daily-usage.model';
import Subscription from '@/models/subscription.model';

export async function GET(_req: Request) {
  await dbConnect();

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    let limit = 3;
    let usage = 0;
    let type = 'daily';
    let label = 'Free Requests';

    if (session) {
      // Check for active subscription
      const subscription = await Subscription.findOne({
        userId: session.user.id,
        status: 'active',
      });

      if (subscription) {
        const now = new Date();
        if (subscription.currentPeriodEnd > now) {
          limit = subscription.planLimit;
          usage = subscription.usageCount;
          type = 'subscription';
          label = 'Monthly Requests';
        }
      }
    }

    // If not subscribed (or expired), check daily usage
    if (type === 'daily') {
      const forwardedFor = (await headers()).get('x-forwarded-for');
      let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
      if (ip === '::1' || ip === '127.0.0.1') ip = 'localhost';

      const identifier = session ? session.user.id : ip;
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const usageRecord = await DailyUsage.findOne({ identifier });

      if (usageRecord) {
        if (usageRecord.date.getTime() === today.getTime()) {
          usage = usageRecord.count;
        } else {
          usage = 0; // New day
        }
      }
    }

    return NextResponse.json({
      limit,
      usage,
      remaining: Math.max(0, limit - usage),
      type,
      label,
    });
  } catch (error: any) {
    // biome-ignore lint/suspicious/noConsole: Error logging
    console.error('Limit API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
