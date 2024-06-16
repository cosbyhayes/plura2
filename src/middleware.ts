import { authMiddleware, AuthMiddlewareParams } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Custom function to match protected routes
const isProtectedRoute = (pathname: string): boolean => {
  const protectedRoutes = [
    '/subaccount',
    '/agency'
  ];

  return protectedRoutes.some(route => pathname.startsWith(route));
};

const middleware = authMiddleware(async (req: AuthMiddlewareParams) => {
  const { userId, sessionId, getToken } = req.auth;
  const url = req.nextUrl;

  // Check if the route is protected and apply protection if necessary
  if (isProtectedRoute(url.pathname) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const searchParams = url.searchParams.toString();
  const hostname = req.headers.get('host');

  const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // Handle custom subdomain
  const customSubDomain = hostname?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)[0]?.trim();

  if (customSubDomain) {
    return NextResponse.rewrite(new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url));
  }

  // Redirect for sign-in and sign-up
  if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
  }

  // Rewrite for specific paths
  if (url.pathname === '/' || (url.pathname === '/site' && hostname === process.env.NEXT_PUBLIC_DOMAIN)) {
    return NextResponse.rewrite(new URL('/site', req.url));
  }

  if (url.pathname.startsWith('/agency') || url.pathname.startsWith('/subaccount')) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }

  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
