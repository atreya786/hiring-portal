'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getJobById, getJobs, getCompanyById, getCandidateProfile } from '../../../lib/services';
import { Job, Company, Candidate } from '../../../lib/types';
import { useJobContext } from '../../../lib/context/JobContext';
import { useToast } from '../../../lib/context/ToastContext';
import { JobApplyModal } from '../../../components/jobs/JobApplyModal';
import { SimilarJobs } from '../../../components/jobs/SimilarJobs';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AiComingSoonBadge } from '../../../components/demo/DemoBadge';
import { formatSalary, formatExperience, formatRelativeTime, formatDate, getGmailComposeUrl } from '../../../lib/utils';
import {
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Users,
  ExternalLink,
  Award,
  Sparkles,
  ArrowLeft,
  Check,
  GraduationCap,
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [candidate, setCandidate] = useState<Candidate | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { isJobSaved, toggleSave, hasAppliedTo } = useJobContext();
  const { success, info } = useToast();

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      try {
        const [jobData, allJobsData, candidateData] = await Promise.all([
          getJobById(jobId),
          getJobs(),
          getCandidateProfile(),
        ]);

        if (jobData) {
          setJob(jobData);
          const compData = await getCompanyById(jobData.companyId);
          setCompany(compData);
        }
        setAllJobs(allJobsData);
        setCandidate(candidateData);
      } catch (err) {
        console.error('Failed to load job details', err);
      } finally {
        setLoading(false);
      }
    }
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Job Not Found</h2>
        <p className="text-slate-500">The opening you are looking for has either expired or been removed.</p>
        <Link href="/jobs">
          <Button variant="primary">Browse All Jobs</Button>
        </Link>
      </div>
    );
  }

  const saved = isJobSaved(job.id);
  const applied = hasAppliedTo(job.id);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      success('Link Copied', 'Job posting URL copied to clipboard.');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 lg:pb-16">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 pt-6 pb-8 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Breadcrumbs
              items={[
                { label: 'Jobs', href: '/jobs' },
                { label: job.department, href: `/jobs?query=${encodeURIComponent(job.department)}` },
                { label: job.title },
              ]}
            />
            <Link
              href="/jobs"
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to search</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
            {/* Title & Company info */}
            <div className="flex items-start gap-4 sm:gap-5">
              <Link
                href={`/companies/${job.companyId}`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-xs hover:scale-105 transition-transform"
              >
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </Link>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/companies/${job.companyId}`}
                    className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {job.companyName}
                  </Link>
                  {job.companyVerified && (
                    <span title="Verified Employer" className="inline-flex">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    </span>
                  )}
                  {job.isFeatured && <Badge variant="purple" size="sm">Featured</Badge>}
                </div>

                <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {job.title}
                </h1>

                {/* Key metadata pills */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-400">
                    <IndianRupee className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    {job.salary || formatSalary(job.salaryMinLPA, job.salaryMaxLPA, job.isSalaryDisclosed)}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    {job.experience || formatExperience(job.minExperienceYears, job.maxExperienceYears)}
                  </span>
                  {job.qualification && (
                    <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                      <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {job.qualification}
                    </span>
                  )}
                  {job.duration && (
                    <span className="flex items-center gap-1.5 font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/60">
                      <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      {job.duration}
                    </span>
                  )}
                  {job.workHours && (
                    <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <span>{job.workHours}</span>
                    </span>
                  )}
                  <Badge variant="secondary" size="md" className="capitalize">
                    {job.workMode}
                  </Badge>
                  <Badge variant="subtle" size="md" className="capitalize">
                    {job.type || job.jobType.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleSave(job.id, job.title)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  saved
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title={saved ? 'Bookmarked' : 'Save Job'}
                aria-label={saved ? 'Bookmarked' : 'Save Job'}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-indigo-600' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                title="Share Job"
                aria-label="Share Job"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <a
                href={getGmailComposeUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="font-bold px-8 shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  Apply via Gmail &rarr;
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details (Left) + Sticky Application Rail (Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Job Description & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About The Role */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">About the Role</h2>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Posted {formatDate(job.postedAt)} &bull; {job.openings} Openings
                </span>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>{job.about || job.description}</p>
              </div>

              {/* Qualification highlight if available */}
              {job.qualification && (
                <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Required Qualification</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{job.qualification}</p>
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Key Responsibilities
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Who Can Apply? */}
              {job.whoCanApply && job.whoCanApply.length > 0 ? (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Who Can Apply?
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {job.whoCanApply.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : job.requirements && job.requirements.length > 0 ? (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Requirements
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Technologies & Tools (Categorized if toolsAndTech provided, else standard) */}
              {job.toolsAndTech ? (
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Technologies & Tools
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {Object.entries(job.toolsAndTech).map(([category, tools]) => (
                      <div
                        key={category}
                        className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-2"
                      >
                        <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                          {category}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {tools.map((tool) => (
                            <span
                              key={tool}
                              className="text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
                      Required Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 px-3 py-1.5 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {job.preferredSkills && job.preferredSkills.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                        Additional Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.preferredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* What You'll Gain */}
              {job.whatYoullGain && job.whatYoullGain.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    What You&apos;ll Gain
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {job.whatYoullGain.map((gain, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                        <span>{gain}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selection Process */}
              {job.selectionProcess && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Selection Process
                  </h3>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-200">
                      {job.selectionProcess}
                    </p>
                    {job.selectionNotes && job.selectionNotes.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-indigo-100/70 dark:border-indigo-900/40">
                        {job.selectionNotes.map((note, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Nice to Have */}
              {job.niceToHave && job.niceToHave.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Nice to Have
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {job.niceToHave.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Apply via Gmail CTA inside details */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Interested in this position?</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Send your resume and details directly to hr@sallet.in</p>
                </div>
                <a
                  href={getGmailComposeUrl(job)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button
                    variant="primary"
                    size="md"
                    className="font-bold px-6 shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    Apply via Gmail &rarr;
                  </Button>
                </a>
              </div>
            </div>

            {/* About Company Card */}
            {company && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">About {company.name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold">{company.industry}</p>
                  </div>
                  <Link href={`/companies/${company.id}`}>
                    <Button variant="outline" size="sm" className="text-xs font-bold" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      View Company Profile
                    </Button>
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{company.about}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Company Size</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{company.size}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Headquarters</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{company.location}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Active Openings</span>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{company.activeJobsCount} Jobs</p>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Jobs Section */}
            <SimilarJobs
              currentJob={job}
              allJobs={allJobs}
              onApplyClick={(j) => {
                setJob(j);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* Right Column: Sticky Summary & Apply Card */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-5">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Compensation
                </span>
                <p className="text-2xl font-black text-indigo-700 dark:text-indigo-400 mt-0.5">
                  {job.salary || formatSalary(job.salaryMinLPA, job.salaryMaxLPA, job.isSalaryDisclosed)}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Location</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right">
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Experience Required</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {job.experience || formatExperience(job.minExperienceYears, job.maxExperienceYears)}
                  </span>
                </div>
                {job.qualification && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Qualification</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {job.qualification}
                    </span>
                  </div>
                )}
                {job.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Duration</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{job.duration}</span>
                  </div>
                )}
                {job.workHours && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Work Hours</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{job.workHours}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Job Type</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {job.type || job.jobType.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Work Mode</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{job.workMode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Openings</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{job.openings} Positions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Total Applicants</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{job.applicantCount} candidates</span>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <a
                  href={getGmailComposeUrl(job)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full font-bold shadow-md shadow-indigo-600/25 cursor-pointer"
                  >
                    Apply via Gmail &rarr;
                  </Button>
                </a>

                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-xs font-semibold"
                  onClick={() => toggleSave(job.id, job.title)}
                  leftIcon={<Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-600 text-indigo-600' : ''}`} />}
                >
                  {saved ? 'Saved to Bookmarks' : 'Save for Later'}
                </Button>
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                Direct application &bull; Resumes are delivered immediately to hr@sallet.in.
              </p>
            </div>

            {/* AI Placeholder Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 space-y-2">
              <AiComingSoonBadge featureName="AI Resume Match" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Coming in Phase 2: Instant skill-gap analysis and tailored recommendations for your application.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Apply Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 px-4 z-30 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400 leading-tight">
            {job.salary || formatSalary(job.salaryMinLPA, job.salaryMaxLPA, job.isSalaryDisclosed)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[160px]">{job.companyName}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSave(job.id, job.title)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              saved
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
            }`}
            aria-label={saved ? 'Saved' : 'Save'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-600' : ''}`} />
          </button>

          <a
            href={getGmailComposeUrl(job)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="primary"
              size="md"
              className="font-bold text-xs px-6 shadow-md cursor-pointer"
            >
              Apply via Gmail &rarr;
            </Button>
          </a>
        </div>
      </div>

      {/* Application Modal */}
      <JobApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        candidateProfile={candidate}
      />
    </div>
  );
}
