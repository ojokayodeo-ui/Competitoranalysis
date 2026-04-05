'use client'
import { useState } from 'react'
import type { NewsItem } from '@/types'

const CATEGORY_STYLE: Record<string, string> = {
  funding:      'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
  launch:       'bg-brand-900/30 text-brand-300 border-brand-700/30',
  partnership:  'bg-purple-900/30 text-purple-300 border-purple-700/30',
  expansion:    'bg-blue-900/30 text-blue-300 border-blue-700/30',
  leadership:   'bg-amber-900/30 text-amber-300 border-amber-700/30',
  award:        'bg-yellow-900/30 text-yellow-300 border-yellow-700/30',
  acquisition:  'bg-rose-900/30 text-rose-300 border-rose-700/30',
  other:        'bg-slate-800 text-slate-400 border-slate-700',
}

const SENTIMENT_DOT: Record<string, string> = {
  positive: 'bg-emerald-400',
  neutral:  'bg-slate-400',
  negative: 'bg-red-400',
}

const SIGNIFICANCE_SIZE: Record<string, string> = {
  high:   'opacity-100',
  medium: 'opacity-80',
  low:    'opacity-60',
}

interface Props { news: NewsItem[] }

export default function NewsTimeline({ news }: Props) {
  const [filter, setFilter] = useState<string>('all')
  const competitors = ['all', 'industry', ...Array.from(new Set(news.map(n => n.competitor).filter(c => c !== 'industry')))]

  const filtered = filter === 'all' ? news : news.filter(n => n.competitor === filter)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {competitors.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1 text-xs rounded-full border transition capitalize ${
              filter === c
                ? 'bg-brand-600 border-brand-500 text-white'
                : 'bg-surface-elevated border-surface-border text-slate-400 hover:text-white hover:border-brand-500'
            }`}
          >
            {c === 'industry' ? '🌐 Industry-wide' : c}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-surface-border">
        {filtered.map((item, i) => (
          <div
            key={item.id || i}
            className={`relative animate-slide-up ${SIGNIFICANCE_SIZE[item.significance]}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* Timeline dot */}
            <span className={`absolute -left-6 top-3 w-2.5 h-2.5 rounded-full border-2 border-surface-DEFAULT ${SENTIMENT_DOT[item.sentiment]}`} />

            <div className="bg-surface-card border border-surface-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs border rounded-full capitalize ${CATEGORY_STYLE[item.category] || CATEGORY_STYLE.other}`}>
                    {item.category}
                  </span>
                  {item.competitor !== 'industry' ? (
                    <span className="text-xs text-slate-500">{item.competitor}</span>
                  ) : (
                    <span className="text-xs text-slate-500">🌐 Industry-wide</span>
                  )}
                  {item.significance === 'high' && (
                    <span className="text-xs text-amber-400">⚡ High Impact</span>
                  )}
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{item.date}</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{item.headline}</h4>
              <p className="text-sm text-slate-400">{item.summary}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-slate-500 text-sm">No news items for this filter.</p>
        )}
      </div>
    </div>
  )
}
