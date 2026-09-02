'use client';

import React, { useState, useEffect } from 'react';
import { getCandidateProfile, updateCandidateProfile } from '../../../lib/services';
import { Candidate, WorkMode } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../lib/context/ToastContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Code2,
  FolderGit2,
  Globe,
  Link2,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function CandidateProfilePage() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const { success } = useToast();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCandidateProfile();
        setCandidate(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !candidate) {
    return <div className="p-8 text-center text-slate-500">Loading profile editor...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateCandidateProfile(candidate.id, candidate);
      setCandidate(updated);
      success('Profile Updated', 'Your changes were saved and your profile completion score was updated.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !candidate.skills.includes(newSkill.trim())) {
      setCandidate({
        ...candidate,
        skills: [...candidate.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCandidate({
      ...candidate,
      skills: candidate.skills.filter((s) => s !== skillToRemove),
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Professional Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your skills, experience, and job preferences up to date to get matched with the best roles.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          className="font-bold px-6 shadow-md shadow-indigo-600/20"
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Profile
        </Button>
      </div>

      {/* Basic Personal Info */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Personal Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={candidate.fullName}
            onChange={(e) => setCandidate({ ...candidate, fullName: e.target.value })}
            required
          />

          <Input
            label="Professional Headline"
            value={candidate.headline}
            onChange={(e) => setCandidate({ ...candidate, headline: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={candidate.email}
            onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
            required
          />

          <Input
            label="Phone Number"
            value={candidate.phone}
            onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })}
            required
          />

          <Input
            label="Location (City, State)"
            value={candidate.location}
            onChange={(e) => setCandidate({ ...candidate, location: e.target.value })}
            required
          />

          <Input
            label="Years of Experience"
            type="number"
            value={candidate.experienceYears}
            onChange={(e) => setCandidate({ ...candidate, experienceYears: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">About Me / Bio</label>
          <textarea
            rows={4}
            value={candidate.about}
            onChange={(e) => setCandidate({ ...candidate, about: e.target.value })}
            className="w-full bg-white text-xs sm:text-sm text-slate-900 rounded-lg border border-slate-200 p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {/* Technical & Soft Skills Tags */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-600" />
          <span>Skills & Competencies</span>
        </h2>

        <div className="space-y-4">
          <div className="flex gap-2 max-w-md">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              placeholder="Add skill (e.g. Next.js, Docker, Python)..."
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSkill}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-lg text-xs font-bold"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-indigo-400 hover:text-indigo-900 p-0.5"
                  aria-label={`Remove skill ${skill}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Work Preferences */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span>Job Preferences & CTC</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Current CTC (₹ LPA)"
            type="number"
            value={candidate.currentSalaryLPA || ''}
            onChange={(e) => setCandidate({ ...candidate, currentSalaryLPA: Number(e.target.value) })}
          />

          <Input
            label="Expected CTC (₹ LPA)"
            type="number"
            value={candidate.expectedSalaryLPA}
            onChange={(e) => setCandidate({ ...candidate, expectedSalaryLPA: Number(e.target.value) })}
            required
          />

          <Input
            label="Notice Period (Days)"
            type="number"
            value={candidate.noticePeriodDays}
            onChange={(e) => setCandidate({ ...candidate, noticePeriodDays: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      {/* Online Links */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          <span>Portfolio & Social Links</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="LinkedIn URL"
            value={candidate.links?.linkedin || ''}
            onChange={(e) =>
              setCandidate({
                ...candidate,
                links: { ...candidate.links, linkedin: e.target.value },
              })
            }
            leftIcon={<Link2 className="w-4 h-4 text-indigo-600" />}
          />

          <Input
            label="GitHub Profile"
            value={candidate.links?.github || ''}
            onChange={(e) =>
              setCandidate({
                ...candidate,
                links: { ...candidate.links, github: e.target.value },
              })
            }
            leftIcon={<Code2 className="w-4 h-4" />}
          />

          <Input
            label="Portfolio Website"
            value={candidate.links?.portfolio || ''}
            onChange={(e) =>
              setCandidate({
                ...candidate,
                links: { ...candidate.links, portfolio: e.target.value },
              })
            }
            leftIcon={<Globe className="w-4 h-4 text-emerald-600" />}
          />
        </div>
      </div>

      {/* Floating or Bottom Save Bar */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSaving}
          className="font-bold px-8 shadow-lg shadow-indigo-600/25"
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>
    </form>
  );
}
