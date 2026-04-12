'use client'
import { useState } from 'react'
import type { Objection } from '@/types/outreach'

const CATEGORY_STYLE: Record<string, string> = {
  timing:       'bg-blue-900/30 text-blue-300 border-blue-700/30',
  price:        'bg-amber-900/30 text-amber-300 border-amber-700/30',
  trust:        'bg-purple-900/30 text-purple-300 border-purple-700/30',
  competitor:   'bg-rose-900/30 text-rose-300 border-rose-700/30',
  not_interested:'bg-slate-800 text-slate-400 border-slate-700',
  wrong_person: 'bg-teal-900/30 text-teal-300 border-teal-700/30',
}

interface Props { objections: Objection[] }

export default function ObjectionBank({ objections }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {objections.map((o, i) => (
        <div key={i} className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-surface-elevated/30 transition"
          >
            <span className="text-red-400 font-bold text-lg flex-shrink-0">?</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">"{o.objection}"</p>
            </div>
            <span className={`flex-shrink-0 px-2 py-0.5 text-xs border rounded-full capitalize ${CATEGORY_STYLE[o.category] || CATEGORY_STYLE.not_interested}`}>
              {o.category.replace('_', ' ')}
            </span>
            <span className="text-slate-500 text-xs ml-2">{open === i ? '▲' : '▼'}</span>
          </button>

          {open === i && (
            <div className="px-5 pb-5 space-y-3 border-t border-surface-border animate-fade-in">
              <div className="pt-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Your Response</p>
                <p className="text-sm text-slate-300 leading-relaxed">{o.response}</p>
              </div>
              <div className="bg-brand-900/20 border border-brand-800/30 rounded-lg px-4 py-3">
                <p className="text-xs text-brand-400 font-semibold mb-1">Follow-up line</p>
                <p className="text-sm text-brand-200/80 italic">"{o.followUpLine}"</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
