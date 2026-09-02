'use client';

import React from 'react';
import { Candidate } from '../../lib/types';
import { Mail, Phone, MapPin, Globe, Calendar, ExternalLink } from 'lucide-react';

interface ResumePreviewProps {
  candidate: Candidate;
  templateId?: 'modern-tech' | 'executive-clean' | 'minimalist-classic';
}

export function ResumePreview({
  candidate,
  templateId = 'modern-tech',
}: ResumePreviewProps) {
  if (templateId === 'executive-clean') {
    return (
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-300 shadow-xl max-w-3xl mx-auto text-slate-900 font-sans space-y-6 print:shadow-none print:border-none">
        {/* Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-slate-900">
            {candidate.fullName}
          </h1>
          <p className="text-sm font-semibold text-slate-600">{candidate.headline}</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 pt-1">
            <span>{candidate.email}</span>
            <span>&bull;</span>
            <span>{candidate.phone}</span>
            <span>&bull;</span>
            <span>{candidate.location}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{candidate.about}</p>
        </div>

        {/* Work Experience */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
            Experience
          </h2>
          {candidate.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                <span className="text-xs text-slate-500 font-medium">
                  {exp.startDate} &ndash; {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600">
                {exp.company} &bull; {exp.location}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed pt-0.5">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
            Education
          </h2>
          {candidate.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline text-xs">
              <div>
                <p className="font-bold text-slate-900">{edu.degree}</p>
                <p className="text-slate-600">{edu.institution}</p>
              </div>
              <span className="text-slate-500">
                {edu.startYear} &ndash; {edu.endYear} {edu.grade && `(${edu.grade})`}
              </span>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
            Core Competencies & Skills
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{candidate.skills.join(', ')}</p>
        </div>
      </div>
    );
  }

  if (templateId === 'minimalist-classic') {
    return (
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xl max-w-3xl mx-auto text-slate-900 font-mono space-y-6 text-xs print:shadow-none print:border-none">
        <div className="pb-4 border-b border-slate-300">
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wider">{candidate.fullName}</h1>
          <p className="text-slate-600 font-sans mt-0.5">{candidate.headline}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {candidate.email} | {candidate.phone} | {candidate.location}
          </p>
        </div>

        <div className="space-y-1">
          <p className="font-bold uppercase tracking-wider text-slate-800">[ ABOUT ]</p>
          <p className="font-sans text-slate-700 leading-relaxed text-xs">{candidate.about}</p>
        </div>

        <div className="space-y-3">
          <p className="font-bold uppercase tracking-wider text-slate-800">[ EXPERIENCE ]</p>
          {candidate.experience.map((exp) => (
            <div key={exp.id} className="space-y-0.5 font-sans">
              <div className="flex justify-between font-bold text-slate-900 text-xs">
                <span>{exp.title} &mdash; {exp.company}</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {exp.startDate}..{exp.isCurrent ? 'NOW' : exp.endDate}
                </span>
              </div>
              <p className="text-xs text-slate-600">{exp.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="font-bold uppercase tracking-wider text-slate-800">[ SKILLS ]</p>
          <p className="font-sans text-xs text-slate-700">{candidate.skills.join(' / ')}</p>
        </div>
      </div>
    );
  }

  // Modern Tech template (Default)
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl mx-auto overflow-hidden print:shadow-none print:border-none">
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {candidate.fullName}
            </h1>
            <p className="text-indigo-300 text-sm font-semibold mt-1">{candidate.headline}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-4 border-t border-slate-800/80 mt-4">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            {candidate.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-indigo-400" />
            {candidate.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            {candidate.location}
          </span>
          {candidate.links?.portfolio && (
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Globe className="w-3.5 h-3.5" />
              {candidate.links.portfolio}
            </span>
          )}
        </div>
      </div>

      {/* 2-Column Body */}
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{candidate.about}</p>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1">
              Work Experience
            </h2>
            {candidate.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                  <span className="text-xs text-indigo-600 font-semibold">
                    {exp.startDate} &ndash; {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {exp.company} &bull; {exp.location}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>
              </div>
            ))}
          </div>

          {/* Key Projects */}
          {candidate.projects && candidate.projects.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1">
                Featured Projects
              </h2>
              {candidate.projects.map((proj) => (
                <div key={proj.id} className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.skills.map((s) => (
                      <span key={s} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1">
              Skills & Tools
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2.5 py-1 rounded-md font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1">
              Education
            </h2>
            {candidate.education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <p className="font-bold text-slate-900">{edu.degree}</p>
                <p className="text-slate-600">{edu.institution}</p>
                <p className="text-slate-400">
                  {edu.startYear} - {edu.endYear} {edu.grade && `(${edu.grade})`}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          {candidate.certifications && candidate.certifications.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1">
                Certifications
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {candidate.certifications.map((c, i) => (
                  <p key={i} className="font-medium">&bull; {c}</p>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {candidate.languages && candidate.languages.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1">
                Languages
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {candidate.languages.map((lang, i) => (
                  <p key={i}>&bull; {lang}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
