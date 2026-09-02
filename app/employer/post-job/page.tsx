'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '../../../lib/services';
import { Job, WorkMode, JobType, ExperienceLevel } from '../../../lib/types';
import { JobPreviewCard } from '../../../components/employer/JobPreviewCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../lib/context/ToastContext';
import {
  Briefcase,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  Building2,
} from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();
  const { success } = useToast();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Bhubaneswar, Odisha');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('1-3');
  const [minExp, setMinExp] = useState(2);
  const [maxExp, setMaxExp] = useState(5);
  const [salaryMin, setSalaryMin] = useState(8);
  const [salaryMax, setSalaryMax] = useState(14);
  const [jobType, setJobType] = useState<JobType>('full-time');
  const [openings, setOpenings] = useState(2);
  const [description, setDescription] = useState('');

  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Design and build high-performance user interfaces with Next.js and React.',
    'Collaborate closely with product designers and backend engineers.',
  ]);
  const [newResp, setNewResp] = useState('');

  const [requirements, setRequirements] = useState<string[]>([
    '2+ years of professional web development experience.',
    'Strong proficiency in TypeScript, React, and modern CSS.',
  ]);
  const [newReq, setNewReq] = useState('');

  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'Next.js', 'TypeScript', 'Tailwind CSS']);
  const [newSkill, setNewSkill] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddResp = () => {
    if (newResp.trim()) {
      setResponsibilities([...responsibilities, newResp.trim()]);
      setNewResp('');
    }
  };

  const handleAddReq = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq('');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills([...requiredSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newJob = await createJob({
        companyId: 'comp_sallet',
        companyName: 'Sallet Technologies',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
        companyVerified: true,
        title: title || 'Senior Software Engineer',
        slug: (title || 'senior-software-engineer').toLowerCase().replace(/\s+/g, '-'),
        department,
        location,
        workMode,
        experienceLevel,
        minExperienceYears: minExp,
        maxExperienceYears: maxExp,
        salaryMinLPA: salaryMin,
        salaryMaxLPA: salaryMax,
        isSalaryDisclosed: true,
        jobType,
        description: description || 'Exciting opportunity to join the engineering team at Sallet Technologies.',
        responsibilities,
        requirements,
        requiredSkills,
        preferredSkills: ['Node.js', 'PostgreSQL'],
        benefits: ['Health Cover (₹5L)', 'Hybrid Flexibility', 'Annual Learning Stipend'],
        openings,
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isFeatured: true,
      });

      success('Job Published Live!', `"${newJob.title}" is now active and visible to candidates.`);
      router.push('/employer/jobs');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobPreviewData: Partial<Job> = {
    title: title || 'Senior React / Next.js Developer',
    department,
    location,
    workMode,
    experienceLevel,
    minExperienceYears: minExp,
    maxExperienceYears: maxExp,
    salaryMinLPA: salaryMin,
    salaryMaxLPA: salaryMax,
    jobType,
    openings,
    description: description || 'Enter job description to see live updates...',
    responsibilities,
    requirements,
    requiredSkills,
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Sallet IT Soft ATS
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post a New Job Opening</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create a structured job listing with compensation transparency and target skill tags.
          </p>
        </div>
      </div>

      {/* Grid: Form (Left 2 cols) + Live Preview (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handlePublish} className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Position Info */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider">
              1. Basic Position Information
            </h2>

            <div className="space-y-4">
              <Input
                label="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer (React / Next.js)"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Department / Domain</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering & Software</option>
                    <option value="Product">Product & Design</option>
                    <option value="Data & AI">Data Science & AI</option>
                    <option value="Sales">Sales & Business Development</option>
                    <option value="Marketing">Marketing & Growth</option>
                    <option value="Human Resources">Human Resources & Talent</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Bhubaneswar, Odisha">Bhubaneswar, Odisha</option>
                    <option value="Cuttack, Odisha">Cuttack, Odisha</option>
                    <option value="Bengaluru, Karnataka">Bengaluru, Karnataka</option>
                    <option value="Hyderabad, Telangana">Hyderabad, Telangana</option>
                    <option value="Pune, Maharashtra">Pune, Maharashtra</option>
                    <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                    <option value="Delhi NCR, Gurugram">Delhi NCR / Gurugram</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as JobType)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="part-time">Part Time</option>
                  </select>
                </div>

                <Input
                  label="Number of Openings"
                  type="number"
                  value={openings}
                  onChange={(e) => setOpenings(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Compensation & Experience */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider">
              2. Compensation & Experience Bracket
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Min Salary (₹ LPA)"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                required
              />

              <Input
                label="Max Salary (₹ LPA)"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                required
              />

              <Input
                label="Min Experience (Years)"
                type="number"
                value={minExp}
                onChange={(e) => setMinExp(Number(e.target.value))}
                required
              />

              <Input
                label="Max Experience (Years)"
                type="number"
                value={maxExp}
                onChange={(e) => setMaxExp(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Section 3: Description & Requirements */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider">
              3. Description & Responsibilities
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">About the Role</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the opportunity, impact, and daily scope..."
                  className="w-full bg-white text-xs sm:text-sm text-slate-900 rounded-lg border border-slate-200 p-3 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Responsibilities list */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Key Responsibilities</label>
                <div className="flex gap-2">
                  <Input
                    value={newResp}
                    onChange={(e) => setNewResp(e.target.value)}
                    placeholder="Add a key responsibility..."
                  />
                  <Button type="button" variant="outline" onClick={handleAddResp}>
                    Add
                  </Button>
                </div>
                <div className="space-y-1.5 pt-1">
                  {responsibilities.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                      <span>&bull; {r}</span>
                      <button
                        type="button"
                        onClick={() => setResponsibilities(responsibilities.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements list */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Requirements & Qualifications</label>
                <div className="flex gap-2">
                  <Input
                    value={newReq}
                    onChange={(e) => setNewReq(e.target.value)}
                    placeholder="Add a requirement..."
                  />
                  <Button type="button" variant="outline" onClick={handleAddReq}>
                    Add
                  </Button>
                </div>
                <div className="space-y-1.5 pt-1">
                  {requirements.map((req, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                      <span>&bull; {req}</span>
                      <button
                        type="button"
                        onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Skills tags */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700">Required Skills</label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Next.js, Docker..."
                  />
                  <Button type="button" variant="outline" onClick={handleAddSkill}>
                    Add Skill
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {requiredSkills.map((s) => (
                    <span key={s} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-200/60 flex items-center gap-1">
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => setRequiredSkills(requiredSkills.filter((item) => item !== s))}
                        className="text-indigo-400 hover:text-indigo-900"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="font-bold px-8 shadow-md shadow-indigo-600/25"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Publish Job Listing
            </Button>
          </div>
        </form>

        {/* Live Preview Column (Desktop Sticky) */}
        <div className="hidden lg:block lg:col-span-1">
          <JobPreviewCard jobData={jobPreviewData} />
        </div>
      </div>
    </div>
  );
}
