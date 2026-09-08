'use client';

import React from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { UserRole } from '../../lib/types';
import { ShieldAlert, LogIn, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';

interface RouteGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RouteGuard({ allowedRoles, children }: RouteGuardProps) {
  const { role, user, isLoggedIn } = useAuth();

  const isAuthorized =
    isLoggedIn &&
    (allowedRoles.includes(role) ||
      (allowedRoles.includes('employer') && role === 'recruiter') ||
      (allowedRoles.includes('recruiter') && role === 'employer'));

  if (isAuthorized) {
    return <>{children}</>;
  }

  const roleNameMap: Record<UserRole, string> = {
    candidate: 'Candidate / Job Seeker',
    recruiter: 'Recruiter / Employer',
    employer: 'Recruiter / Employer',
    admin: 'Platform Administrator',
  };

  const userDashboard =
    role === 'admin'
      ? '/admin/dashboard'
      : role === 'recruiter' || role === 'employer'
      ? '/recruiter/dashboard'
      : '/candidate/dashboard';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Restricted Access</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          This portal section requires{' '}
          <strong className="text-slate-900 dark:text-white">
            {allowedRoles.map((r) => roleNameMap[r]).join(' or ')}
          </strong>{' '}
          permissions.
          {user ? (
            <> You are currently authenticated as a <span className="font-semibold text-indigo-600 dark:text-indigo-400">{roleNameMap[role]}</span>.</>
          ) : (
            <> Please sign in with an authorized account to continue.</>
          )}
        </p>

        <div className="space-y-3">
          {!isLoggedIn ? (
            <Link href="/auth/login" className="block">
              <Button variant="primary" className="w-full font-bold" leftIcon={<LogIn className="w-4 h-4" />}>
                Sign In
              </Button>
            </Link>
          ) : (
            <Link href={userDashboard} className="block">
              <Button variant="primary" className="w-full font-bold" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                Go to My Dashboard
              </Button>
            </Link>
          )}

          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
