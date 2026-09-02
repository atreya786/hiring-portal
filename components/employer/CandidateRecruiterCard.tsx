'use client';

import React from 'react';
import { Application, ApplicationStage } from '../../lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Star,
  MapPin,
  Briefcase,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import Link from 'next/link';

interface CandidateRecruiterCardProps {
  application: Application;
  onStageChange: (appId: string, newStage: ApplicationStage) => void;
  onOpenDetails?: (application: Application) => void;
  viewMode?: 'card' | 'row';
}

export function CandidateRecruiterCard({
  application,
  onStageChange,
  onOpenDetails,
  viewMode = 'card',
}: CandidateRecruiterCardProps) {
  const stageOptions: Array<{ label: string; stage: ApplicationStage }> = [
    { label: 'Screening', stage: 'screening' },
    { label: 'Shortlist', stage: 'shortlisted' },
    { label: 'Interview', stage: 'interview' },
    { label: 'Hire / Offer', stage: 'selected' },
    { label: 'Reject', stage: 'rejected' },
  ];

  if (viewMode === 'row') {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
            {application.candidateAvatar ? (
              <img
                src={application.candidateAvatar}
                alt={application.candidateName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-sm">
                {application.candidateName.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {application.candidateName}
              </h4>
              {application.rating && (
                <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {application.rating}.0
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">{application.candidateHeadline}</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
              <span>{application.candidateLocation}</span>
              <span>&bull;</span>
              <span>{application.candidateExperienceYears} Yrs Exp</span>
              <span>&bull;</span>
              <span>Applied {formatDate(application.appliedAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <select
            value={application.stage}
            onChange={(e) => onStageChange(application.id, e.target.value as ApplicationStage)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenDetails && onOpenDetails(application)}
            className="text-xs"
          >
            View Candidate
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
            {application.candidateAvatar ? (
              <img
                src={application.candidateAvatar}
                alt={application.candidateName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-xs">
                {application.candidateName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              {application.candidateName}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-1">{application.candidateLocation}</p>
          </div>
        </div>

        {application.rating && (
          <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-amber-400" />
            {application.rating}
          </span>
        )}
      </div>

      {/* Applied Job & Experience */}
      <div className="space-y-1 text-xs">
        <p className="font-semibold text-slate-700 line-clamp-1">{application.jobTitle}</p>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{application.candidateExperienceYears} Years Exp</span>
          <span>{formatDate(application.appliedAt)}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1">
        {application.candidateSkills.slice(0, 3).map((s) => (
          <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
            {s}
          </span>
        ))}
      </div>

      {/* Quick Move stage selector & Detail Trigger */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <select
          value={application.stage}
          onChange={(e) => onStageChange(application.id, e.target.value as ApplicationStage)}
          className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="applied">Applied</option>
          <option value="screening">Screening</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          onClick={() => onOpenDetails && onOpenDetails(application)}
          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        >
          Review &rarr;
        </button>
      </div>
    </div>
  );
}
