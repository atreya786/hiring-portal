import { NextResponse } from 'next/server';
import { authenticateAcrossCollections } from '../../../../lib/server/collections';
import { signToken, AUTH_COOKIE_NAME } from '../../../../lib/server/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const authResult = await authenticateAcrossCollections(email, password);

    if (!authResult) {
      // Generic error: never leaks existence of email in any collection
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const { user, role, redirectTo } = authResult;

    // Sign JWT session token
    const token = await signToken({
      id: user.id,
      email: user.email,
      role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user,
      role,
      redirectTo,
    });

    // Set secure httpOnly session cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
