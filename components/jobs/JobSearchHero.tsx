'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight, Sparkles, TrendingUp, X } from 'lucide-react';
import { Button } from '../ui/Button';

const SUGGESTIONS = [
  'Senior React / Next.js Developer',
  'Backend Engineer (Node.js & Go)',
  'Senior Data Analyst (SQL & Python)',
  'DevOps & Cloud Engineer (AWS / Kubernetes)',
  'Product Designer (UI/UX & Design Systems)',
  'Full Stack Engineer (MERN / Python)',
  'Junior Software Engineer (Fresher / Trainee)',
  'Enterprise B2B Sales Executive',
  'Application Security Engineer',
  'Mobile App Developer (React Native)',
];

const POPULAR_SEARCH_TAGS = [
  { label: 'React Developer', query: 'React' },
  { label: 'Next.js', query: 'Next.js' },
  { label: 'Fresher Jobs', query: 'Fresher' },
  { label: 'Bhubaneswar Jobs', location: 'Bhubaneswar' },
  { label: 'Data Analyst', query: 'Data' },
  { label: 'DevOps & AWS', query: 'DevOps' },
  { label: 'Remote Only', location: 'Remote' },
];

export function JobSearchHero({
  initialQuery = '',
  initialLocation = '',
  onSearch,
  compact = false,
}: {
  initialQuery?: string;
  initialLocation?: string;
  onSearch?: (q: string, loc: string) => void;
  compact?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 1) {
      const q = query.toLowerCase();
      const matches = SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 5);
      setFilteredSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = (q: string = query, loc: string = location) => {
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(q, loc);
    } else {
      const params = new URLSearchParams();
      if (q.trim()) params.set('query', q.trim());
      if (loc.trim() && loc !== 'All') params.set('location', loc.trim());
      router.push(`/jobs?${params.toString()}`);
    }
  };

  const handleTagClick = (tag: { query?: string; location?: string }) => {
    const targetQ = tag.query || '';
    const targetLoc = tag.location || '';
    setQuery(targetQ);
    setLocation(targetLoc);
    handleExecuteSearch(targetQ, targetLoc);
  };

  return (
    <div className="w-full space-y-3" ref={searchRef}>
      {/* Search Input Box Card */}
      <div
        className={`bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center gap-2 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 ${
          compact ? 'p-1.5 shadow-sm' : ''
        }`}
      >
        {/* Keyword Input */}
        <div className="flex-1 relative flex items-center min-w-0 px-3 py-1.5 md:py-0">
          <Search className="w-5 h-5 text-indigo-600 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecuteSearch()}
            onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
            placeholder="Job title, skills (e.g. React, Node.js), or company"
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Suggestions
              </div>
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    handleExecuteSearch(item, location);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider on Desktop */}
        <div className="hidden md:block w-px h-8 bg-slate-200 my-auto" />

        {/* Location Selector */}
        <div className="flex-1 md:max-w-xs relative flex items-center min-w-0 px-3 py-1.5 md:py-0 border-t md:border-t-0 border-slate-100">
          <MapPin className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="">All Locations / Remote</option>
            <option value="Bhubaneswar">Bhubaneswar, Odisha</option>
            <option value="Cuttack">Cuttack, Odisha</option>
            <option value="Bengaluru">Bengaluru, Karnataka</option>
            <option value="Hyderabad">Hyderabad, Telangana</option>
            <option value="Pune">Pune, Maharashtra</option>
            <option value="Mumbai">Mumbai, Maharashtra</option>
            <option value="Delhi NCR">Delhi NCR / Gurugram</option>
            <option value="Noida">Noida, UP</option>
            <option value="Remote">Remote Only</option>
          </select>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => handleExecuteSearch()}
          variant="primary"
          size={compact ? 'md' : 'lg'}
          className="rounded-xl font-bold px-6 shadow-md shadow-indigo-600/20"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Search Jobs
        </Button>
      </div>

      {/* Popular Searches Pills */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
          <span className="flex items-center gap-1 font-semibold text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            Popular:
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag.label}
              onClick={() => handleTagClick(tag)}
              className="bg-white/80 hover:bg-white hover:text-indigo-600 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs font-medium transition-all cursor-pointer"
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
