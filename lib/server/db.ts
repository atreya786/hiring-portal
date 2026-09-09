import { Collection } from 'mongodb';
import { getDatabase } from './mongodb';
import { Job, Application, Company } from '../types';
import { AuthUserRecord, administratorCollection } from './collections';
import { INITIAL_JOBS, INITIAL_COMPANIES, INITIAL_APPLICATIONS } from '../mock-data';

// Collection names in the MongoDB Atlas "Hiring" database
export const COLLECTIONS = {
  CANDIDATES: 'candidates',
  RECRUITERS: 'recruiters',
  ADMINISTRATORS: 'administrators',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  COMPANIES: 'companies',
} as const;

export async function getCandidatesCollection(): Promise<Collection<AuthUserRecord>> {
  const db = await getDatabase();
  return db.collection<AuthUserRecord>(COLLECTIONS.CANDIDATES);
}

export async function getRecruitersCollection(): Promise<Collection<AuthUserRecord>> {
  const db = await getDatabase();
  return db.collection<AuthUserRecord>(COLLECTIONS.RECRUITERS);
}

export async function getAdministratorsCollection(): Promise<Collection<AuthUserRecord>> {
  const db = await getDatabase();
  return db.collection<AuthUserRecord>(COLLECTIONS.ADMINISTRATORS);
}

// Alias for backwards compatibility
export const getAdminsCollection = getAdministratorsCollection;

export async function getJobsCollection(): Promise<Collection<Job>> {
  const db = await getDatabase();
  return db.collection<Job>(COLLECTIONS.JOBS);
}

export async function getApplicationsCollection(): Promise<Collection<Application>> {
  const db = await getDatabase();
  return db.collection<Application>(COLLECTIONS.APPLICATIONS);
}

export async function getCompaniesCollection(): Promise<Collection<Company>> {
  const db = await getDatabase();
  return db.collection<Company>(COLLECTIONS.COMPANIES);
}

let isSeeded = false;
let isSeeding = false;
let lastSeedAttempt = 0;

/**
 * Ensures initial default data exists in MongoDB Atlas collections.
 * Candidate and Recruiter collections remain completely empty.
 * Only the initial administrator account is seeded if empty.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  if (isSeeded) return;
  const now = Date.now();
  if (isSeeding || now - lastSeedAttempt < 20000) return;

  isSeeding = true;
  lastSeedAttempt = now;

  try {
    const [
      adminsCol,
      jobsCol,
      companiesCol,
    ] = await Promise.all([
      getAdministratorsCollection(),
      getJobsCollection(),
      getCompaniesCollection(),
    ]);

    // 1. Seed Administrator if empty (admin@sallet.hire ONLY)
    const adminCount = await adminsCol.countDocuments();
    if (adminCount === 0 && administratorCollection.length > 0) {
      await adminsCol.insertMany(administratorCollection);
    }

    // 2. Seed Jobs if empty (Sallet IT Soft 3 Bhubaneswar roles)
    const jobsCount = await jobsCol.countDocuments();
    if (jobsCount === 0) {
      await jobsCol.insertMany(INITIAL_JOBS);
    }

    // 3. Seed Companies if empty
    const compCount = await companiesCol.countDocuments();
    if (compCount === 0) {
      await companiesCol.insertMany(INITIAL_COMPANIES);
    }

    isSeeded = true;
  } catch (err: any) {
    console.warn('Database initialization note:', err?.message || err);
  } finally {
    isSeeding = false;
  }
}
