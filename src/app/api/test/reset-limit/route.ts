import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import dbConnect from '@/lib/mongodb';
import DailyUsage from '@/models/daily-usage.model';

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await dbConnect();

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const forwardedFor = (await headers()).get('x-forwarded-for');
    let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    if (ip === '::1' || ip === '127.0.0.1') ip = 'localhost';

    const identifier = session ? session.user.id : ip;

    await DailyUsage.deleteOne({ identifier });

    return NextResponse.json({
      success: true,
      message: 'Limit reset successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
