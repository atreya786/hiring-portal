'use client';

import React from 'react';
import { Application, ApplicationStage } from '../../lib/types';
import { CandidateRecruiterCard } from './CandidateRecruiterCard';
import { Users, FileSearch, UserCheck, Video, Award, XCircle } from 'lucide-react';

interface KanbanBoardProps {
  applications: Application[];
  onStageChange: (appId: string, newStage: ApplicationStage) => void;
  onOpenDetails: (application: Application) => void;
}

export function KanbanBoard({
  applications,
  onStageChange,
  onOpenDetails,
}: KanbanBoardProps) {
  const columns: Array<{
    id: ApplicationStage;
    title: string;
    icon: typeof Users;
    headerColor: string;
  }> = [
    {
      id: 'applied',
      title: 'Applied',
      icon: Users,
      headerColor: 'border-t-indigo-500 text-indigo-700',
    },
    {
      id: 'screening',
      title: 'Screening',
      icon: FileSearch,
      headerColor: 'border-t-sky-500 text-sky-700',
    },
    {
      id: 'shortlisted',
      title: 'Shortlisted',
      icon: UserCheck,
      headerColor: 'border-t-purple-500 text-purple-700',
    },
    {
      id: 'interview',
      title: 'Interview',
      icon: Video,
      headerColor: 'border-t-amber-500 text-amber-700',
    },
    {
      id: 'selected',
      title: 'Selected / Offer',
      icon: Award,
      headerColor: 'border-t-emerald-500 text-emerald-700',
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar min-h-[600px]">
      {columns.map((col) => {
        const colApps = applications.filter((a) => a.stage === col.id);
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            className="flex-1 min-w-[280px] max-w-[320px] bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-2.5 mb-3 bg-white rounded-xl shadow-2xs border-t-2 ${col.headerColor}`}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <h4 className="text-xs font-bold text-slate-900">{col.title}</h4>
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                {colApps.length}
              </span>
            </div>

            {/* Column Candidates List */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[700px] pr-1">
              {colApps.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">No candidates in this stage</p>
                </div>
              ) : (
                colApps.map((app) => (
                  <CandidateRecruiterCard
                    key={app.id}
                    application={app}
                    onStageChange={onStageChange}
                    onOpenDetails={onOpenDetails}
                    viewMode="card"
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
