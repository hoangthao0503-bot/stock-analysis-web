import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the session token from cookies
  const sessionToken = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

  const { pathname } = request.nextUrl;

  // If the user is authenticated and tries to access the login page,
  // redirect them instantly to the home page.
  if (sessionToken && pathname === '/dang-nhap') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dang-nhap'],
};
