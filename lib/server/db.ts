import { Collection } from 'mongodb';
import { getDatabase } from './mongodb';
import { Job, Application, Company } from '../types';
import { AuthUserRecord, candidateCollection, recruiterCollection, adminCollection } from './collections';
import { INITIAL_JOBS, INITIAL_COMPANIES, INITIAL_APPLICATIONS } from '../mock-data';

// Collection names in the MongoDB Atlas "Hiring" database
export const COLLECTIONS = {
  CANDIDATES: 'candidates',
  RECRUITERS: 'recruiters',
  ADMINS: 'admins',
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

export async function getAdminsCollection(): Promise<Collection<AuthUserRecord>> {
  const db = await getDatabase();
  return db.collection<AuthUserRecord>(COLLECTIONS.ADMINS);
}

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
 * Runs once safely if collections are empty.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  if (isSeeded) return;
  const now = Date.now();
  if (isSeeding || now - lastSeedAttempt < 20000) return;

  isSeeding = true;
  lastSeedAttempt = now;

  try {
    const [
      candidatesCol,
      recruitersCol,
      adminsCol,
      jobsCol,
      applicationsCol,
      companiesCol,
    ] = await Promise.all([
      getCandidatesCollection(),
      getRecruitersCollection(),
      getAdminsCollection(),
      getJobsCollection(),
      getApplicationsCollection(),
      getCompaniesCollection(),
    ]);

    // 1. Seed Candidates if empty
    const candCount = await candidatesCol.countDocuments();
    if (candCount === 0) {
      await candidatesCol.insertMany(candidateCollection);
    }

    // 2. Seed Recruiters if empty
    const recCount = await recruitersCol.countDocuments();
    if (recCount === 0) {
      await recruitersCol.insertMany(recruiterCollection);
    }

    // 3. Seed Admins if empty
    const adminCount = await adminsCol.countDocuments();
    if (adminCount === 0) {
      await adminsCol.insertMany(adminCollection);
    }

    // 4. Seed Jobs if empty (Sallet IT Soft 3 Bhubaneswar roles)
    const jobsCount = await jobsCol.countDocuments();
    if (jobsCount === 0) {
      await jobsCol.insertMany(INITIAL_JOBS);
    }

    // 5. Seed Companies if empty
    const compCount = await companiesCol.countDocuments();
    if (compCount === 0) {
      await companiesCol.insertMany(INITIAL_COMPANIES);
    }

    // 6. Seed Applications if empty
    const appCount = await applicationsCol.countDocuments();
    if (appCount === 0 && INITIAL_APPLICATIONS.length > 0) {
      await applicationsCol.insertMany(INITIAL_APPLICATIONS);
    }

    isSeeded = true;
  } catch (err: any) {
    console.warn('Database seeding note:', err?.message || err);
  } finally {
    isSeeding = false;
  }
}
