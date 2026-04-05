'use client'
import { useState } from 'react'
import type { ActionableInsight } from '@/types'

const CATEGORY_ICON: Record<string, string> = {
  market_entry:    '🚀',
  offer:           '📦',
  marketing:       '📣',
  differentiation: '🎯',
  partnerships:    '🤝',
  pricing:         '💰',
}

const PRIORITY_STYLE: Record<string, string> = {
  high:   'bg-red-900/30 text-red-300 border-red-700/30',
  medium: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
  low:    'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
}

const TIMEFRAME_STYLE: Record<string, { label: string; style: string }> = {
  immediate:   { label: 'Immediate',   style: 'text-red-400' },
  short_term:  { label: 'Short-term',  style: 'text-amber-400' },
  long_term:   { label: 'Long-term',   style: 'text-blue-400' },
}

interface Props { insights: ActionableInsight[] }

export default function InsightsSection({ insights }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  // Sort by priority
  const sorted = [...insights].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
  })

  return (
    <div className="space-y-3">
      {sorted.map((insight, i) => {
        const id = insight.id || String(i)
        const isOpen = expanded === id
        const tf = TIMEFRAME_STYLE[insight.timeframe] || TIMEFRAME_STYLE.short_term

        return (
          <div
            key={id}
            className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <button
              className="w-full text-left p-5 flex items-start gap-4 hover:bg-surface-elevated/30 transition"
              onClick={() => setExpanded(isOpen ? null : id)}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{CATEGORY_ICON[insight.category] || '💡'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`px-2 py-0.5 text-xs border rounded-full ${PRIORITY_STYLE[insight.priority]}`}>
                    {insight.priority} priority
                  </span>
                  <span className={`text-xs ${tf.style}`}>{tf.label}</span>
                  <span className="text-xs text-slate-500 capitalize">{insight.category.replace('_', ' ')}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{insight.title}</h3>
                {!isOpen && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{insight.description}</p>
                )}
              </div>
              <span className="text-slate-500 text-sm flex-shrink-0 mt-1">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-surface-border animate-fade-in">
                <p className="text-sm text-slate-300 leading-relaxed pt-4">{insight.description}</p>

                {/* Steps */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Implementation Steps
                  </h4>
                  <ol className="space-y-2">
                    {insight.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-900/50 border border-brand-700/40 text-brand-400 text-xs flex items-center justify-center font-bold">
                          {j + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Expected outcome */}
                <div className="bg-emerald-900/10 border border-emerald-800/20 rounded-xl p-3">
                  <p className="text-xs text-emerald-400 font-semibold mb-1">Expected Outcome</p>
                  <p className="text-sm text-emerald-300/80">{insight.expectedOutcome}</p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
