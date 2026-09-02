'use client';

import React, { useState } from 'react';
import { ARTICLES } from '../../lib/mock-data';
import { ArticleCard } from '../../components/resources/ArticleCard';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Tabs } from '../../components/ui/Tabs';
import { BookOpen, Sparkles, TrendingUp, Search } from 'lucide-react';

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'Interviews', label: 'Interviews' },
    { id: 'Resume', label: 'Resume & ATS' },
    { id: 'Career Growth', label: 'Career Growth' },
    { id: 'Freshers', label: 'Freshers Guide' },
  ];

  const filtered = ARTICLES.filter((art) => {
    const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
    const matchesQuery =
      !searchQuery ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-4">
          <Breadcrumbs items={[{ label: 'Career Resources', href: '/resources' }]} />

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Sallet Career Playbooks
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Career Advice, Resume Tips & Tech Insights
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Practical guides written by engineering directors, senior recruiters, and hiring managers across India.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs
              tabs={categories}
              activeTab={activeCategory}
              onChange={setActiveCategory}
              variant="pills"
            />

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </div>
    </div>
  );
}
