import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(_request: Request) {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return NextResponse.json({ status: 'logged_out' });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Allow logging
    console.error('Logout Error:', error);
    return NextResponse.json({ status: 'logged_out' });
  }
}
