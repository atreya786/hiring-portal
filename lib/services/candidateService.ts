import { Candidate, JobAlert } from '../types';
import { INITIAL_CANDIDATE, INITIAL_SAVED_JOB_IDS, INITIAL_JOB_ALERTS } from '../mock-data';

const STORAGE_KEY_CANDIDATE = 'sallet_candidate_profile_v1';
const STORAGE_KEY_SAVED_JOBS = 'sallet_saved_jobs_v1';
const STORAGE_KEY_ALERTS = 'sallet_job_alerts_v1';

function getStoredCandidate(): Candidate {
  if (typeof window === 'undefined') return INITIAL_CANDIDATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CANDIDATE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CANDIDATE, JSON.stringify(INITIAL_CANDIDATE));
      return INITIAL_CANDIDATE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CANDIDATE;
  }
}

function saveCandidate(cand: Candidate): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CANDIDATE, JSON.stringify(cand));
  } catch (err) {
    console.error('Failed to save candidate to storage', err);
  }
}

export async function getCandidateProfile(_candidateId: string = 'cand_01'): Promise<Candidate> {
  return getStoredCandidate();
}

export async function updateCandidateProfile(
  _candidateId: string,
  updates: Partial<Candidate>
): Promise<Candidate> {
  const current = getStoredCandidate();
  const updated: Candidate = {
    ...current,
    ...updates,
  };

  // Recalculate completion percentage
  let score = 50;
  if (updated.about && updated.about.length > 50) score += 10;
  if (updated.skills && updated.skills.length >= 5) score += 10;
  if (updated.experience && updated.experience.length > 0) score += 10;
  if (updated.education && updated.education.length > 0) score += 10;
  if (updated.projects && updated.projects.length > 0) score += 5;
  if (updated.links?.github || updated.links?.linkedin) score += 5;
  updated.profileCompletionPercentage = Math.min(score, 100);

  saveCandidate(updated);
  return updated;
}

export async function getSavedJobIds(): Promise<string[]> {
  if (typeof window === 'undefined') return INITIAL_SAVED_JOB_IDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_JOBS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SAVED_JOBS, JSON.stringify(INITIAL_SAVED_JOB_IDS));
      return INITIAL_SAVED_JOB_IDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAVED_JOB_IDS;
  }
}

export async function toggleSaveJob(jobId: string): Promise<{ saved: boolean; ids: string[] }> {
  const current = await getSavedJobIds();
  let updated: string[];
  let saved: boolean;

  if (current.includes(jobId)) {
    updated = current.filter((id) => id !== jobId);
    saved = false;
  } else {
    updated = [...current, jobId];
    saved = true;
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SAVED_JOBS, JSON.stringify(updated));
  }
  return { saved, ids: updated };
}

export async function getJobAlerts(): Promise<JobAlert[]> {
  if (typeof window === 'undefined') return INITIAL_JOB_ALERTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALERTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(INITIAL_JOB_ALERTS));
      return INITIAL_JOB_ALERTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_JOB_ALERTS;
  }
}

export async function createJobAlert(alertData: Omit<JobAlert, 'id' | 'createdAt' | 'matchCount'>): Promise<JobAlert> {
  const current = await getJobAlerts();
  const newAlert: JobAlert = {
    ...alertData,
    id: `alert_${Date.now()}`,
    createdAt: new Date().toISOString(),
    matchCount: Math.floor(Math.random() * 8) + 2,
  };
  const updated = [newAlert, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(updated));
  }
  return newAlert;
}

export async function toggleJobAlert(alertId: string): Promise<JobAlert[]> {
  const current = await getJobAlerts();
  const updated = current.map((a) => (a.id === alertId ? { ...a, active: !a.active } : a));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(updated));
  }
  return updated;
}

export async function deleteJobAlert(alertId: string): Promise<JobAlert[]> {
  const current = await getJobAlerts();
  const updated = current.filter((a) => a.id !== alertId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(updated));
  }
  return updated;
}
