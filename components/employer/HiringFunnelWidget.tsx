import React from 'react';
import { Application, ApplicationStage } from '../../lib/types';
import { Users, FileSearch, UserCheck, Video, Award } from 'lucide-react';

interface HiringFunnelWidgetProps {
  applications: Application[];
}

export function HiringFunnelWidget({ applications }: HiringFunnelWidgetProps) {
  const counts: Record<ApplicationStage, number> = {
    applied: 0,
    screening: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
  };

  applications.forEach((app) => {
    if (counts[app.stage] !== undefined) {
      counts[app.stage]++;
    }
  });

  const stages: Array<{
    stage: ApplicationStage;
    label: string;
    count: number;
    icon: typeof Users;
    color: string;
  }> = [
    {
      stage: 'applied',
      label: 'Applications',
      count: counts.applied + counts.screening + counts.shortlisted + counts.interview + counts.selected,
      icon: Users,
      color: 'bg-indigo-600 text-white',
    },
    {
      stage: 'screening',
      label: 'Screening',
      count: counts.screening + counts.shortlisted + counts.interview + counts.selected,
      icon: FileSearch,
      color: 'bg-indigo-500 text-white',
    },
    {
      stage: 'shortlisted',
      label: 'Shortlisted',
      count: counts.shortlisted + counts.interview + counts.selected,
      icon: UserCheck,
      color: 'bg-indigo-400 text-white',
    },
    {
      stage: 'interview',
      label: 'Interviews',
      count: counts.interview + counts.selected,
      icon: Video,
      color: 'bg-indigo-300 text-slate-900',
    },
    {
      stage: 'selected',
      label: 'Offers / Hires',
      count: counts.selected,
      icon: Award,
      color: 'bg-emerald-500 text-white',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Active Hiring Funnel</h3>
          <p className="text-xs text-slate-500">Pipeline conversion velocity across active job openings</p>
        </div>
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          {applications.length} Total Candidates
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={st.stage}
              className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${st.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step {idx + 1}</span>
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">{st.count}</p>
                <p className="text-xs font-semibold text-slate-600 truncate">{st.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
