'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Job, Application, ApplicationStage } from '../types';
import {
  getSavedJobIds,
  toggleSaveJob,
  getApplicationsByCandidate,
  applyToJob,
  createJob,
  updateApplicationStage as serviceUpdateStage,
  getCandidateProfile,
} from '../services';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface JobContextType {
  savedJobIds: string[];
  isJobSaved: (jobId: string) => boolean;
  toggleSave: (jobId: string, jobTitle?: string) => Promise<boolean>;
  applications: Application[];
  hasAppliedTo: (jobId: string) => boolean;
  apply: (job: Job, resumeUrl?: string, resumeName?: string, coverNote?: string) => Promise<Application>;
  refreshApplications: () => Promise<void>;
  updateStage: (applicationId: string, stage: ApplicationStage, notes?: string, rating?: number) => Promise<Application | null>;
  postNewJob: (jobData: any) => Promise<Job>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { success, info } = useToast();
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [saved, apps] = await Promise.all([
        getSavedJobIds(),
        getApplicationsByCandidate(user?.candidateId || 'cand_01'),
      ]);
      setSavedJobIds(saved);
      setApplications(apps);
    } catch (err) {
      console.error('Failed to load job context data', err);
    } finally {
      setIsLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isJobSaved = useCallback(
    (jobId: string) => savedJobIds.includes(jobId),
    [savedJobIds]
  );

  const toggleSave = useCallback(
    async (jobId: string, jobTitle?: string) => {
      const result = await toggleSaveJob(jobId);
      setSavedJobIds(result.ids);
      if (result.saved) {
        success('Job Saved to Bookmarks', jobTitle ? `"${jobTitle}" saved.` : 'You can view it in your dashboard.');
      } else {
        info('Job Removed from Bookmarks', jobTitle ? `"${jobTitle}" removed.` : undefined);
      }
      return result.saved;
    },
    [success, info]
  );

  const hasAppliedTo = useCallback(
    (jobId: string) => applications.some((a) => a.jobId === jobId),
    [applications]
  );

  const apply = useCallback(
    async (job: Job, resumeUrl?: string, resumeName?: string, coverNote?: string) => {
      const candidate = await getCandidateProfile(user?.candidateId || 'cand_01');
      const app = await applyToJob({
        jobId: job.id,
        jobTitle: job.title,
        jobLocation: job.location,
        jobWorkMode: job.workMode,
        companyId: job.companyId,
        companyName: job.companyName,
        companyLogo: job.companyLogo,
        candidateId: candidate.id,
        candidateName: candidate.fullName,
        candidateEmail: candidate.email,
        candidateHeadline: candidate.headline,
        candidateLocation: candidate.location,
        candidateExperienceYears: candidate.experienceYears,
        candidateSkills: candidate.skills,
        resumeUrl: resumeUrl || candidate.resumeUrl,
        resumeName: resumeName || candidate.resumeName,
        coverNote,
      });

      await loadData();
      return app;
    },
    [user, loadData]
  );

  const updateStage = useCallback(
    async (applicationId: string, stage: ApplicationStage, notes?: string, rating?: number) => {
      const updated = await serviceUpdateStage(applicationId, stage, notes, rating);
      await loadData();
      return updated;
    },
    [loadData]
  );

  const postNewJob = useCallback(
    async (jobData: any) => {
      const newJob = await createJob(jobData);
      return newJob;
    },
    []
  );

  const refreshApplications = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return (
    <JobContext.Provider
      value={{
        savedJobIds,
        isJobSaved,
        toggleSave,
        applications,
        hasAppliedTo,
        apply,
        refreshApplications,
        updateStage,
        postNewJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobContext() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
}
