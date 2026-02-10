import crypto from 'node:crypto';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import config from '@/config';
import { auth } from '@/lib/auth/auth';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', config.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database update logic here
      // For now, we just acknowledge visibility

      return NextResponse.json({
        message: 'Payment verified successfully',
        success: true,
      });
    }

    return NextResponse.json(
      { message: 'Invalid signature', success: false },
      { status: 400 },
    );
  } catch (error: any) {
    // biome-ignore lint/suspicious/noConsole: Error logging
    console.error('Razorpay Verify Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 },
    );
  }
}
