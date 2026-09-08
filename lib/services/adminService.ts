import { PlatformStats } from '../types';
import { DEMO_PLATFORM_STATS } from '../mock-data';

export async function getPlatformStats(): Promise<PlatformStats> {
  return DEMO_PLATFORM_STATS;
}
 
export async function getRecentAuditLogs(): Promise<
  Array<{ id: string; user: string; role: string; action: string; timestamp: string }>
> {
  return [
    {
      id: 'log_1',
      user: 'Priya Nair (Sallet Tech)',
      role: 'employer',
      action: 'Posted new job: Senior React / Next.js Developer',
      timestamp: '10 mins ago',
    },
    {
      id: 'log_2',
      user: 'Aditya Sharma',
      role: 'candidate',
      action: 'Submitted application to Sallet IT Soft Pvt. Ltd.',
      timestamp: '25 mins ago',
    },
    { 
      id: 'log_3',
      user: 'Ananya Sen (SuperAdmin)',
      role: 'admin',
      action: 'Verified company profile: CloudScale India',
      timestamp: '1 hour ago',
    },
    {
      id: 'log_4',
      user: 'Sallet IT Soft Pvt. Ltd.',
      role: 'employer',
      action: 'Shortlisted candidates for Full Stack Developer',
      timestamp: '2 hours ago',
    },
  ];
}
