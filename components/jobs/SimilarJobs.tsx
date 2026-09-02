'use client';

import React from 'react';
import { Job } from '../../lib/types';
import { JobCard } from './JobCard';
import { Sparkles } from 'lucide-react';

interface SimilarJobsProps {
  currentJob: Job;
  allJobs: Job[];
  onApplyClick?: (job: Job) => void;
}

export function SimilarJobs({ currentJob, allJobs, onApplyClick }: SimilarJobsProps) {
  const similar = allJobs
    .filter(
      (j) =>
        j.id !== currentJob.id &&
        (j.department === currentJob.department ||
          j.location === currentJob.location ||
          j.workMode === currentJob.workMode)
    )
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div className="space-y-4 pt-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900">Similar Job Opportunities</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {similar.map((job) => (
          <JobCard key={job.id} job={job} layout="compact" onApplyClick={onApplyClick} />
        ))}
      </div>
    </div>
  );
}
