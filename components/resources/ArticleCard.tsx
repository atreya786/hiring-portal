import React from 'react';
import Link from 'next/link';
import { Article } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Cover Image */}
        <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="purple" size="sm" className="shadow-xs font-bold">
              {article.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.publishedAt)}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} min read
            </span>
          </div>

          <Link href={`/resources/${article.id}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        </div>
      </div>

      {/* Author & Read More */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-slate-200">{article.authorName}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">{article.authorRole}</span>
        </div>

        <Link
          href={`/resources/${article.id}`}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
        >
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
