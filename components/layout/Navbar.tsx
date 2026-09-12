"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/context/AuthContext";
import { Button } from "../ui/Button";
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
  LogIn,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../lib/context/ThemeContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, role, isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Find Jobs", href: "/jobs", icon: Briefcase },
    { label: "Companies", href: "/companies", icon: Building2 },
    { label: "Career Resources", href: "/resources", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="Sallet Hire"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                  Sallet
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Hire
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase mt-0.5">
                  by Sallet IT Soft
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60",
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
            {/* Dark / Light Mode Toggle Button (Icon-only) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-750 transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {!isLoggedIn ? (
              <Link href="/auth/login">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<LogIn className="w-3.5 h-3.5" />}
                  className="font-bold text-xs shadow-xs"
                >
                  Sign In
                </Button>
              </Link>
            ) : (
              <>
                {(role === "recruiter" || role === "employer") && (
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
                    className="flex items-center gap-2.5 p-1.5 pl-3 bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {user?.name || "User"}
                      </span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                        {role === "candidate"
                          ? "Candidate Portal"
                          : role === "recruiter" || role === "employer"
                            ? "Recruiter ATS"
                            : "Admin Portal"}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user?.name ? user.name.charAt(0) : "U"}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {role === "candidate" && (
                        <div className="py-1">
                          <Link
                            href="/candidate/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>Candidate Dashboard</span>
                          </Link>
                          <Link
                            href="/candidate/applications"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>My Applications</span>
                          </Link>
                          <Link
                            href="/candidate/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>Edit Profile</span>
                          </Link>
                        </div>
                      )}

                      {(role === "recruiter" || role === "employer") && (
                        <div className="py-1">
                          <Link
                            href="/recruiter/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>Recruiter ATS Dashboard</span>
                          </Link>
                          <Link
                            href="/employer/post-job"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Post a New Job</span>
                          </Link>
                          <Link
                            href="/employer/jobs"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Manage Postings</span>
                          </Link>
                          <Link
                            href="/employer/applicants"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>Candidate Pipeline</span>
                          </Link>
                        </div>
                      )}

                      {role === "admin" && (
                        <div className="py-1">
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Admin Command Center</span>
                          </Link>
                        </div>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 transition-colors cursor-pointer text-left font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Header Buttons */}
          <div className="flex md:hidden items-center gap-2">
            {/* Dark / Light Mode Toggle Button for Mobile (Icon-only) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-750 transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
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
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                  )}
                >
                  <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {!isLoggedIn ? (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="px-3 py-1 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {role} Account
                  </p>
                </div>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
                Your Workspace
              </p>
              {role === "candidate" && (
                <>
                  <Link
                    href="/candidate/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Candidate Dashboard</span>
                  </Link>
                  <Link
                    href="/candidate/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>My Applications</span>
                  </Link>
                  <Link
                    href="/candidate/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Edit Profile</span>
                  </Link>
                  <Link
                    href="/candidate/resume"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Resume Builder</span>
                  </Link>
                </>
              )}

              {(role === "employer" || role === "recruiter") && (
                <>
                  <Link
                    href="/recruiter/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>ATS Dashboard</span>
                  </Link>
                  <Link
                    href="/employer/post-job"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Post a Job</span>
                  </Link>
                  <Link
                    href="/employer/applicants"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Candidate Pipeline</span>
                  </Link>
                </>
              )}

              {role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Admin Command Center</span>
                </Link>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
