import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Mail, Phone, ExternalLink, Heart } from 'lucide-react';
import { DemoBadge } from '../demo/DemoBadge';

export function Footer() {
  const indianCities = [
    'Bhubaneswar',
    'Cuttack',
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Mumbai',
    'Delhi NCR',
    'Noida',
    'Gurugram',
    'Chennai',
    'Kolkata',
    'Remote',
  ];

  const popularRoles = [
    'React Developer',
    'Next.js Engineer',
    'Node.js Backend Developer',
    'DevOps & Cloud Specialist',
    'Data Analyst',
    'Product Designer (UI/UX)',
    'Enterprise Sales Executive',
    'Fresher Trainee Software Engineer',
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-900/50">
                S
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Sallet<span className="text-indigo-400">Hire</span>
              </span>
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Find the right opportunity. Build your career. A modern, AI-ready hiring marketplace & recruitment suite engineered by <strong className="text-white">Sallet IT Soft</strong>.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <DemoBadge variant="banner" />
            </div>

            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Bhubaneswar &bull; Bengaluru &bull; Hyderabad &bull; Global</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>contact@salletitsoft.com</span>
              </p>
            </div>
          </div>

          {/* Job Seekers Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Explore All Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-white transition-colors">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link href="/candidate/dashboard" className="hover:text-white transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/candidate/resume" className="hover:text-white transition-colors">
                  Free Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/candidate/alerts" className="hover:text-white transition-colors">
                  Custom Job Alerts
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Interview Prep Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/employer/post-job" className="hover:text-white transition-colors">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link href="/employer/dashboard" className="hover:text-white transition-colors">
                  Recruiter ATS Portal
                </Link>
              </li>
              <li>
                <Link href="/employer/applicants" className="hover:text-white transition-colors">
                  Applicant Pipeline (Kanban)
                </Link>
              </li>
              <li>
                <Link href="/employer/company" className="hover:text-white transition-colors">
                  Employer Branding
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Hiring Best Practices
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Platform */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Career Insights Blog
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Command Center
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Privacy Policy (Demo)</span>
              </li>
              <li>
                <span className="text-slate-500">Terms of Service (Demo)</span>
              </li>
              <li>
                <span className="text-slate-500">Security & Compliance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Indian Tech Hubs & Roles Quick Links */}
        <div className="py-8 border-b border-slate-900/80 space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-300 mr-2">Tech Hubs:</span>
            <div className="inline-flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-400">
              {indianCities.map((city) => (
                <Link
                  key={city}
                  href={`/jobs?location=${encodeURIComponent(city)}`}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Jobs in {city} &bull;
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-300 mr-2">Top Roles:</span>
            <div className="inline-flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-400">
              {popularRoles.map((r) => (
                <Link
                  key={r}
                  href={`/jobs?query=${encodeURIComponent(r)}`}
                  className="hover:text-indigo-400 transition-colors"
                >
                  {r} &bull;
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Sallet IT Soft. All rights reserved. Sallet Hire is a registered proprietary technology.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Verified Employers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
