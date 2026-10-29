import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth/auth';
export const runtime = 'nodejs';
const handlers = toNextJsHandler(auth);
function unavailable() {
  return Response.json({ error: 'Authentication service is not configured yet.', code: 'AUTH_NOT_CONFIGURED' }, { status: 503 });
}
export async function POST(req: Request) {
  if (!process.env.MONGODB_URI || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return unavailable();
  return handlers.POST(req);
}
export async function GET(req: Request) {
  if (!process.env.MONGODB_URI) return unavailable();
  return handlers.GET(req);
}
