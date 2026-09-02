'use client';

import React, { useState, useEffect } from 'react';
import { getCandidateProfile, updateCandidateProfile } from '../../../lib/services';
import { Candidate } from '../../../lib/types';
import { ResumePreview } from '../../../components/candidate/ResumePreview';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../lib/context/ToastContext';
import {
  FileText,
  Download,
  Printer,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Layout,
  Check,
} from 'lucide-react';

export default function CandidateResumePage() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [template, setTemplate] = useState<'modern-tech' | 'executive-clean' | 'minimalist-classic'>('modern-tech');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCandidateProfile();
        setCandidate(data);
        if (data.resumeTemplateId) {
          setTemplate(data.resumeTemplateId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !candidate) {
    return <div className="p-8 text-center text-slate-500">Loading resume builder...</div>;
  }

  const templates: Array<{
    id: 'modern-tech' | 'executive-clean' | 'minimalist-classic';
    title: string;
    description: string;
  }> = [
    {
      id: 'modern-tech',
      title: 'Modern Tech (Recommended)',
      description: 'Clean two-column layout with dark banner, skills tags, and project highlights.',
    },
    {
      id: 'executive-clean',
      title: 'Executive Clean',
      description: 'Single column classical layout tailored for senior engineering leadership.',
    },
    {
      id: 'minimalist-classic',
      title: 'Minimalist ATS',
      description: 'Ultra high-contrast plain layout optimized for zero-error parsing.',
    },
  ];

  const handleSetTemplate = async (templateId: 'modern-tech' | 'executive-clean' | 'minimalist-classic') => {
    setTemplate(templateId);
    await updateCandidateProfile(candidate.id, { resumeTemplateId: templateId });
    success('Template Updated', `Selected ${templateId} style for your resume.`);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownload = () => {
    success('Resume Downloaded', 'Your formatted PDF resume was generated.');
  };

  const handleSimulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      success('Resume Uploaded & Parsed', 'Profile data updated from uploaded document.');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resume Builder & Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose from professionally crafted templates or upload an existing PDF resume.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
            className="text-xs font-bold bg-white"
          >
            Print / Save PDF
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-4 h-4" />}
            className="text-xs font-bold"
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Template Selector Pills */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-indigo-600" />
            <span>Select Resume Template</span>
          </h2>
          <span className="text-[11px] text-slate-400">Instant Live Preview Below</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {templates.map((tpl) => {
            const isSelected = template === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleSetTemplate(tpl.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-900">{tpl.title}</h3>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{tpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Existing PDF Simulation */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-indigo-600 shadow-2xs">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Already have a tailored resume?</h4>
            <p className="text-[11px] text-slate-500">
              Current primary: <span className="font-semibold text-slate-700">{candidate.resumeName}</span>
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          isLoading={uploading}
          onClick={handleSimulateUpload}
          className="text-xs font-bold bg-white"
        >
          Upload New PDF
        </Button>
      </div>

      {/* Live Resume Preview Container */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Live Preview ({template})
          </span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Set as Primary Application Resume
          </span>
        </div>

        <div className="bg-slate-200/60 p-4 sm:p-8 rounded-3xl border border-slate-300 overflow-x-auto">
          <ResumePreview candidate={candidate} templateId={template} />
        </div>
      </div>
    </div>
  );
}
