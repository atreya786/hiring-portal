'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobs, getCompanies, getCandidateProfile } from '../lib/services';
import { Job, Company, Candidate } from '../lib/types';
import { ARTICLES, DEMO_PLATFORM_STATS } from '../lib/mock-data';
import { JobSearchHero } from '../components/jobs/JobSearchHero';
import { JobCard } from '../components/jobs/JobCard';
import { JobApplyModal } from '../components/jobs/JobApplyModal';
import { CompanyCard } from '../components/companies/CompanyCard';
import { ArticleCard } from '../components/resources/ArticleCard';
import { DemoBadge, AiComingSoonBadge } from '../components/demo/DemoBadge';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Briefcase,
  Building2,
  Users,
  Search,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  ArrowRight,
  Code,
  DollarSign,
  Megaphone,
  HeartPulse,
  Headphones,
  Cpu,
  Layers,
  Sparkles,
  Star,
  MapPin,
} from 'lucide-react';

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [candidate, setCandidate] = useState<Candidate | undefined>(undefined);
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [jobsData, companiesData, candidateData] = await Promise.all([
        getJobs(),
        getCompanies(),
        getCandidateProfile(),
      ]);
      setJobs(jobsData);
      setCompanies(companiesData);
      setCandidate(candidateData);
    }
    loadData();
  }, []);

  const handleApplyClick = (job: Job) => {
    setSelectedJobToApply(job);
    setIsApplyModalOpen(true);
  };

  const categories = [
    { title: 'IT & Software', count: '640+ Jobs', icon: Code, href: '/jobs?query=Software' },
    { title: 'Sales & Business', count: '180+ Jobs', icon: TrendingUp, href: '/jobs?query=Sales' },
    { title: 'Marketing & D2C', count: '120+ Jobs', icon: Megaphone, href: '/jobs?query=Marketing' },
    { title: 'FinTech & Banking', count: '95+ Jobs', icon: DollarSign, href: '/jobs?query=Finance' },
    { title: 'Cloud & DevOps', count: '110+ Jobs', icon: Layers, href: '/jobs?query=DevOps' },
    { title: 'Healthcare Tech', count: '75+ Jobs', icon: HeartPulse, href: '/jobs?query=Health' },
    { title: 'Engineering & IoT', count: '85+ Jobs', icon: Cpu, href: '/jobs?query=Engineering' },
    { title: 'Customer Support', count: '60+ Jobs', icon: Headphones, href: '/jobs?query=Support' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900/5 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-950 dark:to-slate-950 pt-12 sm:pt-16 pb-16 sm:pb-24 border-b border-slate-200/70 dark:border-slate-800">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
              <span>Next-Gen Hiring Platform</span>
              <span className="text-slate-300 dark:text-slate-600">&bull;</span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Bhubaneswar</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Find the right opportunity.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 dark:from-indigo-400 dark:via-indigo-300 dark:to-slate-100">
                Build your career.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover verified jobs from high-growth tech companies, build a standout resume, and track applications in real time without the clutter.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/jobs">
                <Button variant="primary" size="lg" className="rounded-xl font-bold px-7 shadow-lg shadow-indigo-600/25" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Find Jobs
                </Button>
              </Link>
              <Link href="/employer/post-job">
                <Button variant="outline" size="lg" className="rounded-xl font-bold px-7" leftIcon={<Building2 className="w-4 h-4" />}>
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Job Search Component */}
          <div className="max-w-4xl mx-auto mt-10 sm:mt-12">
            <JobSearchHero />
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Banner (with transparent Demo Platform label) */}
      <section className="bg-slate-900 text-white py-10 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Connecting India&apos;s Top Tech Talent with High-Growth Companies</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Empowering candidates across Bhubaneswar, Bengaluru, Hyderabad, Pune, and remote teams.
              </p>
            </div>
            <DemoBadge variant="banner" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-indigo-400">10,000+</p>
              <p className="text-xs font-semibold text-slate-300">Live Tech Opportunities</p>
              <p className="text-[11px] text-slate-500">Updated hourly from verified employers</p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">500+</p>
              <p className="text-xs font-semibold text-slate-300">Vetted Companies</p>
              <p className="text-[11px] text-slate-500">Startups & enterprise innovators</p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-sky-400">25,000+</p>
              <p className="text-xs font-semibold text-slate-300">Active Job Seekers</p>
              <p className="text-[11px] text-slate-500">Engineers, designers & PMs</p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">92%</p>
              <p className="text-xs font-semibold text-slate-300">Application Response Rate</p>
              <p className="text-[11px] text-slate-500">Transparent recruiter feedback loops</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Jobs Section */}
      <section className="py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Featured Opportunities
                </span>
                <AiComingSoonBadge featureName="Smart Job Matching" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Recommended Handpicked Jobs
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Curated high-impact roles from verified employers in IT, Product, and Engineering.
              </p>
            </div>

            <Link href="/jobs">
              <Button variant="outline" size="sm" className="font-bold text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Jobs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.slice(0, 6).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={handleApplyClick}
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link href="/jobs">
              <Button variant="primary" size="md" className="rounded-xl font-bold px-8 shadow-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore All Job Openings &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Popular Job Categories */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Browse by Domain
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Career Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Find specialized roles across top technology and business functions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-200 group flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Featured Employer Spotlight */}
      <section className="py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Featured Employer
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Work With Sallet IT Soft Pvt. Ltd.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Learn about our engineering culture, employee benefits, and career opportunities directly at Sallet IT Soft Pvt. Ltd.
              </p>
            </div>

            <Link href="/companies/comp_sallet">
              <Button variant="outline" size="sm" className="font-bold text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Company Profile
              </Button>
            </Link>
          </div>

          {companies.length === 1 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Logo & Core Info */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 shadow-2xs">
                      <img
                        src={companies[0].logo || '/logo.png'}
                        alt={companies[0].name}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                          {companies[0].name}
                        </h3>
                        {companies[0].verified && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified Employer
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                        {companies[0].industry} &bull; {companies[0].location}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-lg text-amber-800 dark:text-amber-300 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{companies[0].rating}</span>
                          <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-normal">
                            ({companies[0].reviewCount} employee reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {companies[0].about}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      Bhubaneswar, Odisha (On-site)
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      🚀 Rapid Career Trajectory
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      💡 Modern Tech & SaaS Stack
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      🏥 Family Health Insurance
                    </span>
                  </div>
                </div>

                {/* Right Column: Stats & Action */}
                <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Company Size</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{companies[0].size}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Founded</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{companies[0].foundedYear}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Work Mode</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">On-site</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open Positions</span>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{companies[0].activeJobsCount} Active Roles</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
                    <Link href="/jobs" className="flex-1">
                      <Button variant="primary" size="md" className="w-full font-bold justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        View Open Jobs
                      </Button>
                    </Link>
                    <Link href={`/companies/${companies[0].id}`} className="flex-1">
                      <Button variant="outline" size="md" className="w-full font-bold justify-center">
                        Company Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companies.slice(0, 6).map((comp) => (
                <CompanyCard key={comp.id} company={comp} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why Sallet Hire & Dual How It Works Flows */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Why Choose Us */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                The Sallet Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Why Professionals & Recruiters Choose Sallet Hire
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Built to solve the frustrations of traditional portals: no spam postings, zero fake vacancies, and transparent timelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Verified Opportunities</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every company and opening undergoes stringent manual verification. Zero ghost jobs, outdated listings, or duplicate spam.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Frictionless 1-Click Applications</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Store multiple customized resume templates and apply instantly with verified profiles. No repetitive 15-page application forms.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Application Tracking</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Track every stage in real time: Submitted &rarr; Screened &rarr; Shortlisted &rarr; Interview &rarr; Offer. Always know where you stand.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works - Dual Workflows */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-10">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Simple & Transparent Workflows
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Candidate Path */}
              <div className="bg-gradient-to-br from-indigo-50/70 to-slate-50 dark:from-indigo-950/40 dark:to-slate-800/50 p-6 sm:p-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 space-y-5">
                <div className="flex items-center gap-2">
                  <Badge variant="default" size="md">For Job Seekers</Badge>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Find Your Next Role in 4 Steps</h4>
                </div>
                <ol className="space-y-3.5 text-xs sm:text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Create Profile & Resume:</strong> Build your technical profile and choose a professional resume template.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Discover Opportunities:</strong> Filter by salary LPA, experience level, location, and hybrid modes.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Apply Instantly:</strong> Submit your application directly to recruiter ATS dashboards with 1 click.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Track Progress:</strong> Receive live updates as your status moves to Shortlist and Interview.
                    </div>
                  </li>
                </ol>
              </div>

              {/* Employer Path */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    For Recruiters
                  </span>
                  <h4 className="text-base font-bold text-white">Hire Top Candidates in 4 Steps</h4>
                </div>
                <ol className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-white">Create Company Profile:</strong> Showcase engineering culture, employee benefits, and office locations.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-white">Post Jobs in Minutes:</strong> Use structured role templates with live desktop preview.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-white">Manage Candidates (Kanban):</strong> Drag and move candidates across Screening, Interview, and Offer stages.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">4</span>
                    <div>
                      <strong className="text-white">Extend Offers:</strong> Fast-track technical hiring with collaborative internal team notes.
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Career Resources / Blog Preview */}
      <section className="py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Career Insights
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Latest Articles & Interview Guides
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Actionable playbooks for frontend interviews, ATS resume optimization, and tech salary benchmarks.
              </p>
            </div>

            <Link href="/resources">
              <Button variant="outline" size="sm" className="font-bold text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Articles
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLES.slice(0, 3).map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Your Next Opportunity Starts Here.
          </h2>
          <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Join thousands of software engineers, product leaders, and hiring managers discovering better matches on Sallet Hire.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/jobs">
              <Button variant="accent" size="lg" className="rounded-xl font-bold px-8 shadow-xl shadow-emerald-900/40" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Find Jobs
              </Button>
            </Link>
            <Link href="/employer/post-job">
              <Button variant="outline" size="lg" className="rounded-xl font-bold px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                Hire Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Instant Apply Modal */}
      <JobApplyModal
        job={selectedJobToApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        candidateProfile={candidate}
      />
    </div>
  );
}
