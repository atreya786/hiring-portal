'use client';

import React, { useState, useEffect } from 'react';
import { getCompanies } from '../../lib/services';
import { Company } from '../../lib/types';
import { CompanyCard } from '../../components/companies/CompanyCard';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Search, Building2, MapPin, Filter } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [query, setQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCompanies({
          query,
          industry: selectedIndustry !== 'All' ? selectedIndustry : undefined,
          location: selectedLocation !== 'All' ? selectedLocation : undefined,
        });
        setCompanies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query, selectedIndustry, selectedLocation]);

  const industries = [
    'All',
    'IT & Software Development',
  ];

  const locations = [
    'All',
    'Bhubaneswar, Odisha',
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-4">
          <Breadcrumbs items={[{ label: 'Companies', href: '/companies' }]} />

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Featured Employer
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Explore Sallet IT Soft Pvt. Ltd.
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Research engineering culture, employee ratings, benefits, and discover active career opportunities directly at Sallet IT Soft Pvt. Ltd.
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search company by name or keyword..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="All">All Industries</option>
                {industries.filter((i) => i !== 'All').map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="All">All Locations</option>
                {locations.filter((l) => l !== 'All').map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Showing {companies.length} {companies.length === 1 ? 'Company' : 'Companies'}
          </h2>
        </div>

        {companies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies found"
            description="Try changing your search terms or clearing the industry/location filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setQuery('');
              setSelectedIndustry('All');
              setSelectedLocation('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <CompanyCard key={comp.id} company={comp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
