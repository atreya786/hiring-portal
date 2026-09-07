import React from 'react';
import Link from 'next/link';
import { Company } from '../../lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Star, MapPin, Building2, Briefcase, ArrowRight } from 'lucide-react';

export function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-1.5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            <img
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded-lg text-amber-800 dark:text-amber-300 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{company.rating}</span>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-normal">({company.reviewCount})</span>
          </div>
        </div>

        {/* Company Name & Verified */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {company.name}
            </h3>
            {company.verified && (
              <span title="Verified Enterprise" className="inline-flex">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
              </span>
            )}
          </div>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{company.industry}</p>
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {company.tagline}
        </p>

        {/* Metadata */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{company.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{company.size} &bull; Est. {company.foundedYear}</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-4 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{company.activeJobsCount} Open Jobs</span>
        </div>

        <Link href={`/companies/${company.id}`}>
          <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            View Company
          </Button>
        </Link>
      </div>
    </div>
  );
}
