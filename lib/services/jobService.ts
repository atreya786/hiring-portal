import { Job, JobFilterParams, JobStatus } from '../types';
import { INITIAL_JOBS } from '../mock-data';

const STORAGE_KEY_JOBS = 'sallet_jobs_v2';

function getStoredJobs(): Job[] {
  if (typeof window === 'undefined') return INITIAL_JOBS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JOBS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_JOBS;
  }
}

function saveJobs(jobs: Job[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
  } catch (err) {
    console.error('Failed to save jobs to storage', err);
  }
}

export async function getJobs(filters?: JobFilterParams): Promise<Job[]> {
  let jobs = getStoredJobs();

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/jobs', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          jobs = data.jobs;
          saveJobs(jobs);
        }
      }
    } catch (err) {
      // Fallback to local storage if API is unreachable
    }
  }

  if (!filters) return jobs;

  let filtered = [...jobs];

  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
        job.location.toLowerCase().includes(q)
    );
  }

  if (filters.location && filters.location !== 'All' && filters.location !== 'all') {
    const loc = filters.location.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.location.toLowerCase().includes(loc) ||
        (loc === 'remote' && job.workMode === 'remote')
    );
  }

  if (filters.locations && filters.locations.length > 0) {
    filtered = filtered.filter((job) =>
      filters.locations!.some((loc) =>
        job.location.toLowerCase().includes(loc.toLowerCase()) ||
        (loc.toLowerCase() === 'remote' && job.workMode === 'remote')
      )
    );
  }

  if (filters.experienceLevel && filters.experienceLevel.length > 0) {
    filtered = filtered.filter((job) =>
      filters.experienceLevel!.includes(job.experienceLevel)
    );
  }

  if (filters.workModes && filters.workModes.length > 0) {
    filtered = filtered.filter((job) => filters.workModes!.includes(job.workMode));
  }

  if (filters.jobTypes && filters.jobTypes.length > 0) {
    filtered = filtered.filter((job) => filters.jobTypes!.includes(job.jobType));
  }

  if (filters.minSalary && filters.minSalary > 0) {
    filtered = filtered.filter((job) => job.salaryMaxLPA >= filters.minSalary!);
  }

  if (filters.datePostedDays && filters.datePostedDays > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - filters.datePostedDays);
    filtered = filtered.filter((job) => new Date(job.postedAt) >= cutoff);
  }

  // Sorting
  if (filters.sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  } else if (filters.sortBy === 'salary-high') {
    filtered.sort((a, b) => b.salaryMaxLPA - a.salaryMaxLPA);
  } else if (filters.sortBy === 'experience-low') {
    filtered.sort((a, b) => a.minExperienceYears - b.minExperienceYears);
  }

  return filtered;
}

export async function getJobById(id: string): Promise<Job | null> {
  const jobs = await getJobs();
  const job = jobs.find((j) => j.id === id || j.slug === id);
  return job || null;
}

export async function getJobsByCompany(companyId: string): Promise<Job[]> {
  const jobs = await getJobs();
  return jobs.filter((j) => j.companyId === companyId);
}

export async function createJob(newJobData: Omit<Job, 'id' | 'postedAt' | 'viewsCount' | 'applicantCount'>): Promise<Job> {
  const jobs = getStoredJobs();
  const newJob: Job = {
    ...newJobData,
    id: `job_${Date.now()}`,
    postedAt: new Date().toISOString(),
    viewsCount: 1,
    applicantCount: 0,
  };

  // Attempt to save to MongoDB Atlas via API
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.job) {
          const updated = [data.job, ...jobs];
          saveJobs(updated);
          return data.job;
        }
      }
    } catch (err) {
      console.error('Failed to post job to API, falling back to local storage:', err);
    }
  }

  const updated = [newJob, ...jobs];
  saveJobs(updated);
  return newJob;
}

export async function updateJobStatus(jobId: string, status: JobStatus): Promise<Job | null> {
  const jobs = getStoredJobs();
  const idx = jobs.findIndex((j) => j.id === jobId);
  if (idx === -1) return null;
  jobs[idx] = { ...jobs[idx], status };
  saveJobs(jobs);
  return jobs[idx];
}

export async function incrementJobViews(jobId: string): Promise<void> {
  const jobs = getStoredJobs();
  const idx = jobs.findIndex((j) => j.id === jobId);
  if (idx !== -1) {
    jobs[idx].viewsCount = (jobs[idx].viewsCount || 0) + 1;
    saveJobs(jobs);
  }
}
