'use client';

import React from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { UserRole } from '../../lib/types';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';

interface RouteGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RouteGuard({ allowedRoles, children }: RouteGuardProps) {
  const { role, switchRole } = useAuth();

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  const roleNameMap: Record<UserRole, string> = {
    candidate: 'Candidate / Job Seeker',
    employer: 'Employer / Recruiter',
    admin: 'Platform Administrator',
  };

  const targetAllowedRole = allowedRoles[0];

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Restricted Access</h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          This portal section requires{' '}
          <strong className="text-slate-900">{allowedRoles.map((r) => roleNameMap[r]).join(' or ')}</strong>{' '}
          permissions. You are currently browsing in{' '}
          <span className="font-semibold text-indigo-600">{roleNameMap[role]}</span> mode.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => switchRole(targetAllowedRole)}
            variant="primary"
            className="w-full"
            leftIcon={<UserCheck className="w-4 h-4" />}
          >
            Switch to {roleNameMap[targetAllowedRole]} (Demo Mode)
          </Button>

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
