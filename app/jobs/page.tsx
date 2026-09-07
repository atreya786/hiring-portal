'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getJobs, getCandidateProfile } from '../../lib/services';
import { Job, JobFilterParams, Candidate } from '../../lib/types';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilters } from '../../components/jobs/JobFilters';
import { JobApplyModal } from '../../components/jobs/JobApplyModal';
import { JobSearchHero } from '../../components/jobs/JobSearchHero';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { JobCardSkeleton } from '../../components/ui/Skeleton';
import { AiComingSoonBadge } from '../../components/demo/DemoBadge';
import { Filter, ArrowUpDown, Briefcase, Search, Sparkles } from 'lucide-react';

function JobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<Candidate | undefined>(undefined);
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<JobFilterParams>({
    query: searchParams.get('query') || '',
    experienceLevel: [],
    minSalary: 0,
    jobTypes: [],
    workModes: [],
    datePostedDays: 0,
    sortBy: 'relevance',
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const [data, cand] = await Promise.all([getJobs(filters), getCandidateProfile()]);
      setJobs(data);
      setCandidate(cand);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleResetFilters = () => {
    setFilters({
      query: '',
      experienceLevel: [],
      minSalary: 0,
      jobTypes: [],
      workModes: [],
      datePostedDays: 0,
      sortBy: 'relevance',
    });
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJobToApply(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16">
      {/* Search Bar Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-3">
          <Breadcrumbs
            items={[
              { label: 'Jobs', href: '/jobs' },
              { label: filters.query ? `Search: "${filters.query}"` : 'All Openings' },
            ]}
          />

          <div className="pt-1">
            <JobSearchHero
              initialQuery={filters.query}
              compact
              showLocationSelector={false}
              onSearch={(q) => {
                setFilters((prev) => ({
                  ...prev,
                  query: q,
                }));
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Mobile Filter & Sort Trigger Bar */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            leftIcon={<Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            className="text-xs font-bold"
          >
            Filters
            {(filters.experienceLevel?.length || 0) +
              (filters.workModes?.length || 0) +
              (filters.jobTypes?.length || 0) >
              0 && (
              <span className="ml-1 bg-indigo-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                {(filters.experienceLevel?.length || 0) +
                  (filters.workModes?.length || 0) +
                  (filters.jobTypes?.length || 0)}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            <select
              value={filters.sortBy || 'relevance'}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="experience-low">Experience: Entry Level</option>
            </select>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filter Sidebar (Left Column) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24 space-y-4">
            <JobFilters
              filters={filters}
              onChange={(newFilters) => setFilters(newFilters)}
              onReset={handleResetFilters}
              totalResultsCount={jobs.length}
            />

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 space-y-2">
              <AiComingSoonBadge featureName="Smart Job Matching" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sallet AI will automatically calculate match percentages against your resume in Phase 2.
              </p>
            </div>
          </div>

          {/* Job Results (Right Column) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Header: Count and Desktop Sorting */}
            <div className="hidden lg:flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  {loading ? 'Searching...' : `${jobs.length} Jobs Available`}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sort by:</span>
                <select
                  value={filters.sortBy || 'relevance'}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as any,
                    }))
                  }
                  className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest First</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="experience-low">Experience: Entry Level</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
              <EmptyState
                icon={Search}
                title="No jobs matched your criteria"
                description="Try adjusting your keywords, expanding locations, or lowering the salary threshold to view more opportunities."
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}

            {/* Job Cards List */}
            {!loading && jobs.length > 0 && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApplyClick={handleApplyClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Job Results"
      >
        <div className="space-y-4 pb-6">
          <JobFilters
            filters={filters}
            onChange={(newFilters) => setFilters(newFilters)}
            onReset={handleResetFilters}
            totalResultsCount={jobs.length}
          />
          <Button
            variant="primary"
            className="w-full font-bold"
            onClick={() => setMobileFilterOpen(false)}
          >
            Show {jobs.length} Results
          </Button>
        </div>
      </Drawer>

      {/* Apply Modal */}
      <JobApplyModal
        job={selectedJobToApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        candidateProfile={candidate}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading jobs directory...</div>}>
      <JobsContent />
    </Suspense>
  );
}
