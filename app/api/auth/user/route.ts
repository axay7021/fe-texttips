import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(_request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      uid: session.user.id,
      email: session.user.email,
      name: session.user.name,
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Allow logging
    console.error('Get User Error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
