'use client';

import React, { useState, useEffect } from 'react';
import { getApplicationsByCompany, getJobsByCompany, updateApplicationStage } from '../../../lib/services';
import { Application, Job, ApplicationStage } from '../../../lib/types';
import { KanbanBoard } from '../../../components/employer/KanbanBoard';
import { CandidateRecruiterCard } from '../../../components/employer/CandidateRecruiterCard';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import { useToast } from '../../../lib/context/ToastContext';
import {
  Users,
  LayoutGrid,
  List,
  Filter,
  FileText,
  Star,
  CheckCircle2,
  Video,
  Calendar,
  Search,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '../../../lib/utils';

export default function ApplicantsATSPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [activeStageTab, setActiveStageTab] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const { success } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, compJobs] = await Promise.all([
        getApplicationsByCompany('comp_sallet'),
        getJobsByCompany('comp_sallet'),
      ]);
      setApplications(apps);
      setJobs(compJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStageChange = async (appId: string, newStage: ApplicationStage) => {
    await updateApplicationStage(appId, newStage);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, stage: newStage } : a))
    );
    const candidate = applications.find((a) => a.id === appId);
    success('Candidate Stage Updated', `${candidate?.candidateName || 'Candidate'} moved to ${newStage}.`);
  };

  const handleOpenDetail = (app: Application) => {
    setSelectedApp(app);
    setRecruiterNotes(app.recruiterNotes || '');
    setIsDetailOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    await updateApplicationStage(selectedApp.id, selectedApp.stage, recruiterNotes);
    setApplications((prev) =>
      prev.map((a) => (a.id === selectedApp.id ? { ...a, recruiterNotes } : a))
    );
    success('Internal Notes Saved', 'Notes updated for this candidate profile.');
    setIsDetailOpen(false);
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesJob = selectedJobId === 'all' || app.jobId === selectedJobId;
    const matchesStage = activeStageTab === 'all' || app.stage === activeStageTab;
    const matchesSearch =
      !searchQuery ||
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJob && matchesStage && matchesSearch;
  });

  const stageTabs = [
    { id: 'all', label: 'All Candidates', count: applications.length },
    { id: 'applied', label: 'Applied', count: applications.filter((a) => a.stage === 'applied').length },
    { id: 'screening', label: 'Screening', count: applications.filter((a) => a.stage === 'screening').length },
    { id: 'shortlisted', label: 'Shortlisted', count: applications.filter((a) => a.stage === 'shortlisted').length },
    { id: 'interview', label: 'Interview', count: applications.filter((a) => a.stage === 'interview').length },
    { id: 'selected', label: 'Selected / Hired', count: applications.filter((a) => a.stage === 'selected').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter((a) => a.stage === 'rejected').length },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            ATS Recruitment Pipeline
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Management</h1>
        </div>

        {/* View Switcher: Kanban vs List */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Job Selector + Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filter by Job Opening</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="all">All Postings ({jobs.length} Active Jobs)</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.applicantCount} applicants)
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Search Candidates or Skills</label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, skill (e.g. Next.js), or location..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Kanban or List Mode Render */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          applications={filteredApps}
          onStageChange={handleStageChange}
          onOpenDetails={handleOpenDetail}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            <Tabs tabs={stageTabs} activeTab={activeStageTab} onChange={setActiveStageTab} variant="segmented" />
          </div>

          <div className="space-y-3">
            {filteredApps.map((app) => (
              <CandidateRecruiterCard
                key={app.id}
                application={app}
                onStageChange={handleStageChange}
                onOpenDetails={handleOpenDetail}
                viewMode="row"
              />
            ))}
          </div>
        </div>
      )}

      {/* Recruiter Full Candidate Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          maxWidth="2xl"
          title={
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 overflow-hidden flex items-center justify-center font-bold text-base">
                {selectedApp.candidateAvatar ? (
                  <img src={selectedApp.candidateAvatar} alt={selectedApp.candidateName} className="w-full h-full object-cover" />
                ) : (
                  selectedApp.candidateName.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedApp.candidateName}</h3>
                  <Badge variant="purple" size="sm">Candidate</Badge>
                </div>
                <p className="text-xs text-slate-500">{selectedApp.candidateHeadline}</p>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Applied For</span>
                <p className="font-bold text-slate-900 truncate">{selectedApp.jobTitle}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Experience</span>
                <p className="font-bold text-slate-900">{selectedApp.candidateExperienceYears} Years</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Location</span>
                <p className="font-bold text-slate-900">{selectedApp.candidateLocation}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Current Stage</span>
                <p className="font-bold text-indigo-600 capitalize">{selectedApp.stage}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Technical Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.candidateSkills.map((s) => (
                  <span key={s} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Attachment Viewer */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-bold text-slate-900">{selectedApp.resumeName}</p>
                  <p className="text-[11px] text-slate-400">PDF Document &bull; Submitted with application</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Download PDF
              </Button>
            </div>

            {/* Recruiter Private Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Internal Recruiter Feedback & Notes</span>
              </label>
              <textarea
                rows={3}
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                placeholder="Add evaluation feedback, live coding test score, or next step reminders..."
                className="w-full bg-white text-xs text-slate-900 rounded-lg border border-slate-200 p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Stage Modifier */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Move Candidate in Pipeline</h4>
              <div className="flex flex-wrap gap-2">
                {(['applied', 'screening', 'shortlisted', 'interview', 'selected', 'rejected'] as ApplicationStage[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStageChange(selectedApp.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                      selectedApp.stage === st
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsDetailOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="primary" size="md" onClick={handleSaveNotes} className="font-bold">
                Save Notes & Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
