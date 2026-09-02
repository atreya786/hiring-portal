'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/context/AuthContext';
import { Button } from '../ui/Button';
import {
  Briefcase,
  Building2,
  BookOpen,
  User,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Bookmark,
  Bell,
  CheckCircle2,
  Users,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Find Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Companies', href: '/companies', icon: Building2 },
    { label: 'Career Resources', href: '/resources', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-200/60 group-hover:scale-105 transition-transform">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Sallet<span className="text-indigo-600">Hire</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                  by Sallet IT Soft
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors',
                      isActive
                        ? 'text-indigo-600 bg-indigo-50/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    )}
                  >
                    <Icon className="w-4 h-4 opacity-70" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {role === 'candidate' && (
              <Link href="/employer/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Building2 className="w-3.5 h-3.5" />}
                  className="text-xs font-semibold text-slate-600"
                >
                  For Employers
                </Button>
              </Link>
            )}

            {role === 'employer' && (
              <Link href="/employer/post-job">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                  className="text-xs font-semibold"
                >
                  Post a Job
                </Button>
              </Link>
            )}

            {/* Role-Specific Portal Button & Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 bg-slate-100/80 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors cursor-pointer text-left"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.name || 'User'}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium capitalize">
                    {role === 'candidate' ? 'Candidate Portal' : role === 'employer' ? 'Recruiter ATS' : 'Admin Portal'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>

                  {role === 'candidate' && (
                    <div className="py-1">
                      <Link
                        href="/candidate/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Candidate Dashboard</span>
                      </Link>
                      <Link
                        href="/candidate/applications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>My Applications</span>
                      </Link>
                      <Link
                        href="/candidate/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </Link>
                      <Link
                        href="/candidate/resume"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Resume Builder</span>
                      </Link>
                      <Link
                        href="/candidate/saved-jobs"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Saved Jobs</span>
                      </Link>
                      <Link
                        href="/candidate/alerts"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Job Alerts</span>
                      </Link>
                    </div>
                  )}

                  {role === 'employer' && (
                    <div className="py-1">
                      <Link
                        href="/employer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>ATS Dashboard</span>
                      </Link>
                      <Link
                        href="/employer/post-job"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Post a New Job</span>
                      </Link>
                      <Link
                        href="/employer/jobs"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Manage Postings</span>
                      </Link>
                      <Link
                        href="/employer/applicants"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Candidate Pipeline</span>
                      </Link>
                      <Link
                        href="/employer/company"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Company Profile</span>
                      </Link>
                    </div>
                  )}

                  {role === 'admin' && (
                    <div className="py-1">
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Command Center</span>
                      </Link>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <Link
                      href="/auth/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Switch Account / Sign In</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold',
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Your Workspace ({role})
            </p>
            {role === 'candidate' && (
              <>
                <Link
                  href="/candidate/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                  <span>Candidate Dashboard</span>
                </Link>
                <Link
                  href="/candidate/applications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>My Applications</span>
                </Link>
                <Link
                  href="/candidate/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Edit Profile</span>
                </Link>
                <Link
                  href="/candidate/resume"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Resume Builder</span>
                </Link>
              </>
            )}

            {role === 'employer' && (
              <>
                <Link
                  href="/employer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                  <span>ATS Dashboard</span>
                </Link>
                <Link
                  href="/employer/post-job"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>Post a Job</span>
                </Link>
                <Link
                  href="/employer/applicants"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Candidate Pipeline</span>
                </Link>
              </>
            )}

            {role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Admin Command Center</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
