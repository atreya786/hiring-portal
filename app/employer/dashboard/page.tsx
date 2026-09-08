'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobsByCompany, getApplicationsByCompany } from '../../../lib/services';
import { Job, Application, ApplicationStage } from '../../../lib/types';
import { HiringFunnelWidget } from '../../../components/employer/HiringFunnelWidget';
import { CandidateRecruiterCard } from '../../../components/employer/CandidateRecruiterCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../lib/context/ToastContext';
import {
  Briefcase,
  Users,
  PlusCircle,
  FileText,
  Star,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Award,
  Video,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '../../../lib/utils';

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { success } = useToast();

  const loadData = async () => {
    try {
      const [jobsData, appsData] = await Promise.all([
        getJobsByCompany('comp_sallet'),
        getApplicationsByCompany('comp_sallet'),
      ]);
      setJobs(jobsData);
      setApplications(appsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStageChange = async (appId: string, newStage: ApplicationStage) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, stage: newStage } : a))
    );
    success('Candidate Stage Updated', `${app.candidateName} moved to ${newStage}.`);
  };

  const handleOpenDetail = (app: Application) => {
    setSelectedApp(app);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Recruiter ATS Cockpit &bull; Sallet IT Soft Pvt. Ltd.
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Good morning, Priya 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track incoming applicant flow, schedule technical evaluations, and accelerate your hiring pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/employer/applicants">
            <Button variant="outline" size="sm" className="font-bold text-xs bg-white" leftIcon={<Users className="w-4 h-4" />}>
              Candidate Pipeline
            </Button>
          </Link>
          <Link href="/employer/post-job">
            <Button variant="primary" size="sm" className="font-bold text-xs shadow-md shadow-indigo-600/20" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Post a Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Top ATS Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Postings</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{jobs.filter((j) => j.status === 'active').length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Live Job Openings</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{applications.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Profiles Received</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Interviews Active</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {applications.filter((a) => a.stage === 'interview').length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Scheduled This Week</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Offers Extended</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">
            {applications.filter((a) => a.stage === 'selected').length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Selected Candidates</p>
        </div>
      </div>

      {/* Visual Hiring Funnel */}
      <HiringFunnelWidget applications={applications} />

      {/* Main Grid: Recent Applicants & Active Postings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Recent Applicants Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Candidate Stream</h2>
            <Link
              href="/employer/applicants"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Full Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <CandidateRecruiterCard
                key={app.id}
                application={app}
                onStageChange={handleStageChange}
                onOpenDetails={handleOpenDetail}
                viewMode="row"
              />
            ))}
          </div>
        </div>

        {/* Active Postings Overview (Right col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Your Active Postings
              </h3>
              <Link href="/employer/jobs" className="text-[11px] font-bold text-indigo-600 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{job.title}</h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{job.location} &bull; {job.applicantCount} Applicants</p>
                </div>
              ))}
            </div>

            <Link href="/employer/post-job" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
                Create Another Listing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Candidate Quick Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          maxWidth="xl"
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-800">
                {selectedApp.candidateName.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedApp.candidateName}</h3>
                <p className="text-xs text-slate-500">{selectedApp.candidateHeadline}</p>
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Applied Role</span>
                <p className="font-bold text-slate-800 truncate">{selectedApp.jobTitle}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Experience</span>
                <p className="font-bold text-slate-800">{selectedApp.candidateExperienceYears} Years</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Location</span>
                <p className="font-bold text-slate-800">{selectedApp.candidateLocation}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Stage</span>
                <p className="font-bold text-indigo-600 capitalize">{selectedApp.stage}</p>
              </div>
            </div>

            {/* Candidate Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.candidateSkills.map((s) => (
                  <span key={s} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-semibold border border-indigo-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume preview info */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-bold text-slate-900">{selectedApp.resumeName}</p>
                  <p className="text-[11px] text-slate-400">PDF Document &bull; Verified Candidate</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Download PDF
              </Button>
            </div>

            {/* Stage Modifier */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Update Candidate Stage</h4>
              <div className="flex flex-wrap gap-2">
                {(['screening', 'shortlisted', 'interview', 'selected', 'rejected'] as ApplicationStage[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      handleStageChange(selectedApp.id, st);
                      setIsDetailOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                      selectedApp.stage === st
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Move to {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
