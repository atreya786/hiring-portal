'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/context/AuthContext';
import { useToast } from '../../../lib/context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { UserRole } from '../../../lib/types';
import { User, Building2, ShieldCheck, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { switchRole, user } = useAuth();
  const { success } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePersonaLogin = (targetRole: UserRole, destination: string, name: string) => {
    switchRole(targetRole);
    success(`Logged in as ${name}`, `Switched to ${targetRole} persona.`);
    router.push(destination);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePersonaLogin('candidate', '/candidate/dashboard', 'Aditya Sharma');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-indigo-200">
            S
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to Sallet Hire</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Choose a quick demo persona or enter credentials
          </p>
        </div>

        {/* 1-Click Persona Logins for Demo */}
        <div className="space-y-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider pb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Demo Profiles</span>
          </div>

          <button
            type="button"
            onClick={() => handlePersonaLogin('candidate', '/candidate/dashboard', 'Aditya Sharma')}
            className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-indigo-50/50 hover:border-indigo-300 border border-slate-200 rounded-xl transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Candidate (Job Seeker)</p>
                <p className="text-[11px] text-slate-400">Aditya Sharma &bull; 4 Yrs Exp</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handlePersonaLogin('employer', '/employer/dashboard', 'Priya Nair')}
            className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-indigo-50/50 hover:border-indigo-300 border border-slate-200 rounded-xl transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Recruiter / Employer</p>
                <p className="text-[11px] text-slate-400">Priya Nair &bull; Sallet Tech ATS</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handlePersonaLogin('admin', '/admin', 'Ananya Sen')}
            className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-indigo-50/50 hover:border-indigo-300 border border-slate-200 rounded-xl transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Platform Administrator</p>
                <p className="text-[11px] text-slate-400">Ananya Sen &bull; SuperAdmin</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Regular Login Form Simulation */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button type="submit" variant="primary" size="md" className="w-full font-bold">
            Sign In
          </Button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/auth/register" className="font-bold text-indigo-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
