import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DemoBadgeProps {
  className?: string;
  variant?: 'subtle' | 'pill' | 'banner';
}

export function DemoBadge({ className, variant = 'subtle' }: DemoBadgeProps) {
  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs rounded-full font-medium',
          className
        )}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Demo Platform Preview Data</span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200',
        className
      )}
      title="This metric reflects demo simulation dataset"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
      Demo Data
    </span>
  );
}

export function AiComingSoonBadge({ className, featureName }: { className?: string; featureName?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 rounded-lg text-indigo-700 text-xs font-semibold shadow-2xs',
        className
      )}
      title="AI functionality is cleanly architected for Phase 2 integration"
    >
      <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
      <span>{featureName ? `${featureName} · ` : ''}Sallet AI · Coming Soon</span>
    </div>
  );
}
