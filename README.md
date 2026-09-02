# Sallet Hire — Modern AI-Ready Hiring & Recruitment Platform

A high-fidelity demo & prototype of **Sallet Hire**, a proprietary product by **Sallet IT Soft**.

Sallet Hire is a full-featured hiring marketplace and recruitment suite engineered with modern UI/UX, transparent metrics, multi-template resume building, and visual ATS recruitment pipelines.

---

## 🚀 Key Features & Product Portals

- **Candidate Experience**:
  - **Homepage & Job Search**: Smart search bar with autocomplete suggestions, location dropdown, and trending search pills.
  - **Job Directory & Multi-Filtering**: Salary slider (₹ LPA), experience level, work modes, job types, and Indian tech hub filters (Bhubaneswar, Bengaluru, Hyderabad, Pune, Mumbai, Delhi-NCR, Remote).
  - **1-Click Application Flow**: Confetti feedback, resume selection, profile verification, and direct transition to application tracking.
  - **Application Tracker**: 5-stage visual progress timeline (`Applied → Screening → Shortlisted → Interview → Decision`).
  - **Resume Builder**: 3 professional templates (*Modern Tech*, *Executive Clean*, *Minimalist ATS*) with print and PDF generation.
  - **Saved Jobs & Custom Job Alerts**: Real-time bookmarking and daily/weekly email alert simulations.

- **Employer / Recruiter ATS**:
  - **ATS Cockpit**: Active openings, applicant counts, and visual 5-stage hiring funnel.
  - **Post a Job**: Multi-section posting form with desktop live card preview.
  - **Applicant Pipeline ATS**: Interactive **Kanban Board** & **List View** with 1-click stage progression and private recruiter notes.
  - **Manage Postings**: Job status toggling (`Active`, `Paused`, `Closed`).
  - **Company Branding**: Culture and benefits editor.

- **Admin Portal**:
  - SuperAdmin overview, employer verification approvals queue, and platform audit logs.

- **Demo Simulation Persona Bar**:
  - Switch anytime between Candidate (*Aditya Sharma*), Recruiter (*Priya Nair @ Sallet Tech*), and Admin (*Ananya Sen*).

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Lucide Icons + Canvas Confetti
- **Service Layer Boundary**: Decoupled async service layer (`lib/services/`) ready for REST / MongoDB migration.
- **Permission Boundaries**: Route guard wrappers enforcing role policies across candidate, employer, and admin routes.

---

## 💻 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
