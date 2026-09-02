import React from 'react';
import { ApplicationTimelineEvent, ApplicationStage } from '../../lib/types';
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface ApplicationTimelineProps {
  timeline: ApplicationTimelineEvent[];
  currentStage: ApplicationStage;
}

export function ApplicationTimeline({ timeline, currentStage }: ApplicationTimelineProps) {
  const STAGES_ORDER: ApplicationStage[] = [
    'applied',
    'screening',
    'shortlisted',
    'interview',
    'selected',
  ];

  const stageTitles: Record<ApplicationStage, string> = {
    applied: 'Application Submitted',
    screening: 'Resume Screening',
    shortlisted: 'Shortlisted for Technical Rounds',
    interview: 'Interviews & Evaluations',
    selected: 'Offer Extended / Selected',
    rejected: 'Application Not Shortlisted',
  };

  if (currentStage === 'rejected') {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-900">Application Closed</p>
            <p className="text-rose-700 mt-0.5">
              The hiring team decided not to move forward with this application for this specific opening.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STAGES_ORDER.indexOf(currentStage);

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {STAGES_ORDER.map((stage, idx) => {
        const isPassed = idx <= currentIndex;
        const isCurrent = stage === currentStage;
        const event = timeline.find((e) => e.stage === stage);

        return (
          <div key={stage} className="relative group">
            {/* Step Icon */}
            <div
              className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                isCurrent
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                  : isPassed
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400 border border-slate-300'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Circle className="w-2.5 h-2.5" />
              )}
            </div>

            {/* Step Details */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <h4
                  className={`text-xs sm:text-sm font-bold ${
                    isCurrent ? 'text-indigo-600' : isPassed ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {event?.title || stageTitles[stage]}
                </h4>
                {event?.date && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {formatDate(event.date)}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {event?.description || (isPassed ? 'Completed stage.' : 'Upcoming stage.')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
