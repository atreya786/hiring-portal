import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, verifyToken } from './lib/server/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;

  // 1. If user is visiting the login page while already authenticated
  if (pathname === '/auth/login') {
    if (payload) {
      if (payload.role === 'candidate') {
        return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
      }
      if (payload.role === 'recruiter' || payload.role === 'employer') {
        return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
      }
      if (payload.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Candidate Dashboard & Protected Routes
  if (pathname.startsWith('/candidate')) {
    if (!payload) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Block non-candidates from candidate dashboard
    if (payload.role !== 'candidate') {
      if (payload.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 3. Recruiter / Employer Dashboard & Protected Routes
  if (pathname.startsWith('/recruiter') || pathname.startsWith('/employer')) {
    if (!payload) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Block non-recruiters from recruiter/employer dashboard
    if (payload.role !== 'recruiter' && payload.role !== 'employer') {
      if (payload.role === 'candidate') {
        return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 4. Admin Dashboard & Protected Routes
  if (pathname.startsWith('/admin')) {
    if (!payload) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Block non-admins from admin dashboard
    if (payload.role !== 'admin') {
      if (payload.role === 'candidate') {
        return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/candidate/:path*',
    '/recruiter/:path*',
    '/employer/:path*',
    '/admin/:path*',
    '/auth/login',
  ],
};
