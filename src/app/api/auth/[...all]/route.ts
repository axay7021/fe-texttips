import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth/auth';

export const runtime = 'nodejs'; // ⭐ VERY IMPORTANT

export const { POST, GET } = toNextJsHandler(auth);
