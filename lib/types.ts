export type UserRole = 'candidate' | 'recruiter' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  companyId?: string; // If employer
  candidateId?: string; // If candidate
  createdAt: string;
}

export type WorkMode = 'on-site' | 'hybrid' | 'remote';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'fresher' | '0-1' | '1-3' | '3-5' | '5+';
export type JobStatus = 'active' | 'draft' | 'paused' | 'closed';

export interface CompanyReview {
  id: string;
  authorName: string;
  authorRole: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  pros: string;
  cons: string;
  date: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  verified: boolean;
  website: string;
  location: string;
  industry: string;
  size: string; // e.g. "50-200 employees"
  foundedYear: number;
  about: string;
  culture: string[];
  benefits: string[];
  rating: number;
  reviewCount: number;
  activeJobsCount: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  reviews: CompanyReview[];
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  companyVerified: boolean;
  title: string;
  slug: string;
  department: string;
  location: string;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  minExperienceYears: number;
  maxExperienceYears: number;
  salaryMinLPA: number; // In Lakhs Per Annum (INR)
  salaryMaxLPA: number;
  isSalaryDisclosed: boolean;
  jobType: JobType;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  benefits: string[];
  openings: number;
  status: JobStatus;
  postedAt: string; // ISO date string
  expiresAt: string;
  viewsCount: number;
  applicantCount: number;
  isFeatured?: boolean;
  isUrgent?: boolean;
  type?: string;
  experience?: string;
  qualification?: string;
  salary?: string;
  about?: string;
  niceToHave?: string[];
  applyEmail?: string;
  applySubject?: string;
  applyBody?: string;
  order?: number;
  duration?: string;
  workHours?: string;
  whoCanApply?: string[];
  whatYoullGain?: string[];
  toolsAndTech?: Record<string, string[]>;
  selectionProcess?: string;
  selectionNotes?: string[];
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startYear: number;
  endYear: number;
  grade?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  link?: string;
  githubUrl?: string;
}

export interface Candidate {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  experienceYears: number;
  currentSalaryLPA?: number;
  expectedSalaryLPA: number;
  noticePeriodDays: number;
  about: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: string[];
  languages: string[];
  resumeUrl: string;
  resumeName: string;
  resumeUpdatedAt: string;
  resumeTemplateId: 'modern-tech' | 'executive-clean' | 'minimalist-classic';
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  preferredLocations: string[];
  preferredWorkModes: WorkMode[];
  profileCompletionPercentage: number;
}

export type ApplicationStage = 'applied' | 'screening' | 'shortlisted' | 'interview' | 'selected' | 'rejected';

export interface ApplicationTimelineEvent {
  stage: ApplicationStage;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateAvatar?: string;
  candidateHeadline: string;
  candidateLocation: string;
  candidateExperienceYears: number;
  candidateSkills: string[];
  companyId: string;
  companyName: string;
  companyLogo: string;
  jobTitle: string;
  jobLocation: string;
  jobWorkMode: WorkMode;
  appliedAt: string;
  stage: ApplicationStage;
  resumeUrl: string;
  resumeName: string;
  coverNote?: string;
  recruiterNotes?: string;
  rating?: number; // 1 to 5
  interviewDate?: string;
  interviewNotes?: string;
  timeline: ApplicationTimelineEvent[];
}

export interface JobAlert {
  id: string;
  candidateId: string;
  title: string;
  keywords: string[];
  location: string;
  frequency: 'daily' | 'weekly';
  active: boolean;
  createdAt: string;
  matchCount: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'Resume' | 'Interviews' | 'Job Search' | 'Skills' | 'Freshers' | 'Career Growth' | 'Employers';
  description: string;
  content: string;
  authorName: string;
  authorRole: string;
  readTimeMinutes: number;
  publishedAt: string;
  coverImage: string;
  tags: string[];
}

export interface JobFilterParams {
  query?: string;
  location?: string;
  locations?: string[];
  experienceLevel?: string[];
  minSalary?: number;
  maxSalary?: number;
  jobTypes?: JobType[];
  workModes?: WorkMode[];
  industries?: string[];
  datePostedDays?: number;
  sortBy?: 'relevance' | 'newest' | 'salary-high' | 'experience-low';
}

export interface PlatformStats {
  totalJobs: number;
  totalCompanies: number;
  totalCandidates: number;
  totalApplications: number;
  verifiedCompanies: number;
  activePostings: number;
  interviewsScheduled: number;
  successPlacements: number;
  isDemoData: true;
}
