'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobsByCompany, updateJobStatus } from '../../../lib/services';
import { Job, JobStatus } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import { useToast } from '../../../lib/context/ToastContext';
import {
  Briefcase,
  Users,
  Eye,
  PlusCircle,
  MoreHorizontal,
  Clock,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { formatDate, formatSalary } from '../../../lib/utils';

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobsByCompany('comp_sallet');
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleStatusChange = async (jobId: string, status: JobStatus) => {
    await updateJobStatus(jobId, status);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
    success('Job Status Updated', `Position set to ${status}.`);
  };

  const tabs = [
    { id: 'all', label: 'All Postings', count: jobs.length },
    { id: 'active', label: 'Active', count: jobs.filter((j) => j.status === 'active').length },
    { id: 'paused', label: 'Paused', count: jobs.filter((j) => j.status === 'paused').length },
    { id: 'closed', label: 'Closed', count: jobs.filter((j) => j.status === 'closed').length },
  ];

  const filteredJobs = jobs.filter((j) => {
    if (activeTab === 'all') return true;
    return j.status === activeTab;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Job Postings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor applicant traffic, adjust statuses, and review active listings.
          </p>
        </div>

        <Link href="/employer/post-job">
          <Button variant="primary" size="sm" className="font-bold text-xs shadow-md shadow-indigo-600/20" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="segmented" />
      </div>

      {/* Postings Table / Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {job.title}
                </Link>
                <Badge
                  variant={job.status === 'active' ? 'success' : job.status === 'paused' ? 'warning' : 'secondary'}
                  size="sm"
                  className="capitalize font-bold"
                >
                  {job.status}
                </Badge>
              </div>

              <p className="text-xs text-slate-500">
                {job.location} &bull; {formatSalary(job.salaryMinLPA, job.salaryMaxLPA)} &bull; {job.workMode}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Posted {formatDate(job.postedAt)}
                </span>
                <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                  <Users className="w-3.5 h-3.5" />
                  {job.applicantCount} Candidates
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {job.viewsCount} Views
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>

              <Link href="/employer/applicants">
                <Button variant="primary" size="sm" className="text-xs font-bold">
                  View Applicants ({job.applicantCount})
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
