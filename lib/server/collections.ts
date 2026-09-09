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

// Hashed version of 'Adminsallet@hire26' using bcrypt (salt rounds = 10)
export const ADMIN_INITIAL_PASSWORD_HASH =
  '$2b$10$kD6TCAUJS80skQ7SPEgmF.CP8M9wauwTVFcOfizsGZAHNv1Pww2ba';

/**
 * 1. Candidate / Job Seeker Collection (Clean & Empty by default)
 */
export const candidateCollection: AuthUserRecord[] = [];

/**
 * 2. Recruiter / Employer Collection (Clean & Empty by default)
 */
export const recruiterCollection: AuthUserRecord[] = [];

/**
 * 3. Platform Administrator Collection (Contains ONLY initial admin account)
 * Email: admin@sallet.hire
 */
export const administratorCollection: AuthUserRecord[] = [
  {
    id: 'usr_admin_root',
    email: 'admin@sallet.hire',
    passwordHash: ADMIN_INITIAL_PASSWORD_HASH,
    name: 'Platform Administrator',
    role: 'admin',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-09-09T00:00:00Z',
  },
];

export const adminCollection = administratorCollection;

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
 * 1. candidates
 * 2. recruiters
 * 3. administrators
 *
 * First queries MongoDB Atlas; falls back to memory arrays if DB is unavailable.
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
      getAdministratorsCollection,
    } = await import('./db');

    await seedDatabaseIfEmpty();

    const [candidatesCol, recruitersCol, adminsCol] = await Promise.all([
      getCandidatesCollection(),
      getRecruitersCollection(),
      getAdministratorsCollection(),
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

    // 3. Check Administrators collection in MongoDB
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
    console.warn('MongoDB query warning in auth, evaluating fallback collections:', dbErr);
  }

  // Fallback to local memory collections if MongoDB is temporarily unreachable
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

  const admin = administratorCollection.find(
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
 * Registers a new user into MongoDB Atlas under candidates or recruiters collection
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
      getAdministratorsCollection,
    } = await import('./db');

    await seedDatabaseIfEmpty();

    const [candidatesCol, recruitersCol, adminsCol] = await Promise.all([
      getCandidatesCollection(),
      getRecruitersCollection(),
      getAdministratorsCollection(),
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
    const { getCandidatesCollection, getRecruitersCollection, getAdministratorsCollection } =
      await import('./db');
    const [candidatesCol, recruitersCol, adminsCol] = await Promise.all([
      getCandidatesCollection(),
      getRecruitersCollection(),
      getAdministratorsCollection(),
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

  const allUsers = [...candidateCollection, ...recruiterCollection, ...administratorCollection];
  const user = allUsers.find((u) => u.id === id);
  return user ? sanitize(user) : null;
}
