'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RouteGuard } from '../../components/auth/RouteGuard';
import {
  LayoutDashboard,
  CheckCircle2,
  User,
  FileText,
  Bookmark,
  Bell,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const subNavItems = [
    { label: 'Overview', href: '/candidate/dashboard', icon: LayoutDashboard },
    { label: 'Applications', href: '/candidate/applications', icon: CheckCircle2 },
    { label: 'Edit Profile', href: '/candidate/profile', icon: User },
    { label: 'Resume Builder', href: '/candidate/resume', icon: FileText },
    { label: 'Saved Jobs', href: '/candidate/saved-jobs', icon: Bookmark },
    { label: 'Job Alerts', href: '/candidate/alerts', icon: Bell },
  ];

  return (
    <RouteGuard allowedRoles={['candidate']}>
      <div className="bg-slate-50 min-h-screen">
        {/* Candidate Sub-navigation Header */}
        <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-1 py-2">
              {subNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 opacity-80" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </RouteGuard>
  );
}
