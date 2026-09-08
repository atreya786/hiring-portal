'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/context/AuthContext';
import { useToast } from '../../../lib/context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Tabs } from '../../../components/ui/Tabs';
import { UserRole } from '../../../lib/types';
import { User, Building2, Lock, Mail, Phone, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const { switchRole } = useAuth();
  const { success } = useToast();
  const router = useRouter();

  const [accountType, setAccountType] = useState<'candidate' | 'employer'>('candidate');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountType === 'candidate') {
      switchRole('candidate');
      success('Candidate Account Created', 'Welcome to Sallet Hire! Your profile is ready.');
      router.push('/candidate/dashboard');
    } else {
      switchRole('employer');
      success('Employer Account Created', 'Welcome to Sallet Recruiter ATS!');
      router.push('/employer/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Sallet Hire"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Join Sallet Hire</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create an account to start applying or hiring top talent
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setAccountType('candidate')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              accountType === 'candidate'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Job Seeker</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('employer')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              accountType === 'employer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Employer / Recruiter</span>
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label={accountType === 'candidate' ? 'Full Name' : 'Recruiter Name'}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={accountType === 'candidate' ? 'Aditya Sharma' : 'Priya Nair'}
            required
            leftIcon={<User className="w-4 h-4" />}
          />

          {accountType === 'employer' && (
            <Input
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Sallet IT Soft Pvt. Ltd."
              required
              leftIcon={<Building2 className="w-4 h-4" />}
            />
          )}

          <Input
            label={accountType === 'candidate' ? 'Email Address' : 'Work Email'}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={accountType === 'candidate' ? 'aditya@example.com' : 'priya@company.com'}
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Create Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button type="submit" variant="primary" size="md" className="w-full font-bold">
            {accountType === 'candidate' ? 'Create Candidate Profile' : 'Create Employer ATS Account'}
          </Button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-indigo-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
