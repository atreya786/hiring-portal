'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobs, getCandidateProfile } from '../../../lib/services';
import { Job, Candidate } from '../../../lib/types';
import { useJobContext } from '../../../lib/context/JobContext';
import { JobCard } from '../../../components/jobs/JobCard';
import { JobApplyModal } from '../../../components/jobs/JobApplyModal';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Bookmark, Briefcase } from 'lucide-react';

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidate, setCandidate] = useState<Candidate | undefined>(undefined);
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { savedJobIds } = useJobContext();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [allJobs, candData] = await Promise.all([getJobs(), getCandidateProfile()]);
        setJobs(allJobs);
        setCandidate(candData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Jobs</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review and apply to positions you bookmarked for later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Your next opportunity could be here"
          description="Save jobs you are interested in and come back to review or apply anytime."
          actionLabel="Explore Open Jobs"
          onAction={() => (window.location.href = '/jobs')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
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
      )}

      <JobApplyModal
        job={selectedJobToApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        candidateProfile={candidate}
      />
    </div>
  );
}
