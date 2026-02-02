import { type NextRequest, NextResponse } from 'next/server';

/**
 * Routes configuration
 */
const AUTH_ROUTES = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
] as const;
const PUBLIC_ROUTES = ['/', '/privacy-policy', '/terms-of-service'] as const;
const API_PREFIX = '/api';

const matchesRoute = (pathname: string, routes: readonly string[]): boolean => {
  return routes.some((route) => pathname.startsWith(route));
};

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const _isAuthRoute = matchesRoute(pathname, AUTH_ROUTES);
  const isApiRoute = pathname.startsWith(API_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(
    pathname as (typeof PUBLIC_ROUTES)[number],
  );

  if (isApiRoute && request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // Skip auth check for API routes and public pages
  if (isApiRoute || isPublicRoute) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  // Simple session management - modify based on your better-auth setup
  // For now, just allow all routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
