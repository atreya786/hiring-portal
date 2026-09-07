import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(minLPA: number, maxLPA: number, isDisclosed: boolean = true): string {
  if (!isDisclosed) return 'Not Disclosed';
  if (minLPA === maxLPA) return `₹${minLPA} LPA`;
  return `₹${minLPA} - ${maxLPA} LPA`;
}

export function formatExperience(minYears: number, maxYears: number): string {
  if (minYears === 0 && maxYears === 0) return 'Fresher';
  if (minYears === 0) return `0 - ${maxYears} Yrs`;
  if (minYears === maxYears) return `${minYears}+ Yrs`;
  return `${minYears} - ${maxYears} Yrs`;
}

export function formatWorkMode(mode: string): string {
  switch (mode.toLowerCase()) {
    case 'on-site':
      return 'On-site';
    case 'hybrid':
      return 'Hybrid';
    case 'remote':
      return 'Remote';
    default:
      return mode;
  }
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getGmailComposeUrl(job: {
  title?: string;
  applyEmail?: string;
  applySubject?: string;
  applyBody?: string;
}): string {
  const recipient = job.applyEmail || 'hr@sallet.in';
  const subject = job.applySubject || `Application for ${job.title || 'Role'} - [Your Name]`;
  const body =
    job.applyBody ||
    `Dear Hiring Team,\n\nI am writing to express my interest in the ${job.title || 'open'} role at Bhubaneswar.\n\nTotal Experience: \nCurrent Location: \nNotice Period: \nLinkedIn Profile: \n\nPlease find my resume attached.\n\nBest regards,\n[Your Name]\n[Your Phone Number]`;

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

