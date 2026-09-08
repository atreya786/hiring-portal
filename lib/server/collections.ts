import bcrypt from 'bcryptjs';

export interface AuthUserRecord {
  id: string;
  email: string;
  passwordHash: string; // bcrypt hash — NEVER plain text
  name: string;
  role: 'candidate' | 'recruiter' | 'admin';
  avatar?: string;
  candidateId?: string;
  companyId?: string;
  createdAt: string;
}

export type SanitizedUser = Omit<AuthUserRecord, 'passwordHash'>;

// Hashed version of 'Password@123' using bcrypt (salt rounds = 10)
const DEFAULT_PASSWORD_HASH = '$2b$10$q0m6nJWE27CLC3sHwN2Em.Y9wTsvMfiCqq.FM6Ommn3fYgAz1SCeC';

/**
 * 1. Candidate / Job Seeker Collection
 */
export const candidateCollection: AuthUserRecord[] = [
  {
    id: 'usr_cand_01',
    email: 'candidate@sallet.in',
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: 'Aditya Sharma',
    role: 'candidate',
    candidateId: 'cand_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'usr_cand_02',
    email: 'aditya.sharma@example.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: 'Aditya Sharma',
    role: 'candidate',
    candidateId: 'cand_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10T10:00:00Z',
  },
];

/**
 * 2. Recruiter / Employer Collection
 */
export const recruiterCollection: AuthUserRecord[] = [
  {
    id: 'usr_rec_01',
    email: 'recruiter@sallet.in',
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: 'Priya Nair',
    role: 'recruiter',
    companyId: 'comp_sallet',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-11-15T09:30:00Z',
  },
  {
    id: 'usr_rec_02',
    email: 'priya.nair@salletitsoft.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: 'Priya Nair',
    role: 'recruiter',
    companyId: 'comp_sallet',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-11-15T09:30:00Z',
  },
];

/**
 * 3. Platform Administrator Collection
 */
export const adminCollection: AuthUserRecord[] = [
  {
    id: 'usr_admin_01',
    email: 'admin@sallet.in',
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: 'Ananya Sen',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-08-01T08:00:00Z',
  },
  {
    id: 'usr_admin_02',
    email: 'ananya.sen@sallethire.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: 'Ananya Sen',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-08-01T08:00:00Z',
  },
];

function sanitize(user: AuthUserRecord): SanitizedUser {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

export interface AuthResult {
  user: SanitizedUser;
  role: 'candidate' | 'recruiter' | 'admin';
  redirectTo: string;
}

/**
 * Backend authentication flow checking across the 3 collections in sequence:
 * 1. Candidate collection
 * 2. Recruiter collection
 * 3. Admin collection
 *
 * First queries MongoDB Atlas; falls back to seed arrays if DB is unavailable.
 */
export async function authenticateAcrossCollections(
  email: string,
  plainPassword: string
): Promise<AuthResult | null> {
  if (!email || !plainPassword) return null;

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const {
      seedDatabaseIfEmpty,
      getCandidatesCollection,
      getRecruitersCollection,
      getAdminsCollection,
    } = await import('./db');

    await seedDatabaseIfEmpty();

    const [candidatesCol, recruitersCol, adminsCol] = await Promise.all([
      getCandidatesCollection(),
      getRecruitersCollection(),
      getAdminsCollection(),
    ]);

    // 1. Check Candidate collection in MongoDB
    const cand = await candidatesCol.findOne({ email: normalizedEmail });
    if (cand) {
      const isMatch = await bcrypt.compare(plainPassword, cand.passwordHash);
      if (isMatch) {
        return {
          user: sanitize(cand),
          role: 'candidate',
          redirectTo: '/candidate/dashboard',
        };
      }
      return null;
    }

    // 2. Check Recruiter collection in MongoDB
    const rec = await recruitersCol.findOne({ email: normalizedEmail });
    if (rec) {
      const isMatch = await bcrypt.compare(plainPassword, rec.passwordHash);
      if (isMatch) {
        return {
          user: sanitize(rec),
          role: 'recruiter',
          redirectTo: '/recruiter/dashboard',
        };
      }
      return null;
    }

    // 3. Check Admin collection in MongoDB
    const adm = await adminsCol.findOne({ email: normalizedEmail });
    if (adm) {
      const isMatch = await bcrypt.compare(plainPassword, adm.passwordHash);
      if (isMatch) {
        return {
          user: sanitize(adm),
          role: 'admin',
          redirectTo: '/admin/dashboard',
        };
      }
      return null;
    }

    return null;
  } catch (dbErr) {
    console.warn('MongoDB query error, falling back to local collections:', dbErr);
  }

  // Fallback to local memory collections if MongoDB is disconnected
  const candidate = candidateCollection.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (candidate) {
    const isMatch = await bcrypt.compare(plainPassword, candidate.passwordHash);
    if (isMatch) {
      return {
        user: sanitize(candidate),
        role: 'candidate',
        redirectTo: '/candidate/dashboard',
      };
    }
    return null;
  }

  const recruiter = recruiterCollection.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (recruiter) {
    const isMatch = await bcrypt.compare(plainPassword, recruiter.passwordHash);
    if (isMatch) {
      return {
        user: sanitize(recruiter),
        role: 'recruiter',
        redirectTo: '/recruiter/dashboard',
      };
    }
    return null;
  }

  const admin = adminCollection.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (admin) {
    const isMatch = await bcrypt.compare(plainPassword, admin.passwordHash);
    if (isMatch) {
      return {
        user: sanitize(admin),
        role: 'admin',
        redirectTo: '/admin/dashboard',
      };
    }
    return null;
  }

  return null;
}

/**
 * Registers a new user into MongoDB Atlas under the candidate or recruiter collection
 */
export async function registerUserInDb(params: {
  email: string;
  password: string;
  name: string;
  role: 'candidate' | 'recruiter' | 'employer';
  phone?: string;
  companyName?: string;
}): Promise<{ success: boolean; user?: SanitizedUser; error?: string }> {
  const normalizedEmail = params.email.trim().toLowerCase();
  const targetRole: 'candidate' | 'recruiter' =
    params.role === 'employer' ? 'recruiter' : params.role;

  try {
    const {
      seedDatabaseIfEmpty,
      getCandidatesCollection,
      getRecruitersCollection,
      getAdminsCollection,
    } = await import('./db');

    await seedDatabaseIfEmpty();

    const [candidatesCol, recruitersCol, adminsCol] = await Promise.all([
      getCandidatesCollection(),
      getRecruitersCollection(),
      getAdminsCollection(),
    ]);

    // Ensure unique email across all collections
    const exists =
      (await candidatesCol.findOne({ email: normalizedEmail })) ||
      (await recruitersCol.findOne({ email: normalizedEmail })) ||
      (await adminsCol.findOne({ email: normalizedEmail }));

    if (exists) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const passwordHash = await bcrypt.hash(params.password, 10);
    const userId = `usr_${targetRole}_${Date.now()}`;
    const newRecord: AuthUserRecord = {
      id: userId,
      email: normalizedEmail,
      passwordHash,
      name: params.name.trim(),
      role: targetRole,
      createdAt: new Date().toISOString(),
      candidateId: targetRole === 'candidate' ? `cand_${Date.now()}` : undefined,
      companyId: targetRole === 'recruiter' ? 'comp_sallet' : undefined,
    };

    if (targetRole === 'candidate') {
      await candidatesCol.insertOne(newRecord);
    } else {
      await recruitersCol.insertOne(newRecord);
    }

    return { success: true, user: sanitize(newRecord) };
  } catch (err: any) {
    console.error('Registration MongoDB error:', err);
    return { success: false, error: 'Could not complete registration. Database error.' };
  }
}

export async function getUserById(id: string): Promise<SanitizedUser | null> {
  try {
    const { getCandidatesCollection, getRecruitersCollection, getAdminsCollection } =
      await import('./db');
    const [candidatesCol, recruitersCol, adminsCol] = await Promise.all([
      getCandidatesCollection(),
      getRecruitersCollection(),
      getAdminsCollection(),
    ]);

    const cand = await candidatesCol.findOne({ id });
    if (cand) return sanitize(cand);

    const rec = await recruitersCol.findOne({ id });
    if (rec) return sanitize(rec);

    const adm = await adminsCol.findOne({ id });
    if (adm) return sanitize(adm);
  } catch (err) {
    // Fall back to memory
  }

  const allUsers = [...candidateCollection, ...recruiterCollection, ...adminCollection];
  const user = allUsers.find((u) => u.id === id);
  return user ? sanitize(user) : null;
}
