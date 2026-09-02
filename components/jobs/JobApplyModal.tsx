'use client';

import React, { useState } from 'react';
import { Job, Candidate } from '../../lib/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useJobContext } from '../../lib/context/JobContext';
import { useAuth } from '../../lib/context/AuthContext';
import { useToast } from '../../lib/context/ToastContext';
import {
  CheckCircle2,
  FileText,
  UploadCloud,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface JobApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  candidateProfile?: Candidate;
}

export function JobApplyModal({
  job,
  isOpen,
  onClose,
  candidateProfile,
}: JobApplyModalProps) {
  const { apply } = useJobContext();
  const { success } = useToast();
  const [coverNote, setCoverNote] = useState('');
  const [selectedResumeName, setSelectedResumeName] = useState(
    candidateProfile?.resumeName || 'Aditya_Sharma_FullStack_Resume.pdf'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apply(job, '/sample-resume.pdf', selectedResumeName, coverNote);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback if canvas-confetti context is unavailable
      }

      setIsSubmitted(true);
      success('Application Submitted!', `Your application for ${job.title} at ${job.companyName} was sent successfully.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setCoverNote('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="md"
      title={
        isSubmitted ? undefined : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Apply to {job.companyName}</h3>
              <p className="text-xs text-slate-500">{job.title}</p>
            </div>
          </div>
        )
      }
    >
      {isSubmitted ? (
        <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Your profile and resume were directly routed to the hiring team at{' '}
              <strong className="text-slate-800">{job.companyName}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Position:</span>
              <span className="font-semibold text-slate-900">{job.title}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Resume Attached:</span>
              <span className="font-semibold text-indigo-600">{selectedResumeName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Status:</span>
              <span className="font-bold text-emerald-600">Applied (Step 1 of 5)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <Link href="/candidate/applications" className="flex-1" onClick={handleClose}>
              <Button variant="primary" className="w-full text-xs font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Track Application
              </Button>
            </Link>
            <Button variant="outline" className="flex-1 text-xs" onClick={handleClose}>
              Browse More Jobs
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Candidate Quick Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                {candidateProfile?.fullName || 'Aditya Sharma'}
              </span>
              <span className="text-slate-500">
                {candidateProfile?.email || 'aditya.sharma@example.com'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {candidateProfile?.headline || 'Senior Full Stack Developer | React, Next.js, Node.js'}
            </p>
          </div>

          {/* Resume Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Select Resume
            </label>
            <div className="p-3 bg-white rounded-xl border-2 border-indigo-500/40 bg-indigo-50/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{selectedResumeName}</p>
                  <p className="text-[10px] text-slate-400">Primary PDF &bull; Updated recently</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                Selected
              </span>
            </div>
          </div>

          {/* Cover Message (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Cover Note or Introduction <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Briefly highlight why your experience is a great match for this role..."
              className="w-full bg-white text-xs sm:text-sm text-slate-900 rounded-lg border border-slate-200 p-3 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          {/* Assurance note */}
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Your contact details are encrypted and shared only with verified hiring managers.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="font-bold px-6"
            >
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
