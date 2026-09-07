import React from 'react';
import { Job } from '../../lib/types';
import { JobCard } from '../jobs/JobCard';
import { Sparkles, Eye } from 'lucide-react';

interface JobPreviewCardProps {
  jobData: Partial<Job>;
}

export function JobPreviewCard({ jobData }: JobPreviewCardProps) {
  const dummyJob: Job = {
    id: 'preview_id',
    companyId: 'comp_sallet',
    companyName: 'Sallet Technologies',
    companyLogo: '/logo.png',
    companyVerified: true,
    title: jobData.title || 'Untitled Position',
    slug: 'preview-job',
    department: jobData.department || 'Engineering',
    location: jobData.location || 'Bhubaneswar, Odisha',
    workMode: jobData.workMode || 'hybrid',
    experienceLevel: jobData.experienceLevel || '1-3',
    minExperienceYears: jobData.minExperienceYears || 1,
    maxExperienceYears: jobData.maxExperienceYears || 3,
    salaryMinLPA: jobData.salaryMinLPA || 6,
    salaryMaxLPA: jobData.salaryMaxLPA || 10,
    isSalaryDisclosed: true,
    jobType: jobData.jobType || 'full-time',
    description: jobData.description || 'Job description will appear here as you type...',
    responsibilities: jobData.responsibilities || ['Key responsibility 1', 'Key responsibility 2'],
    requirements: jobData.requirements || ['Requirement 1', 'Requirement 2'],
    requiredSkills: jobData.requiredSkills && jobData.requiredSkills.length > 0 ? jobData.requiredSkills : ['React', 'TypeScript'],
    preferredSkills: jobData.preferredSkills || [],
    benefits: jobData.benefits || ['Health Cover', 'Flexible Hours'],
    openings: jobData.openings || 1,
    status: 'active',
    postedAt: new Date().toISOString(),
    expiresAt: new Date().toISOString(),
    viewsCount: 0,
    applicantCount: 0,
    isFeatured: true,
  };

  return (
    <div className="space-y-2 sticky top-24">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Eye className="w-3.5 h-3.5 text-indigo-600" />
        <span>Live Candidate Card Preview</span>
      </div>
      <JobCard job={dummyJob} />
      <p className="text-[11px] text-slate-400 text-center">
        This preview dynamically updates as you complete the posting details.
      </p>
    </div>
  );
}
