'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCompanyById, getJobsByCompany, getCandidateProfile } from '../../../lib/services';
import { Company, Job, Candidate } from '../../../lib/types';
import { JobCard } from '../../../components/jobs/JobCard';
import { JobApplyModal } from '../../../components/jobs/JobApplyModal';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../lib/context/ToastContext';
import {
  Building2,
  MapPin,
  Globe,
  ShieldCheck,
  Star,
  Users,
  Calendar,
  CheckCircle2,
  Briefcase,
  Heart,
  Share2,
  ExternalLink,
  Award,
} from 'lucide-react';

export default function CompanyProfilePage() {
  const params = useParams();
  const companyId = params?.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidate, setCandidate] = useState<Candidate | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { success } = useToast();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [compData, candData] = await Promise.all([
          getCompanyById(companyId),
          getCandidateProfile(),
        ]);
        if (compData) {
          setCompany(compData);
          const jobsData = await getJobsByCompany(compData.id);
          setJobs(jobsData);
        }
        setCandidate(candData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (companyId) {
      load();
    }
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Company Not Found</h2>
        <Link href="/companies">
          <Button variant="primary">Explore All Companies</Button>
        </Link>
      </div>
    );
  }

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      success('Following Company', `You will receive updates about new openings at ${company.name}.`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-200/80 pt-6 pb-8 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-4">
          <Breadcrumbs
            items={[
              { label: 'Companies', href: '/companies' },
              { label: company.name },
            ]}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {company.name}
                  </h1>
                  {company.verified && (
                    <span title="Verified Enterprise" className="inline-flex">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-indigo-600">
                  {company.industry} &bull; Est. {company.foundedYear}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {company.size}
                  </span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant={isFollowing ? 'secondary' : 'outline'}
                size="md"
                onClick={handleFollowToggle}
                leftIcon={<Heart className={`w-4 h-4 ${isFollowing ? 'fill-white' : ''}`} />}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <a href="#open-jobs">
                <Button variant="primary" size="md" className="font-bold shadow-md">
                  View {jobs.length} Open Jobs
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Info (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                About {company.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{company.about}</p>
            </div>

            {/* Culture & Values */}
            {company.culture && company.culture.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Workplace Culture & Principles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.culture.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits & Perks */}
            {company.benefits && company.benefits.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Perks & Benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.benefits.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs font-semibold text-indigo-900"
                    >
                      <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Open Positions Section */}
            <div id="open-jobs" className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Current Openings at {company.name} ({jobs.length})
                </h2>
              </div>

              {jobs.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-500">No active job openings currently posted.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
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
            </div>
          </div>

          {/* Sidebar (Right col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Company Overview
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Industry:</span>
                  <span className="font-semibold text-slate-800">{company.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Company Size:</span>
                  <span className="font-semibold text-slate-800">{company.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Founded:</span>
                  <span className="font-semibold text-slate-800">{company.foundedYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Location:</span>
                  <span className="font-semibold text-slate-800">{company.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rating:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {company.rating} / 5.0
                  </span>
                </div>
              </div>
            </div>
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
