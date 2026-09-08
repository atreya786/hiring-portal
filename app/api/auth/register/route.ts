import { NextResponse } from 'next/server';
import { registerUserInDb } from '@/lib/server/collections';
import { AUTH_COOKIE_NAME, signToken } from '@/lib/server/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role, phone, companyName } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const registrationResult = await registerUserInDb({
      email,
      password,
      name,
      role: role || 'candidate',
      phone,
      companyName,
    });

    if (!registrationResult.success || !registrationResult.user) {
      return NextResponse.json(
        { success: false, error: registrationResult.error || 'Registration failed.' },
        { status: 400 }
      );
    }

    const { user } = registrationResult;
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const redirectTo =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'recruiter'
        ? '/recruiter/dashboard'
        : '/candidate/dashboard';

    const response = NextResponse.json({
      success: true,
      user,
      role: user.role,
      redirectTo,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error occurred during registration.' },
      { status: 500 }
    );
  }
}
