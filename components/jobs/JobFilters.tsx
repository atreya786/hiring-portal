'use client';

import React from 'react';
import { JobFilterParams, WorkMode, JobType } from '../../lib/types';
import { RangeSlider } from '../ui/RangeSlider';
import { Button } from '../ui/Button';
import { RotateCcw, Briefcase, IndianRupee, Laptop, Calendar, Filter } from 'lucide-react';

interface JobFiltersProps {
  filters: JobFilterParams;
  onChange: (newFilters: JobFilterParams) => void;
  onReset: () => void;
  totalResultsCount?: number;
}


const EXPERIENCE_LEVELS: Array<{ label: string; value: string }> = [
  { label: 'Fresher (0 yrs)', value: 'fresher' },
  { label: '0 - 1 Years', value: '0-1' },
  { label: '1 - 3 Years', value: '1-3' },
  { label: '3 - 5 Years', value: '3-5' },
  { label: '5+ Years', value: '5+' },
];

const WORK_MODES: Array<{ label: string; value: WorkMode }> = [
  { label: 'On-site', value: 'on-site' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Remote', value: 'remote' },
];

const JOB_TYPES: Array<{ label: string; value: JobType }> = [
  { label: 'Full Time', value: 'full-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Part Time', value: 'part-time' },
];

const DATE_POSTED_OPTIONS: Array<{ label: string; days: number }> = [
  { label: 'Any time', days: 0 },
  { label: 'Last 24 Hours', days: 1 },
  { label: 'Last 3 Days', days: 3 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
];

export function JobFilters({
  filters,
  onChange,
  onReset,
  totalResultsCount,
}: JobFiltersProps) {
  const handleExpToggle = (exp: string) => {
    const current = filters.experienceLevel || [];
    const updated = current.includes(exp)
      ? current.filter((e) => e !== exp)
      : [...current, exp];
    onChange({ ...filters, experienceLevel: updated });
  };

  const handleWorkModeToggle = (mode: WorkMode) => {
    const current = filters.workModes || [];
    const updated = current.includes(mode)
      ? current.filter((m) => m !== mode)
      : [...current, mode];
    onChange({ ...filters, workModes: updated });
  };

  const handleJobTypeToggle = (jt: JobType) => {
    const current = filters.jobTypes || [];
    const updated = current.includes(jt)
      ? current.filter((t) => t !== jt)
      : [...current, jt];
    onChange({ ...filters, jobTypes: updated });
  };

  const hasActiveFilters =
    (filters.experienceLevel && filters.experienceLevel.length > 0) ||
    (filters.workModes && filters.workModes.length > 0) ||
    (filters.jobTypes && filters.jobTypes.length > 0) ||
    (filters.minSalary && filters.minSalary > 0) ||
    (filters.datePostedDays && filters.datePostedDays > 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Filter Jobs</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Salary Slider */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
          Min Salary (LPA)
        </label>
        <RangeSlider
          min={0}
          max={25}
          step={1}
          value={filters.minSalary || 0}
          onChange={(val) => onChange({ ...filters, minSalary: val })}
          formatValue={(v) => (v === 0 ? 'Any Salary' : `₹${v} LPA+`)}
        />
      </div>

      {/* Experience Level */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          Experience
        </label>
        <div className="space-y-1.5">
          {EXPERIENCE_LEVELS.map((exp) => {
            const isChecked = filters.experienceLevel?.includes(exp.value) || false;
            return (
              <label
                key={exp.value}
                className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleExpToggle(exp.value)}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>{exp.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Work Mode */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          <Laptop className="w-3.5 h-3.5 text-slate-400" />
          Work Mode
        </label>
        <div className="flex flex-wrap gap-2">
          {WORK_MODES.map((mode) => {
            const isSelected = filters.workModes?.includes(mode.value) || false;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => handleWorkModeToggle(mode.value)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Type */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          Job Type
        </label>
        <div className="space-y-1.5">
          {JOB_TYPES.map((jt) => {
            const isChecked = filters.jobTypes?.includes(jt.value) || false;
            return (
              <label
                key={jt.value}
                className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleJobTypeToggle(jt.value)}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>{jt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Date Posted */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Date Posted
        </label>
        <select
          value={filters.datePostedDays || 0}
          onChange={(e) => onChange({ ...filters, datePostedDays: Number(e.target.value) })}
          className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          {DATE_POSTED_OPTIONS.map((opt) => (
            <option key={opt.days} value={opt.days} className="dark:bg-slate-800 dark:text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
