import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth/auth';
export const runtime = 'nodejs';
const handlers = toNextJsHandler(auth);
function unavailable(
  message = 'Authentication service is not configured yet.',
) {
  return Response.json(
    { message, error: message, code: 'AUTH_NOT_CONFIGURED' },
    { status: 503 },
  );
}
export async function POST(req: Request) {
  if (!process.env.MONGODB_URI) return unavailable();
  const path = new URL(req.url).pathname;
  const needsEmail = [
    '/sign-up/email',
    '/sign-in/email',
    '/send-verification-email',
    '/request-password-reset',
  ].some((route) => path.endsWith(route));
  if (needsEmail && (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD))
    return unavailable('Email verification delivery is not configured yet.');
  if (path.endsWith('/sign-in/social')) {
    const body = await req
      .clone()
      .json()
      .catch(() => null);
    if (
      body?.provider === 'google' &&
      (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
    )
      return unavailable('Google sign-in is not configured yet.');
  }
  return handlers.POST(req);
}
export async function GET(req: Request) {
  if (!process.env.MONGODB_URI) return unavailable();
  return handlers.GET(req);
}
