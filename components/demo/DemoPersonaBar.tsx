'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { UserRole } from '../../lib/types';
import { User, Building2, ShieldAlert, Sparkles, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function DemoPersonaBar() {
  const { role, switchRole, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const personas: Array<{
    role: UserRole;
    name: string;
    title: string;
    icon: typeof User;
    landingPath: string;
  }> = [
    {
      role: 'candidate',
      name: 'Aditya Sharma',
      title: 'Job Seeker (Candidate)',
      icon: User,
      landingPath: '/candidate/dashboard',
    },
    {
      role: 'employer',
      name: 'Priya Nair',
      title: 'Recruiter @ Sallet Tech',
      icon: Building2,
      landingPath: '/employer/dashboard',
    },
    {
      role: 'admin',
      name: 'Ananya Sen',
      title: 'Platform Administrator',
      icon: ShieldAlert,
      landingPath: '/admin',
    },
  ];

  const handleSelectRole = (targetRole: UserRole, landingPath: string) => {
    switchRole(targetRole);
    setIsOpen(false);
    // If on a role-protected route that doesn't match new role, navigate to target landing
    if (
      (targetRole === 'candidate' && (pathname.startsWith('/employer') || pathname.startsWith('/admin'))) ||
      (targetRole === 'employer' && (pathname.startsWith('/candidate') || pathname.startsWith('/admin'))) ||
      (targetRole === 'admin' && pathname.startsWith('/candidate'))
    ) {
      router.push(landingPath);
    }
  };

  const activePersona = personas.find((p) => p.role === role) || personas[0];
  const ActiveIcon = activePersona.icon;

  return (
    <div className="fixed bottom-4 left-4 z-50 select-none">
      {/* Expanded Persona Switcher */}
      {isOpen && (
        <div className="mb-2 p-3 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 w-72 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Persona Switcher</span>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
              Simulation
            </span>
          </div>

          <div className="space-y-1.5">
            {personas.map((p) => {
              const Icon = p.icon;
              const isSelected = p.role === role;
              return (
                <button
                  key={p.role}
                  onClick={() => handleSelectRole(p.role, p.landingPath)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-indigo-700' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold leading-none">{p.name}</p>
                      <p className="text-[11px] opacity-75 mt-0.5">{p.title}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80 text-center">
            Switch persona to evaluate Candidate, Recruiter ATS, or Admin portals.
          </p>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-slate-900 text-white px-3.5 py-2 rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition-all text-xs font-semibold cursor-pointer group"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <ActiveIcon className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-slate-200">
          Demo: <span className="text-white font-bold">{activePersona.name}</span>
        </span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        )}
      </button>
    </div>
  );
}
