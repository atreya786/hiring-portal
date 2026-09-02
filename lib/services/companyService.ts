import { Company } from '../types';
import { INITIAL_COMPANIES } from '../mock-data';

const STORAGE_KEY_COMPANIES = 'sallet_companies_v1';

function getStoredCompanies(): Company[] {
  if (typeof window === 'undefined') return INITIAL_COMPANIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPANIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(INITIAL_COMPANIES));
      return INITIAL_COMPANIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPANIES;
  }
}

function saveCompanies(companies: Company[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(companies));
  } catch (err) {
    console.error('Failed to save companies to storage', err);
  }
}

export async function getCompanies(params?: {
  query?: string;
  industry?: string;
  location?: string;
}): Promise<Company[]> {
  const companies = getStoredCompanies();
  if (!params) return companies;

  let filtered = [...companies];
  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }

  if (params.industry && params.industry !== 'All') {
    filtered = filtered.filter((c) =>
      c.industry.toLowerCase().includes(params.industry!.toLowerCase())
    );
  }

  if (params.location && params.location !== 'All') {
    filtered = filtered.filter((c) =>
      c.location.toLowerCase().includes(params.location!.toLowerCase())
    );
  }

  return filtered;
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const companies = getStoredCompanies();
  const comp = companies.find((c) => c.id === id || c.slug === id);
  return comp || null;
}

export async function updateCompany(
  companyId: string,
  updates: Partial<Company>
): Promise<Company | null> {
  const companies = getStoredCompanies();
  const idx = companies.findIndex((c) => c.id === companyId);
  if (idx === -1) return null;

  companies[idx] = { ...companies[idx], ...updates };
  saveCompanies(companies);
  return companies[idx];
}

export async function verifyCompany(companyId: string, verified: boolean): Promise<Company | null> {
  return updateCompany(companyId, { verified });
}
