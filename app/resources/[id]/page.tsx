'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ARTICLES } from '../../../lib/mock-data';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatDate } from '../../../lib/utils';
import { Clock, Calendar, ArrowLeft, Share2, Sparkles, BookOpen } from 'lucide-react';
import { useToast } from '../../../lib/context/ToastContext';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params?.id as string;
  const { success } = useToast();

  const article = ARTICLES.find((a) => a.id === articleId || a.slug === articleId) || ARTICLES[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      success('Link Copied', 'Article link copied to clipboard.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Breadcrumbs
              items={[
                { label: 'Resources', href: '/resources' },
                { label: article.category, href: `/resources` },
                { label: article.title },
              ]}
            />
            <Link
              href="/resources"
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Articles</span>
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            <Badge variant="purple" size="md">{article.category}</Badge>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {article.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {article.authorName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight">{article.authorName}</p>
                  <p className="text-[11px] text-slate-400">{article.authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTimeMinutes} min read
                </span>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  aria-label="Share article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reading Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs space-y-8">
          {/* Cover image */}
          <div className="rounded-xl overflow-hidden max-h-96 w-full">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Tags:</span>
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
