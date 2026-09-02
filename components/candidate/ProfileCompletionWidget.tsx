import React from 'react';
import Link from 'next/link';
import { Candidate } from '../../lib/types';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export function ProfileCompletionWidget({ candidate }: { candidate: Candidate }) {
  const percentage = candidate.profileCompletionPercentage || 85;

  const missingItems: string[] = [];
  if (!candidate.links?.github && !candidate.links?.portfolio) {
    missingItems.push('Add your GitHub or Portfolio URL');
  }
  if (!candidate.certifications || candidate.certifications.length === 0) {
    missingItems.push('Add an industry certification');
  }
  if (!candidate.projects || candidate.projects.length < 2) {
    missingItems.push('Highlight at least 2 key projects');
  }
  if (candidate.skills.length < 8) {
    missingItems.push('Add 3 more technical skills');
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Profile Strength
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              High Visibility
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {percentage}% Complete
          </h3>
        </div>

        <Link href="/candidate/profile">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Complete Profile
          </Button>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden mb-4 border border-slate-700/50">
        <div
          className="bg-gradient-to-r from-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Missing items suggestions */}
      {missingItems.length > 0 ? (
        <div className="space-y-1.5 pt-1">
          <p className="text-xs text-indigo-200 font-medium">Quick steps to reach 100%:</p>
          <div className="space-y-1">
            {missingItems.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>All core sections completed. Your profile is ranked at the top of recruiter searches!</span>
        </div>
      )}
    </div>
  );
}
