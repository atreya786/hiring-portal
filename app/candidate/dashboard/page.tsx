'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCandidateProfile, getJobs, getApplicationsByCandidate } from '../../../lib/services';
import { Candidate, Job, Application } from '../../../lib/types';
import { ProfileCompletionWidget } from '../../../components/candidate/ProfileCompletionWidget';
import { JobCard } from '../../../components/jobs/JobCard';
import { JobApplyModal } from '../../../components/jobs/JobApplyModal';
import { useJobContext } from '../../../lib/context/JobContext';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Video,
  Bookmark,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Bell,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '../../../lib/utils';

export default function CandidateDashboardPage() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const { savedJobIds } = useJobContext();

  useEffect(() => {
    async function load() {
      const [candData, allJobs, apps] = await Promise.all([
        getCandidateProfile(),
        getJobs(),
        getApplicationsByCandidate('cand_01'),
      ]);
      setCandidate(candData);
      setApplications(apps);

      // Recommend jobs matching candidate skills or location
      const matched = allJobs
        .filter((j) =>
          j.requiredSkills.some((s) => candData.skills.includes(s)) ||
          j.location.includes('Bhubaneswar')
        )
        .slice(0, 4);
      setRecommendedJobs(matched);
    }
    load();
  }, []);

  if (!candidate) {
    return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
  }

  const counts = {
    applied: applications.length,
    underReview: applications.filter((a) => a.stage === 'screening').length,
    shortlisted: applications.filter((a) => a.stage === 'shortlisted').length,
    interviews: applications.filter((a) => a.stage === 'interview').length,
  };

  return (
    <div className="space-y-8">
      {/* Header Greeting & Profile Strength Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Candidate Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Good morning, {candidate.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Here is your daily activity overview, application milestones, and curated job recommendations.
          </p>
        </div>

        <div className="lg:col-span-2">
          <ProfileCompletionWidget candidate={candidate} />
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/candidate/applications"
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Submitted</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.applied}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active Applications</p>
        </Link>

        <Link
          href="/candidate/applications"
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">In Screening</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.underReview}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Under Review</p>
        </Link>

        <Link
          href="/candidate/applications"
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Shortlisted</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{counts.shortlisted}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Passed Initial Filter</p>
        </Link>

        <Link
          href="/candidate/applications"
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Interviews</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{counts.interviews}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Scheduled Rounds</p>
        </Link>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Recent Applications & Recommended Jobs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Applications Feed */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
              <Link
                href="/candidate/applications"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Full Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                      <img src={app.companyLogo} alt={app.companyName} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{app.jobTitle}</h4>
                      <p className="text-xs text-slate-500">
                        {app.companyName} &bull; Applied {formatDate(app.appliedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Badge
                      variant={
                        app.stage === 'interview'
                          ? 'success'
                          : app.stage === 'shortlisted'
                          ? 'purple'
                          : app.stage === 'screening'
                          ? 'info'
                          : 'default'
                      }
                      size="sm"
                      className="capitalize font-bold"
                    >
                      {app.stage}
                    </Badge>
                    <Link href="/candidate/applications">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Timeline &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
                <p className="text-xs text-slate-500">Matching your skills: React, TypeScript, Next.js</p>
              </div>
              <Link href="/jobs">
                <Button variant="outline" size="sm" className="text-xs font-bold">
                  Browse All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={(j) => {
                    setSelectedJobToApply(j);
                    setIsApplyModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Actions, Job Alerts, Saved Jobs Quick Peek */}
        <div className="space-y-6">
          {/* Quick Hub */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Candidate Quick Hub
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <Link
                href="/candidate/resume"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <span>Edit Resume Templates</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/candidate/saved-jobs"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <span>View {savedJobIds.length} Saved Jobs</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/candidate/alerts"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <span>Manage Job Alerts</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Active Job Alert Widget */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900">Active Job Alert</h4>
            </div>
            <p className="text-xs font-semibold text-slate-700">
              React & Next.js Developers in Bhubaneswar
            </p>
            <p className="text-[11px] text-slate-500">Frequency: Daily &bull; 4 new matches this week</p>
            <Link href="/candidate/alerts">
              <Button variant="outline" size="sm" className="w-full text-xs bg-white">
                View All Alerts
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <JobApplyModal
        job={selectedJobToApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        candidateProfile={candidate}
      />
    </div>
  );
}
