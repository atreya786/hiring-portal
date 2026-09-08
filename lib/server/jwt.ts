import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from '../types';

export const AUTH_COOKIE_NAME = 'sallet_auth_token';

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'sallet-hiring-portal-secret-key-bhubaneswar-2026'
);

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
  [key: string]: any;
}

/**
 * Sign a JWT token valid for 7 days
 */
export async function signToken(user: {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as TokenPayload;
  } catch (err) {
    return null;
  }
}
