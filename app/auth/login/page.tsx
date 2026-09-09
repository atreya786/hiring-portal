'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/context/AuthContext';
import { useToast } from '../../../lib/context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const { user, role, isLoggedIn, login } = useAuth();
  const { success } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to appropriate role dashboard
  useEffect(() => {
    if (isLoggedIn && user) {
      const destination =
        role === 'admin'
          ? '/admin/dashboard'
          : role === 'recruiter' || role === 'employer'
          ? '/recruiter/dashboard'
          : '/candidate/dashboard';
      router.replace(destination);
    }
  }, [isLoggedIn, user, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || 'Invalid email or password.');
        setIsSubmitting(false);
        return;
      }

      success('Login Successful', 'Welcome to Sallet Hire.');

      // Prefer backend redirectTo, then returnUrl, or default
      const destination = returnUrl || result.redirectTo || '/admin/dashboard';
      router.push(destination);
    } catch (err) {
      console.error('Login submit error:', err);
      setError('Invalid email or password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Sallet IT Soft"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign in to Sallet Hire
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs font-semibold animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form: Email, Password, Show/Hide Password, Login Button ONLY */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="user@example.com"
            required
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>
        </form>
        {/* Footer info */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/auth/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
