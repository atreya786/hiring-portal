import {
  Company,
  Job,
  Candidate,
  Application,
  JobAlert,
  Article,
  PlatformStats,
  User
} from './types';

export const DEMO_USERS: Record<string, User> = {
  candidate: {
    id: 'usr_cand_01',
    name: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    role: 'candidate',
    candidateId: 'cand_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10T10:00:00Z',
  },
  employer: {
    id: 'usr_emp_01',
    name: 'Priya Nair',
    email: 'priya.nair@salletitsoft.com',
    role: 'employer',
    companyId: 'comp_sallet',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-11-15T09:30:00Z',
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Ananya Sen',
    email: 'ananya.sen@sallethire.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-08-01T08:00:00Z',
  },
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp_sallet',
    name: 'Sallet IT Soft Pvt. Ltd.',
    slug: 'sallet-it-soft',
    logo: '/logo.png',
    tagline: 'Engineering the next wave of enterprise SaaS & AI infrastructure.',
    verified: true,
    website: 'https://salletitsoft.com',
    location: 'Bhubaneswar, Odisha',
    industry: 'IT & Software Development',
    size: '100-250 employees',
    foundedYear: 2021,
    about:
      'Sallet IT Soft Pvt. Ltd. is a fast-growing technology powerhouse building modern cloud enterprise applications, scalable APIs, and intelligent hiring platforms. Headquartered in Bhubaneswar, Odisha.',
    culture: [
      'Innovation-driven environment with quarterly hackathons',
      'Flexible hybrid schedule with remote Fridays',
      'Annual learning and certification stipend',
      'Merit-based rapid career trajectory',
    ],
    benefits: [
      'Health insurance (₹5 Lakh family cover)',
      'Flexible working hours & hybrid flexibility',
      'Performance-based quarterly bonuses',
      'MacBook Pro & ergonomic home-office budget',
      'Paid paternal and maternal leave',
    ],
    rating: 4.8,
    reviewCount: 42,
    activeJobsCount: 3,
    reviews: [
      {
        id: 'rev_1',
        authorName: 'Rohan Pattnaik',
        authorRole: 'Senior Full Stack Engineer',
        rating: 5,
        title: 'Outstanding technical culture & strong engineering leadership',
        comment:
          'Working at Sallet has been an incredible accelerator for my tech career. Modern tech stack (Next.js, Go, AWS) and very collaborative teammates.',
        pros: 'Supportive managers, flexible hours, competitive salary packages.',
        cons: 'Fast-paced sprints during product releases.',
        date: '2025-01-14',
      },
      {
        id: 'rev_2',
        authorName: 'Sneha Mohanty',
        authorRole: 'Product Designer',
        rating: 4.6,
        title: 'Great work-life balance and deep focus on design quality',
        comment:
          'Design is treated as a first-class citizen here. Lots of freedom to run user research and build polished UI design systems.',
        pros: 'Empowered designers, great tools, open feedback culture.',
        cons: 'Cross-timezone coordination with global enterprise clients.',
        date: '2024-12-05',
      },
    ],
  },
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job_01',
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    companyVerified: true,
    title: 'Full Stack Developer',
    slug: 'full-stack-developer',
    department: 'Engineering',
    location: 'Bhubaneswar, Odisha (On-site)',
    workMode: 'on-site',
    type: 'Full-time',
    jobType: 'full-time',
    experience: '0–2 years',
    experienceLevel: '0-1',
    minExperienceYears: 0,
    maxExperienceYears: 2,
    salaryMinLPA: 3,
    salaryMaxLPA: 6,
    isSalaryDisclosed: false,
    salary: 'As per industry standards',
    about:
      'We are looking for a skilled Full Stack Developer to build and maintain modern web applications. You will work across both front-end and back-end systems, collaborating with design and product teams to deliver clean, scalable, and responsive web solutions. Freshers with strong project experience or candidates with up to 2 years of experience are welcome to apply.',
    description:
      'We are looking for a skilled Full Stack Developer to build and maintain modern web applications. You will work across both front-end and back-end systems, collaborating with design and product teams to deliver clean, scalable, and responsive web solutions. Freshers with strong project experience or candidates with up to 2 years of experience are welcome to apply.',
    responsibilities: [
      'Develop scalable front-end interfaces using Next.js / React',
      'Build secure backend services, REST APIs, and database integrations',
      'Collaborate with designers to translate UI/UX designs into high-quality code',
      'Write clean, maintainable, and well-documented code',
      'Optimize applications for maximum speed and scalability',
      'Troubleshoot, debug, and upgrade existing software',
    ],
    requirements: [
      'Strong knowledge of JavaScript / TypeScript, React, and Next.js',
      'Experience or familiarity with backend technologies (Node.js, Express, or similar)',
      'Understanding of databases (MongoDB, PostgreSQL, or MySQL)',
      'Familiarity with version control using Git and GitHub',
      'Good problem-solving skills and eagerness to learn',
    ],
    niceToHave: [
      'Experience deploying apps on Vercel, AWS, or similar cloud platforms',
      'Familiarity with Tailwind CSS and modern UI libraries',
      'Personal projects or open-source contributions',
    ],
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Git'],
    preferredSkills: ['MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Vercel / AWS'],
    benefits: [
      'Competitive Compensation',
      'Mentorship & Career Growth',
      'Modern Tech Stack',
      'Performance Incentives',
    ],
    openings: 2,
    status: 'active',
    postedAt: '2025-03-01T10:00:00Z',
    expiresAt: '2025-04-30T23:59:59Z',
    viewsCount: 142,
    applicantCount: 12,
    isFeatured: true,
    isUrgent: true,
    applyEmail: 'hr@sallet.in',
    applySubject: 'Application for Full Stack Developer - [Your Name]',
    applyBody: `Dear Hiring Team,

I am writing to express my interest in the Full Stack Developer role at Bhubaneswar.

Total Experience: 
Current Location: 
Notice Period: 
Portfolio/GitHub: 
LinkedIn Profile: 

Please find my resume attached.

Best regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'job_02',
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    companyVerified: true,
    title: 'IT Sales Executive',
    slug: 'it-sales-executive',
    department: 'Sales & Business Development',
    location: 'Bhubaneswar, Odisha (On-site)',
    workMode: 'on-site',
    type: 'Full-time',
    jobType: 'full-time',
    experience: '0–5 years',
    experienceLevel: '0-1',
    minExperienceYears: 0,
    maxExperienceYears: 5,
    salaryMinLPA: 3,
    salaryMaxLPA: 8,
    isSalaryDisclosed: false,
    salary: 'As per industry standards',
    about:
      'We are seeking an energetic and results-driven IT Sales Executive to identify business opportunities, generate leads, and drive sales for our software and digital solutions. The ideal candidate should have excellent communication skills, a proactive attitude, and the ability to understand client requirements and pitch appropriate technical solutions. Both freshers with strong communication skills and experienced sales professionals are encouraged to apply.',
    description:
      'We are seeking an energetic and results-driven IT Sales Executive to identify business opportunities, generate leads, and drive sales for our software and digital solutions. The ideal candidate should have excellent communication skills, a proactive attitude, and the ability to understand client requirements and pitch appropriate technical solutions. Both freshers with strong communication skills and experienced sales professionals are encouraged to apply.',
    responsibilities: [
      'Generate qualified leads through cold calling, email outreach, networking, and social media',
      'Pitch IT services, software products, and consulting solutions to potential clients',
      'Understand client needs and present customized solutions',
      'Build and maintain strong, long-term client relationships',
      'Meet and exceed monthly and quarterly sales targets',
      'Prepare sales proposals, negotiate terms, and close deals',
      'Stay updated with industry trends and market competition',
    ],
    requirements: [
      "Bachelor's degree in Business, Marketing, IT, or related field",
      'Strong verbal and written communication skills',
      'Confident presentation and negotiation abilities',
      'Self-motivated with a goal-oriented mindset',
      'Familiarity with CRM tools and sales pipelines is a plus',
    ],
    niceToHave: [
      'Prior experience in B2B or IT services sales',
      'Understanding of software development life cycles and tech terminology',
      'Strong network in regional or national business communities',
    ],
    requiredSkills: [
      'B2B Sales',
      'Lead Generation',
      'Client Relationship Management',
      'Negotiation',
      'Cold Outreach',
    ],
    preferredSkills: ['IT Solutions Pitching', 'CRM Tools', 'Sales Presentations'],
    benefits: [
      'Attractive Sales Incentives & Bonuses',
      'Comprehensive Training Program',
      'Accelerated Career Growth',
      'Travel Allowances',
    ],
    openings: 3,
    status: 'active',
    postedAt: '2025-03-02T09:00:00Z',
    expiresAt: '2025-04-30T23:59:59Z',
    viewsCount: 185,
    applicantCount: 16,
    isFeatured: true,
    isUrgent: false,
    applyEmail: 'hr@sallet.in',
    applySubject: 'Application for IT Sales Executive - [Your Name]',
    applyBody: `Dear Hiring Team,

I am writing to express my interest in the IT Sales Executive role at Bhubaneswar.

Total Experience: 
Current Location: 
Notice Period: 
Key Strengths: 
LinkedIn Profile: 

Please find my resume attached.

Best regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'job_03',
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    companyVerified: true,
    title: 'HR Manager',
    slug: 'hr-manager',
    department: 'Human Resources',
    location: 'Bhubaneswar, Odisha (On-site)',
    workMode: 'on-site',
    type: 'Full-time',
    jobType: 'full-time',
    experience: '2–5 years',
    experienceLevel: '1-3',
    minExperienceYears: 2,
    maxExperienceYears: 5,
    qualification: 'MBA in HR',
    salary: 'As per industry standards',
    salaryMinLPA: 4,
    salaryMaxLPA: 8,
    isSalaryDisclosed: false,
    about:
      'We are looking for an experienced HR Manager to oversee human resources operations, talent acquisition, employee engagement, and organizational policies. The ideal candidate will bridge management and employee relations, ensuring a productive, compliant, and positive work culture.',
    description:
      'We are looking for an experienced HR Manager to oversee human resources operations, talent acquisition, employee engagement, and organizational policies. The ideal candidate will bridge management and employee relations, ensuring a productive, compliant, and positive work culture.',
    responsibilities: [
      'Manage the end-to-end recruitment lifecycle for technical and non-technical roles',
      'Develop and implement HR policies, employee handbooks, and standard operating procedures',
      'Drive employee engagement, performance appraisal systems, and retention strategies',
      'Handle employee grievances, conflict resolution, and workplace culture initiatives',
      'Ensure compliance with statutory labor laws and regulations',
      'Coordinate onboarding, training programs, and offboarding processes',
      'Maintain accurate HR records and documentation',
    ],
    requirements: [
      'MBA in HR (Human Resource Management) is required',
      '2–5 years of relevant HR experience, preferably in the IT or services industry',
      'In-depth knowledge of recruitment strategies, labor laws, and HR best practices',
      'Strong interpersonal, conflict-resolution, and leadership skills',
      'Excellent verbal and written communication abilities',
    ],
    niceToHave: [
      'Experience with HRMS tools and applicant tracking systems (ATS)',
      'Experience designing appraisal frameworks and KPI tracking',
      'Familiarity with fast-paced startup or tech company environments',
    ],
    requiredSkills: [
      'Talent Acquisition',
      'HR Policies & Compliance',
      'Employee Engagement',
      'Performance Management',
      'Statutory Labor Laws',
    ],
    preferredSkills: ['HRMS Tools', 'ATS Management', 'Conflict Resolution', 'Onboarding'],
    benefits: [
      'Industry-Standard Compensation',
      'Health Insurance Coverage',
      'Executive Leadership Exposure',
      'Annual Performance Appraisal',
    ],
    openings: 1,
    status: 'active',
    postedAt: '2025-03-03T11:00:00Z',
    expiresAt: '2025-04-30T23:59:59Z',
    viewsCount: 220,
    applicantCount: 9,
    isFeatured: true,
    isUrgent: true,
    applyEmail: 'hr@sallet.in',
    applySubject: 'Application for HR Manager - [Your Name]',
    applyBody: `Dear Hiring Team,

I am writing to express my interest in the HR Manager role at Bhubaneswar.

Qualification: MBA in HR
Total Experience: 
Current Location: 
Notice Period: 
Current/Expected CTC: 
LinkedIn Profile: 

Please find my resume attached.

Best regards,
[Your Name]
[Your Phone Number]`,
  },
];

export const INITIAL_CANDIDATE: Candidate = {
  id: 'cand_01',
  userId: 'usr_cand_01',
  fullName: 'Aditya Sharma',
  headline: 'Senior Full Stack Developer | React, Next.js, Node.js & Cloud',
  email: 'aditya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bhubaneswar, Odisha',
  currentRole: 'Software Engineer',
  experienceYears: 4,
  currentSalaryLPA: 8.5,
  expectedSalaryLPA: 13,
  noticePeriodDays: 30,
  about: 'Enthusiastic and product-minded software engineer with 4+ years of hands-on experience architecting modern web apps. Passionate about performant user interfaces, clean component architecture, and scalable Node.js microservices. Always excited to solve tough engineering challenges.',
  skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'AWS', 'REST APIs', 'Git'],
  experience: [
    {
      id: 'exp_1',
      title: 'Full Stack Engineer',
      company: 'Apex CodeCraft Technologies',
      location: 'Bhubaneswar, Odisha',
      startDate: '2023-01',
      isCurrent: true,
      description: 'Built customer-facing SaaS dashboards with Next.js App Router, increasing page load speeds by 42%. Engineered REST microservices in Node.js and PostgreSQL handling 50k+ daily transactions.',
    },
    {
      id: 'exp_2',
      title: 'Frontend Developer',
      company: 'InnovateX Digital Solutions',
      location: 'Bengaluru, Karnataka',
      startDate: '2021-06',
      endDate: '2022-12',
      isCurrent: false,
      description: 'Developed responsive web applications with React, Redux, and Tailwind CSS. Integrated REST APIs and implemented automated unit tests with Jest.',
    },
  ],
  education: [
    {
      id: 'edu_1',
      degree: 'B.Tech in Computer Science & Engineering',
      fieldOfStudy: 'Computer Science',
      institution: 'Odisha University of Technology and Research (OUTR)',
      startYear: 2017,
      endYear: 2021,
      grade: '8.8 CGPA',
    },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'DocuFlow - Collaborative Document Editor',
      description: 'Real-time rich text editor built with Next.js, WebSockets, and operational transforms, supporting live multi-user editing and PDF generation.',
      skills: ['Next.js', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
      link: 'https://docuflow.example.com',
      githubUrl: 'https://github.com/aditya/docuflow',
    },
    {
      id: 'proj_2',
      title: 'FinTrack - Expense & Invoice Tracker',
      description: 'Personal finance and GST invoice tracker with automated bank statement parsing and visual monthly budgeting charts.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Chart.js'],
      link: 'https://fintrack.example.com',
      githubUrl: 'https://github.com/aditya/fintrack',
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect - Associate',
    'Meta Certified Front-End Developer',
  ],
  languages: ['English (Fluent)', 'Hindi (Fluent)', 'Odia (Native)'],
  resumeUrl: '/sample-resume-aditya-sharma.pdf',
  resumeName: 'Aditya_Sharma_FullStack_Resume.pdf',
  resumeUpdatedAt: '2025-02-20T10:00:00Z',
  resumeTemplateId: 'modern-tech',
  links: {
    linkedin: 'https://linkedin.com/in/aditya-sharma-dev',
    github: 'https://github.com/aditya-dev',
    portfolio: 'https://adityasharma.dev',
  },
  preferredLocations: ['Bhubaneswar', 'Bengaluru', 'Hyderabad', 'Remote'],
  preferredWorkModes: ['hybrid', 'remote'],
  profileCompletionPercentage: 85,
};

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_01',
    jobId: 'job_01',
    candidateId: 'cand_01',
    candidateName: 'Aditya Sharma',
    candidateEmail: 'aditya.sharma@example.com',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    candidateHeadline: 'Senior Full Stack Developer | React, Next.js, Node.js',
    candidateLocation: 'Bhubaneswar, Odisha',
    candidateExperienceYears: 4,
    candidateSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    jobTitle: 'Senior React / Next.js Developer',
    jobLocation: 'Bhubaneswar, Odisha',
    jobWorkMode: 'hybrid',
    appliedAt: '2025-02-28T11:20:00Z',
    stage: 'interview',
    resumeUrl: '/sample-resume-aditya-sharma.pdf',
    resumeName: 'Aditya_Sharma_FullStack_Resume.pdf',
    coverNote: 'Excited about Sallet IT Soft Pvt. Ltd. and eager to contribute to the core frontend platform.',
    recruiterNotes: 'Candidate demonstrated deep understanding of Next.js 15 App Router and performance profiling. Moving to technical round.',
    rating: 5,
    interviewDate: '2025-03-05T14:00:00Z',
    timeline: [
      {
        stage: 'applied',
        title: 'Application Submitted',
        description: 'Your application was received by Sallet IT Soft Pvt. Ltd..',
        date: '2025-02-28T11:20:00Z',
        completed: true,
      },
      {
        stage: 'screening',
        title: 'Resume Screened',
        description: 'Recruiter reviewed your profile and matched required technical competencies.',
        date: '2025-03-01T09:30:00Z',
        completed: true,
      },
      {
        stage: 'shortlisted',
        title: 'Shortlisted for Technical Rounds',
        description: 'Shortlisted by the engineering hiring committee.',
        date: '2025-03-02T10:15:00Z',
        completed: true,
      },
      {
        stage: 'interview',
        title: 'Technical Round 1 Scheduled',
        description: 'Virtual video interview scheduled for March 5, 2:00 PM IST.',
        date: '2025-03-02T16:00:00Z',
        completed: true,
      },
      {
        stage: 'selected',
        title: 'Final Selection / Offer',
        description: 'Pending completion of interviews.',
        date: '',
        completed: false,
      },
    ],
  },
  {
    id: 'app_02',
    jobId: 'job_02',
    candidateId: 'cand_01',
    candidateName: 'Aditya Sharma',
    candidateEmail: 'aditya.sharma@example.com',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    candidateHeadline: 'IT Business Developer',
    candidateLocation: 'Bhubaneswar, Odisha',
    candidateExperienceYears: 3,
    candidateSkills: ['B2B Sales', 'Lead Generation', 'Client Relations', 'CRM'],
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    jobTitle: 'IT Sales Executive',
    jobLocation: 'Bhubaneswar, Odisha (On-site)',
    jobWorkMode: 'on-site',
    appliedAt: '2025-02-26T15:10:00Z',
    stage: 'screening',
    resumeUrl: '/sample-resume-aditya-sharma.pdf',
    resumeName: 'Aditya_Sharma_Sales_Resume.pdf',
    coverNote: 'Strong interest in driving software sales and client partnerships.',
    timeline: [
      {
        stage: 'applied',
        title: 'Application Submitted',
        description: 'Application successfully received by Sallet IT Soft Pvt. Ltd.',
        date: '2025-02-26T15:10:00Z',
        completed: true,
      },
      {
        stage: 'screening',
        title: 'Under Review by Talent Team',
        description: 'Talent acquisition is reviewing qualifications and portfolio.',
        date: '2025-02-27T11:00:00Z',
        completed: true,
      },
      {
        stage: 'shortlisted',
        title: 'Shortlist Decision',
        description: 'Pending reviewer feedback.',
        date: '',
        completed: false,
      },
    ],
  },
  {
    id: 'app_03',
    jobId: 'job_03',
    candidateId: 'cand_01',
    candidateName: 'Aditya Sharma',
    candidateEmail: 'aditya.sharma@example.com',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    candidateHeadline: 'HR & Talent Operations Specialist',
    candidateLocation: 'Bhubaneswar, Odisha',
    candidateExperienceYears: 4,
    candidateSkills: ['Talent Acquisition', 'HR Policies', 'Employee Relations', 'Compliance'],
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    jobTitle: 'HR Manager',
    jobLocation: 'Bhubaneswar, Odisha (On-site)',
    jobWorkMode: 'on-site',
    appliedAt: '2025-02-25T14:40:00Z',
    stage: 'shortlisted',
    resumeUrl: '/sample-resume-aditya-sharma.pdf',
    resumeName: 'Aditya_Sharma_HR_Resume.pdf',
    coverNote: 'Hands-on experience managing recruitment pipelines and onboarding.',
    timeline: [
      {
        stage: 'applied',
        title: 'Application Submitted',
        description: 'Application received by Sallet IT Soft Pvt. Ltd.',
        date: '2025-02-25T14:40:00Z',
        completed: true,
      },
      {
        stage: 'screening',
        title: 'Profile Passed Initial Filter',
        description: 'HR leadership reviewed experience.',
        date: '2025-02-26T16:00:00Z',
        completed: true,
      },
      {
        stage: 'shortlisted',
        title: 'Shortlisted for Next Round',
        description: 'Selected for hiring manager conversation.',
        date: '2025-02-28T09:00:00Z',
        completed: true,
      },
    ],
  },
  // Additional candidates applying to Sallet Jobs for Recruiter ATS Demo
  {
    id: 'app_rec_01',
    jobId: 'job_01',
    candidateId: 'cand_02',
    candidateName: 'Pooja Dash',
    candidateEmail: 'pooja.dash@example.com',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    candidateHeadline: 'Frontend Engineer | React, Next.js, Redux',
    candidateLocation: 'Bhubaneswar, Odisha',
    candidateExperienceYears: 3,
    candidateSkills: ['React', 'Next.js', 'Redux Toolkit', 'TypeScript', 'Tailwind CSS'],
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    jobTitle: 'Senior React / Next.js Developer',
    jobLocation: 'Bhubaneswar, Odisha',
    jobWorkMode: 'hybrid',
    appliedAt: '2025-03-01T08:15:00Z',
    stage: 'shortlisted',
    resumeUrl: '/sample-resume.pdf',
    resumeName: 'Pooja_Dash_Frontend.pdf',
    coverNote: 'Passionate about frontend architecture and design systems.',
    recruiterNotes: 'Strong portfolio with nice micro-interactions. Clean code samples.',
    rating: 4,
    timeline: [
      { stage: 'applied', title: 'Applied', description: 'Application received.', date: '2025-03-01T08:15:00Z', completed: true },
      { stage: 'screening', title: 'Screened', description: 'Passed initial screening.', date: '2025-03-01T14:00:00Z', completed: true },
      { stage: 'shortlisted', title: 'Shortlisted', description: 'Shortlisted for tech round.', date: '2025-03-02T11:30:00Z', completed: true },
    ],
  },
  {
    id: 'app_rec_02',
    jobId: 'job_01',
    candidateId: 'cand_03',
    candidateName: 'Rahul Verma',
    candidateEmail: 'rahul.verma@example.com',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    candidateHeadline: 'Senior UI Engineer | Next.js & Performance Specialist',
    candidateLocation: 'Bengaluru, Karnataka',
    candidateExperienceYears: 5,
    candidateSkills: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'Web Vitals'],
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    jobTitle: 'Senior React / Next.js Developer',
    jobLocation: 'Bhubaneswar, Odisha',
    jobWorkMode: 'hybrid',
    appliedAt: '2025-03-01T09:45:00Z',
    stage: 'screening',
    resumeUrl: '/sample-resume.pdf',
    resumeName: 'Rahul_Verma_Resume.pdf',
    rating: 4,
    timeline: [
      { stage: 'applied', title: 'Applied', description: 'Application received.', date: '2025-03-01T09:45:00Z', completed: true },
      { stage: 'screening', title: 'In Review', description: 'Under technical review.', date: '2025-03-01T16:00:00Z', completed: true },
    ],
  },
  {
    id: 'app_rec_03',
    jobId: 'job_01',
    candidateId: 'cand_04',
    candidateName: 'Debabrata Rout',
    candidateEmail: 'debabrata.rout@example.com',
    candidateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    candidateHeadline: 'Full Stack Developer | React & Node.js',
    candidateLocation: 'Cuttack, Odisha',
    candidateExperienceYears: 3,
    candidateSkills: ['React', 'Node.js', 'Express', 'MongoDB'],
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    jobTitle: 'Senior React / Next.js Developer',
    jobLocation: 'Bhubaneswar, Odisha',
    jobWorkMode: 'hybrid',
    appliedAt: '2025-02-28T16:20:00Z',
    stage: 'applied',
    resumeUrl: '/sample-resume.pdf',
    resumeName: 'Debabrata_Rout.pdf',
    timeline: [
      { stage: 'applied', title: 'Applied', description: 'Application received.', date: '2025-02-28T16:20:00Z', completed: true },
    ],
  },
  {
    id: 'app_rec_04',
    jobId: 'job_01',
    candidateId: 'cand_05',
    candidateName: 'Swati Tripathy',
    candidateEmail: 'swati.t@example.com',
    candidateAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    candidateHeadline: 'Lead Frontend Architect | 7 Years Exp',
    candidateLocation: 'Hyderabad, Telangana',
    candidateExperienceYears: 7,
    candidateSkills: ['React', 'Next.js', 'Design Systems', 'Microfrontends', 'Architecture'],
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    jobTitle: 'Senior React / Next.js Developer',
    jobLocation: 'Bhubaneswar, Odisha',
    jobWorkMode: 'hybrid',
    appliedAt: '2025-02-27T10:00:00Z',
    stage: 'selected',
    resumeUrl: '/sample-resume.pdf',
    resumeName: 'Swati_Tripathy_Lead.pdf',
    recruiterNotes: 'Exceptional candidate. All rounds cleared with top marks. Offer letter extended at 16 LPA.',
    rating: 5,
    timeline: [
      { stage: 'applied', title: 'Applied', description: 'Application received.', date: '2025-02-27T10:00:00Z', completed: true },
      { stage: 'screening', title: 'Screened', description: 'Passed screening.', date: '2025-02-27T12:00:00Z', completed: true },
      { stage: 'shortlisted', title: 'Shortlisted', description: 'Shortlisted.', date: '2025-02-27T16:00:00Z', completed: true },
      { stage: 'interview', title: 'Interviews Completed', description: 'All technical and managerial rounds cleared.', date: '2025-03-01T15:00:00Z', completed: true },
      { stage: 'selected', title: 'Selected & Offer Sent', description: 'Offer extended.', date: '2025-03-02T12:00:00Z', completed: true },
    ],
  },
  {
    id: 'app_rec_05',
    jobId: 'job_01',
    candidateId: 'cand_06',
    candidateName: 'Vikas Mishra',
    candidateEmail: 'vikas.m@example.com',
    candidateAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    candidateHeadline: 'Junior Web Developer',
    candidateLocation: 'Bhubaneswar, Odisha',
    candidateExperienceYears: 1,
    candidateSkills: ['HTML', 'CSS', 'JavaScript'],
    companyId: 'comp_sallet',
    companyName: 'Sallet IT Soft Pvt. Ltd.',
    companyLogo: '/logo.png',
    jobTitle: 'Senior React / Next.js Developer',
    jobLocation: 'Bhubaneswar, Odisha',
    jobWorkMode: 'hybrid',
    appliedAt: '2025-02-26T11:00:00Z',
    stage: 'rejected',
    resumeUrl: '/sample-resume.pdf',
    resumeName: 'Vikas_Mishra.pdf',
    recruiterNotes: 'Does not meet the minimum 3+ years Senior requirement. Suggested applying to Junior/Fresher openings.',
    rating: 2,
    timeline: [
      { stage: 'applied', title: 'Applied', description: 'Application received.', date: '2025-02-26T11:00:00Z', completed: true },
      { stage: 'rejected', title: 'Not Shortlisted', description: 'Experience profile did not meet senior requirement.', date: '2025-02-27T10:00:00Z', completed: true },
    ],
  },
];

export const INITIAL_SAVED_JOB_IDS: string[] = ['job_01', 'job_02', 'job_03'];

export const INITIAL_JOB_ALERTS: JobAlert[] = [
  {
    id: 'alert_1',
    candidateId: 'cand_01',
    title: 'React & Next.js Developers in Bhubaneswar',
    keywords: ['React', 'Next.js', 'Frontend'],
    location: 'Bhubaneswar, Odisha',
    frequency: 'daily',
    active: true,
    createdAt: '2025-02-15T10:00:00Z',
    matchCount: 4,
  },
  {
    id: 'alert_2',
    candidateId: 'cand_01',
    title: 'Remote DevOps & Cloud Roles',
    keywords: ['DevOps', 'AWS', 'Kubernetes'],
    location: 'Remote',
    frequency: 'weekly',
    active: true,
    createdAt: '2025-02-18T14:30:00Z',
    matchCount: 7,
  },
];

export const ARTICLES: Article[] = [
  {
    id: 'art_1',
    title: 'How to Crack Frontend Engineering Interviews at High-Growth Startups',
    slug: 'crack-frontend-engineering-interviews',
    category: 'Interviews',
    description: 'A structured breakdown of modern React architecture questions, Web Vitals optimization, and live coding expectations in 2025.',
    readTimeMinutes: 6,
    publishedAt: '2025-02-20',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    authorName: 'Siddharth Patnaik',
    authorRole: 'Engineering Director @ Sallet',
    tags: ['Frontend', 'React', 'Interviews', 'Tech Career'],
    content: `
### The New Bar for Frontend Engineers

Recruiting teams at high-growth tech companies have moved far beyond basic trivia questions like *"What is the virtual DOM?"*. Today's technical evaluations focus on real-world engineering capability, component architecture, state management patterns, and Core Web Vitals optimization.

#### 1. Master Modern Next.js and React 19 Paradigms
- Understand React Server Components (RSC) vs Client Components.
- Be comfortable explaining streaming SSR, Suspense boundaries, and hydration mismatches.
- Know when to utilize server actions vs dedicated API routes.

#### 2. System Design for the Web
When asked to design a feed, e-commerce cart, or real-time document editor:
- Start with API contract and data flow.
- Discuss caching strategies (SWR, React Query, HTTP Cache-Control).
- Explain rendering optimizations (virtualized lists, memoization, layout shift prevention).

#### 3. Behavioral and Product Ownership
Show hiring managers that you care about user experience metrics (LCP under 2.5s, zero layout shifts) and team productivity rather than just writing isolated code.
    `,
  },
  {
    id: 'art_2',
    title: 'Resume Formatting That Passes ATS Screening Without Getting Filtered',
    slug: 'resume-formatting-passes-ats-screening',
    category: 'Resume',
    description: 'Essential rules for structuring your technical resume, optimizing keywords, and quantifying project achievements.',
    readTimeMinutes: 5,
    publishedAt: '2025-02-18',
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    authorName: 'Priya Nair',
    authorRole: 'Head of Talent @ Sallet Hire',
    tags: ['Resume', 'ATS', 'Job Search', 'Career Growth'],
    content: `
### Why Most Resumes Get Rejected Before a Human Reads Them

Applicant Tracking Systems (ATS) scan hundreds of resumes daily. If your resume uses non-standard tables, embedded images for text, or unusual column layouts, key details may fail to parse.

#### Key Principles for High-Scoring Resumes:
1. **Use Standard Section Headers**: Stick to *Experience*, *Education*, *Skills*, *Projects*, and *Certifications*.
2. **Quantify Your Impact**: Use the Google XYZ formula: *"Accomplished [X], as measured by [Y], by doing [Z]"*. Example: *“Reduced dashboard load time by 45% (LCP from 3.2s to 1.7s) by refactoring to Next.js App Router and dynamic image optimization.”*
3. **Align Technical Keywords**: Mention exact technologies in your skills list (e.g. *TypeScript*, *PostgreSQL*, *Docker*, *Tailwind CSS*) rather than vague descriptors.
    `,
  },
  {
    id: 'art_3',
    title: 'Top 7 Emerging Tech Hubs in India Beyond the Metros: The Rise of Bhubaneswar & Pune',
    slug: 'top-emerging-tech-hubs-india-bhubaneswar-pune',
    category: 'Career Growth',
    description: 'Why tier-2 and coastal tech hubs are attracting major SaaS enterprises, global capability centers, and top engineering talent.',
    readTimeMinutes: 7,
    publishedAt: '2025-02-14',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    authorName: 'Aman Agarwal',
    authorRole: 'Tech Ecosystem Analyst',
    tags: ['Tech Ecosystem', 'Bhubaneswar', 'Pune', 'Work Culture'],
    content: `
### The Decentralization of Indian Tech Talent

With world-class infrastructure, top educational institutions (IITs, NITs, IIITs), and significant cost-of-living advantages, cities like Bhubaneswar, Cuttack, Pune, and Kochi are rapidly transforming into vibrant innovation powerhouses.

Major IT giants and fast-scaling venture-backed startups are establishing dedicated centers of excellence in these hubs, creating lucrative high-impact opportunities for engineers seeking a high quality of life.
    `,
  },
  {
    id: 'art_4',
    title: 'The Fresher Engineering Guide: How to Land Your First Tech Job in 2025',
    slug: 'fresher-engineering-guide-first-tech-job',
    category: 'Freshers',
    description: 'Step-by-step roadmap for new graduates to build real-world project portfolios, contribute to open source, and ace coding assessments.',
    readTimeMinutes: 8,
    publishedAt: '2025-02-10',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    authorName: 'Debabrata Das',
    authorRole: 'Campus Placement Mentor',
    tags: ['Freshers', 'Campus Placement', 'First Job', 'Coding Roadmap'],
    content: `
### Moving From Academic Projects to Production Readiness

Don't submit generic college final-year clone projects like a basic to-do list. Recruiters look for candidates who have built applications that solve practical problems, handle edge cases, and demonstrate genuine technical curiosity.

1. **Build 2 Full-Stack Projects with Authentication and Database Persistence.**
2. **Deploy Live on Vercel or AWS with a clean GitHub README.**
3. **Practice Core Data Structures & Algorithms regularly.**
    `,
  },
];

export const DEMO_PLATFORM_STATS: PlatformStats = {
  totalJobs: 1248,
  totalCompanies: 520,
  totalCandidates: 28400,
  totalApplications: 64200,
  verifiedCompanies: 410,
  activePostings: 890,
  interviewsScheduled: 3450,
  successPlacements: 1820,
  isDemoData: true,
};
