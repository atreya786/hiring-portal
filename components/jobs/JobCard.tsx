'use client';

import React from 'react';
import Link from 'next/link';
import { Job } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useJobContext } from '../../lib/context/JobContext';
import { formatSalary, formatExperience, formatRelativeTime } from '../../lib/utils';
import {
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
  layout?: 'default' | 'compact';
}

export function JobCard({ job, onApplyClick, layout = 'default' }: JobCardProps) {
  const { isJobSaved, toggleSave, hasAppliedTo } = useJobContext();
  const saved = isJobSaved(job.id);
  const applied = hasAppliedTo(job.id);

  if (layout === 'compact') {
    return (
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all group flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">{job.companyName}</p>
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
                >
                  {job.title}
                </Link>
              </div>
            </div>
            {job.isFeatured && (
              <Badge variant="purple" size="sm">
                Featured
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
            <span className="font-semibold text-indigo-700">
              {formatSalary(job.salaryMinLPA, job.salaryMaxLPA, job.isSalaryDisclosed)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">{formatRelativeTime(job.postedAt)}</span>
          <Link href={`/jobs/${job.id}`}>
            <Button variant="ghost" size="sm" className="text-xs font-semibold">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 relative group flex flex-col justify-between">
      {/* Top row: Company Logo, Title, Badges, Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3.5">
            <Link
              href={`/companies/${job.companyId}`}
              className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform"
            >
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-full h-full object-cover rounded-lg"
              />
            </Link>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Link
                  href={`/companies/${job.companyId}`}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  {job.companyName}
                </Link>
                {job.companyVerified && (
                  <span title="Verified Employer" className="inline-flex">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  </span>
                )}
              </div>

              <Link href={`/jobs/${job.id}`}>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {job.isUrgent && (
              <Badge variant="warning" size="sm">
                Urgent
              </Badge>
            )}
            {job.isFeatured && (
              <Badge variant="purple" size="sm">
                Featured
              </Badge>
            )}
            <button
              onClick={() => toggleSave(job.id, job.title)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                saved
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={saved ? 'Remove bookmark' : 'Save job'}
              aria-label={saved ? 'Remove bookmark' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Key Info Pill Bar: Location, Salary, Experience, Work Mode */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 mb-3.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-indigo-700">
            <IndianRupee className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{formatSalary(job.salaryMinLPA, job.salaryMaxLPA, job.isSalaryDisclosed)}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatExperience(job.minExperienceYears, job.maxExperienceYears)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" size="sm" className="capitalize text-[11px]">
              {job.workMode}
            </Badge>
            <Badge variant="subtle" size="sm" className="capitalize text-[11px]">
              {job.jobType.replace('-', ' ')}
            </Badge>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3.5 leading-relaxed">
          {job.description}
        </p>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.requiredSkills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-md transition-colors"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="text-[11px] font-medium bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Row: Posted Relative Time + Apply / Applied CTA */}
      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Posted {formatRelativeTime(job.postedAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/jobs/${job.id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              View Details
            </Button>
          </Link>

          {applied ? (
            <Link href="/candidate/applications">
              <Button
                variant="accent"
                size="sm"
                className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 shadow-none"
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Applied
              </Button>
            </Link>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="text-xs font-semibold"
              onClick={() => onApplyClick ? onApplyClick(job) : null}
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
