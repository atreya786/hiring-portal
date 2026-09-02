'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApplicationsByCandidate } from '../../../lib/services';
import { Application, ApplicationStage } from '../../../lib/types';
import { ApplicationTimeline } from '../../../components/candidate/ApplicationTimeline';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatDate } from '../../../lib/utils';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Video,
  Award,
  XCircle,
  FileText,
  Calendar,
  Building2,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getApplicationsByCandidate('cand_01');
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const counts = {
    all: applications.length,
    screening: applications.filter((a) => a.stage === 'screening').length,
    shortlisted: applications.filter((a) => a.stage === 'shortlisted').length,
    interview: applications.filter((a) => a.stage === 'interview').length,
    selected: applications.filter((a) => a.stage === 'selected').length,
    rejected: applications.filter((a) => a.stage === 'rejected').length,
  };

  const tabs = [
    { id: 'all', label: 'All Applications', count: counts.all },
    { id: 'screening', label: 'In Review', count: counts.screening },
    { id: 'shortlisted', label: 'Shortlisted', count: counts.shortlisted },
    { id: 'interview', label: 'Interviews', count: counts.interview },
    { id: 'selected', label: 'Offers / Selected', count: counts.selected },
  ];

  const filteredApps = applications.filter((app) => {
    if (activeTab === 'all') return true;
    return app.stage === activeTab;
  });

  const handleOpenDetail = (app: Application) => {
    setSelectedApp(app);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Application Tracker</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your application lifecycle and interview schedules with full transparency.
        </p>
      </div>

      {/* Tabs Filter */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="segmented"
        />
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications in this category"
          description="You can discover active vacancies and submit your application with a single click."
          actionLabel="Find Open Jobs"
          onAction={() => (window.location.href = '/jobs')}
        />
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={app.companyLogo} alt={app.companyName} className="w-full h-full object-cover rounded-lg" />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {app.jobTitle}
                    </h3>
                  </div>

                  <p className="text-xs font-semibold text-slate-600">
                    {app.companyName} &bull; {app.jobLocation} ({app.jobWorkMode})
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span>Applied on {formatDate(app.appliedAt)}</span>
                    <span>&bull;</span>
                    <span>Resume: {app.resumeName}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge & Action */}
              <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                <Badge
                  variant={
                    app.stage === 'selected'
                      ? 'success'
                      : app.stage === 'interview'
                      ? 'warning'
                      : app.stage === 'shortlisted'
                      ? 'purple'
                      : app.stage === 'screening'
                      ? 'info'
                      : 'secondary'
                  }
                  size="md"
                  className="font-bold capitalize"
                >
                  {app.stage === 'screening'
                    ? 'In Review'
                    : app.stage === 'interview'
                    ? 'Interview Scheduled'
                    : app.stage}
                </Badge>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenDetail(app)}
                  className="text-xs font-bold"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Timeline
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Timeline Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          maxWidth="lg"
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                <img src={selectedApp.companyLogo} alt={selectedApp.companyName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedApp.jobTitle}</h3>
                <p className="text-xs text-slate-500">{selectedApp.companyName} &bull; {selectedApp.jobLocation}</p>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Interview date alert if present */}
            {selectedApp.interviewDate && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-start gap-3 text-xs">
                <Video className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Virtual Interview Scheduled</p>
                  <p className="text-emerald-700 mt-0.5">
                    Date & Time: <strong>{formatDate(selectedApp.interviewDate)}</strong>
                  </p>
                  {selectedApp.recruiterNotes && (
                    <p className="text-emerald-800 mt-1 italic">&ldquo;{selectedApp.recruiterNotes}&rdquo;</p>
                  )}
                </div>
              </div>
            )}

            {/* Visual Timeline Component */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                Application Milestone Progress
              </h4>
              <ApplicationTimeline
                timeline={selectedApp.timeline}
                currentStage={selectedApp.stage}
              />
            </div>

            {/* Application Meta */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Submitted Resume:</span>
                <span className="font-semibold text-indigo-600">{selectedApp.resumeName}</span>
              </div>
              {selectedApp.coverNote && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400">Cover Note:</span>
                  <p className="text-slate-700 mt-0.5 italic">{selectedApp.coverNote}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
