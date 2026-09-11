import { NextResponse } from 'next/server';
import { getJobsCollection, seedDatabaseIfEmpty } from '@/lib/server/db';
import { Job } from '@/lib/types';
import { INITIAL_JOBS } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    await seedDatabaseIfEmpty();
    const jobsCol = await getJobsCollection();
    const jobs = await jobsCol.find({}).sort({ order: 1, postedAt: -1 }).toArray();

    // Remove MongoDB internal _id or map cleanly
    const sanitizedJobs = jobs.map(({ _id, ...rest }: any) => rest as Job);

    return NextResponse.json({ success: true, jobs: sanitizedJobs });
  } catch (error: any) {
    console.warn('GET /api/jobs database fallback engaged:', error?.message);
    return NextResponse.json({ success: true, jobs: INITIAL_JOBS, fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    await seedDatabaseIfEmpty();
    const jobsCol = await getJobsCollection();
    const body = await request.json();

    const newJob: Job = {
      ...body,
      id: body.id || `job_${Date.now()}`,
      postedAt: body.postedAt || new Date().toISOString(),
      viewsCount: body.viewsCount || 0,
      applicantCount: body.applicantCount || 0,
    };

    await jobsCol.insertOne(newJob as any);

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/jobs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save job to database.' },
      { status: 500 }
    );
  }
}
