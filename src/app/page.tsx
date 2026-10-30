import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { WritingDesk } from '@/components/writing-desk';
import { auth } from '@/lib/auth/auth';

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/dashboard');
  }

  const provider = process.env.AI_PROVIDER || 'google';
  const providerKey =
    provider === 'openai'
      ? process.env.OPENAI_API_KEY
      : provider === 'anthropic'
        ? process.env.ANTHROPIC_API_KEY
        : process.env.GEMINI_API_KEY;
  return (
    <WritingDesk ready={Boolean(providerKey && process.env.MONGODB_URI)} />
  );
}
