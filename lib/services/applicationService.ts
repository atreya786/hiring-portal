import { Application, ApplicationStage, ApplicationTimelineEvent } from '../types';
import { INITIAL_APPLICATIONS } from '../mock-data';

const STORAGE_KEY_APPS = 'sallet_applications_v1';

function getStoredApplications(): Application[] {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

function saveApplications(apps: Application[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save applications to storage', err);
  }
}

export async function getApplications(): Promise<Application[]> {
  let apps = getStoredApplications();

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/applications', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.applications) && data.applications.length > 0) {
          apps = data.applications;
          saveApplications(apps);
        }
      }
    } catch (err) {
      // Fallback to local storage if API is unreachable
    }
  }

  return apps;
}

export async function getApplicationsByCandidate(candidateId: string = 'cand_01'): Promise<Application[]> {
  const apps = await getApplications();
  return apps.filter((a) => a.candidateId === candidateId);
}

export async function getApplicationsByJob(jobId: string): Promise<Application[]> {
  const apps = await getApplications();
  return apps.filter((a) => a.jobId === jobId);
}

export async function getApplicationsByCompany(companyId: string): Promise<Application[]> {
  const apps = await getApplications();
  return apps.filter((a) => a.companyId === companyId);
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const apps = await getApplications();
  return apps.find((a) => a.id === id) || null;
}

export async function applyToJob(params: {
  jobId: string;
  jobTitle: string;
  jobLocation: string;
  jobWorkMode: any;
  companyId: string;
  companyName: string;
  companyLogo: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateHeadline: string;
  candidateLocation: string;
  candidateExperienceYears: number;
  candidateSkills: string[];
  resumeUrl: string;
  resumeName: string;
  coverNote?: string;
}): Promise<Application> {
  const apps = getStoredApplications();

  // Check if candidate already applied to this job
  const existing = apps.find((a) => a.jobId === params.jobId && a.candidateId === params.candidateId);
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const timeline: ApplicationTimelineEvent[] = [
    {
      stage: 'applied',
      title: 'Application Submitted',
      description: `Your application has been received by ${params.companyName}.`,
      date: now,
      completed: true,
    },
  ];

  const newApp: Application = {
    id: `app_${Date.now()}`,
    ...params,
    appliedAt: now,
    stage: 'applied',
    timeline,
  };

  // Persist directly to MongoDB Atlas via API
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.application) {
          const updated = [data.application, ...apps];
          saveApplications(updated);
          return data.application;
        }
      }
    } catch (err) {
      console.error('Failed to submit application to API, falling back to local storage:', err);
    }
  }

  const updated = [newApp, ...apps];
  saveApplications(updated);
  return newApp;
}

export async function updateApplicationStage(
  applicationId: string,
  newStage: ApplicationStage,
  recruiterNotes?: string,
  rating?: number
): Promise<Application | null> {
  const apps = getStoredApplications();
  const idx = apps.findIndex((a) => a.id === applicationId);
  if (idx === -1) return null;

  const app = apps[idx];
  const now = new Date().toISOString();

  // Update timeline
  const stageTitles: Record<ApplicationStage, string> = {
    applied: 'Application Received',
    screening: 'Under Review by Talent Team',
    shortlisted: 'Shortlisted for Technical Rounds',
    interview: 'Interview Scheduled',
    selected: 'Selected & Offer Process',
    rejected: 'Application Archived / Not Selected',
  };

  const updatedTimeline = [...app.timeline];
  const existingEventIdx = updatedTimeline.findIndex((e) => e.stage === newStage);

  if (existingEventIdx !== -1) {
    updatedTimeline[existingEventIdx].completed = true;
    updatedTimeline[existingEventIdx].date = now;
  } else {
    updatedTimeline.push({
      stage: newStage,
      title: stageTitles[newStage] || newStage,
      description: recruiterNotes || `Status progressed to ${newStage}.`,
      date: now,
      completed: true,
    });
  }

  const updatedApp: Application = {
    ...app,
    stage: newStage,
    recruiterNotes: recruiterNotes !== undefined ? recruiterNotes : app.recruiterNotes,
    rating: rating !== undefined ? rating : app.rating,
    timeline: updatedTimeline,
  };

  apps[idx] = updatedApp;
  saveApplications(apps);
  return updatedApp;
}
