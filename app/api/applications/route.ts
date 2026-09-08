import { NextResponse } from 'next/server';
import { getApplicationsCollection, getJobsCollection, seedDatabaseIfEmpty } from '@/lib/server/db';
import { Application } from '@/lib/types';

export async function GET(request: Request) {
  try {
    await seedDatabaseIfEmpty();
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('candidateId');
    const jobId = searchParams.get('jobId');
    const companyId = searchParams.get('companyId');

    const filter: any = {};
    if (candidateId) filter.candidateId = candidateId;
    if (jobId) filter.jobId = jobId;
    if (companyId) filter.companyId = companyId;

    const appsCol = await getApplicationsCollection();
    const apps = await appsCol.find(filter).sort({ appliedAt: -1 }).toArray();

    const sanitizedApps = apps.map(({ _id, ...rest }: any) => rest as Application);

    return NextResponse.json({ success: true, applications: sanitizedApps });
  } catch (error: any) {
    console.warn('GET /api/applications database fallback engaged:', error?.message);
    return NextResponse.json({ success: true, applications: [], fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    await seedDatabaseIfEmpty();
    const appsCol = await getApplicationsCollection();
    const jobsCol = await getJobsCollection();
    const body = await request.json();

    const now = new Date().toISOString();
    const newApplication: Application = {
      id: body.id || `app_${Date.now()}`,
      jobId: body.jobId,
      jobTitle: body.jobTitle,
      jobLocation: body.jobLocation || 'Bhubaneswar, Odisha (On-site)',
      jobWorkMode: body.jobWorkMode || 'on-site',
      companyId: body.companyId || 'comp_sallet',
      companyName: body.companyName || 'Sallet IT Soft Pvt. Ltd.',
      companyLogo: body.companyLogo || '/logo.png',
      candidateId: body.candidateId || 'cand_01',
      candidateName: body.candidateName,
      candidateEmail: body.candidateEmail,
      candidateHeadline: body.candidateHeadline || 'Candidate',
      candidateLocation: body.candidateLocation || 'Bhubaneswar, Odisha',
      candidateExperienceYears: body.candidateExperienceYears || 0,
      candidateSkills: body.candidateSkills || [],
      resumeUrl: body.resumeUrl || '#',
      resumeName: body.resumeName || 'Resume.pdf',
      coverNote: body.coverNote || '',
      stage: 'applied',
      appliedAt: now,
      timeline: [
        {
          stage: 'applied',
          title: 'Application Submitted',
          description: 'Your application has been received and added to the review pipeline.',
          date: now,
          completed: true,
        },
      ],
    };

    await appsCol.insertOne(newApplication as any);

    // Update job applicant count
    if (body.jobId) {
      await jobsCol.updateOne(
        { id: body.jobId },
        { $inc: { applicantCount: 1 } }
      );
    }

    return NextResponse.json({ success: true, application: newApplication }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/applications error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application to database.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stage, notes, rating } = body;

    if (!id || !stage) {
      return NextResponse.json(
        { success: false, error: 'Application id and stage are required.' },
        { status: 400 }
      );
    }

    const appsCol = await getApplicationsCollection();
    const now = new Date().toISOString();

    const stageTitles: Record<string, string> = {
      applied: 'Application Received',
      screening: 'Under Review by Talent Team',
      shortlisted: 'Candidate Shortlisted',
      interview: 'Interview Scheduled',
      selected: 'Selected & Offer Process',
      rejected: 'Application Not Selected',
    };

    const newTimelineEvent = {
      stage,
      title: stageTitles[stage] || `Stage updated to ${stage}`,
      description: notes || `Application moved to stage: ${stage}`,
      date: now,
      completed: true,
    };

    const updateDoc: any = {
      $set: {
        stage,
        ...(notes ? { recruiterNotes: notes } : {}),
        ...(rating !== undefined ? { rating } : {}),
      },
      $push: {
        timeline: newTimelineEvent,
      },
    };

    await appsCol.updateOne({ id }, updateDoc);
    const updated = await appsCol.findOne({ id });

    return NextResponse.json({ success: true, application: updated });
  } catch (error: any) {
    console.error('PATCH /api/applications error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update application.' },
      { status: 500 }
    );
  }
}
