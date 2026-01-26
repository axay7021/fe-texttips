import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/auth");
  const isApiRoute = pathname.startsWith("/api");
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms-of-service";

  // Handle CORS preflight requests for API routes
  if (isApiRoute && request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  // Skip auth check for API routes and the landing page
  if (isApiRoute || isPublicRoute) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  }

  const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const session = await res.json();

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except specific exclusions
    // We removed 'auth' from the exclusion list so the proxy runs on auth pages too
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
