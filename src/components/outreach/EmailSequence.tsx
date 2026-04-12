'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { EmailStep } from '@/types/outreach'

const TYPE_STYLE: Record<string, string> = {
  initial:    'bg-emerald-900/40 text-emerald-300 border-emerald-700/30',
  follow_up:  'bg-blue-900/40 text-blue-300 border-blue-700/30',
  breakup:    'bg-red-900/40 text-red-300 border-red-700/30',
}

interface Props { emails: EmailStep[] }

export default function EmailSequence({ emails }: Props) {
  const [open, setOpen] = useState<number>(1)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-3">
      {/* Timeline connector */}
      <div className="relative">
        {emails.map((email) => {
          const isOpen = open === email.step
          const copyKey = `body-${email.step}`

          return (
            <div key={email.step} className="relative flex gap-4 pb-4">
              {/* Timeline line */}
              {email.step < emails.length && (
                <div className="absolute left-5 top-10 bottom-0 w-px bg-surface-border" />
              )}

              {/* Step bubble */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center text-sm font-bold text-brand-400 z-10">
                {email.step}
              </div>

              {/* Card */}
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setOpen(isOpen ? -1 : email.step)}
                  className="w-full text-left"
                >
                  <div className={`bg-surface-card border rounded-2xl p-4 transition hover:border-brand-700/40 ${isOpen ? 'border-brand-700/40' : 'border-surface-border'}`}>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-slate-500">{email.timing}</span>
                        <span className={`px-2 py-0.5 text-xs border rounded-full capitalize ${TYPE_STYLE[email.type] || TYPE_STYLE.follow_up}`}>
                          {email.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-slate-500 text-sm">{isOpen ? '▲' : '▼'}</span>
                    </div>
                    <p className="font-semibold text-white mt-2 text-sm">
                      Subject: {email.subject}
                    </p>
                    {!isOpen && (
                      <p className="text-xs text-slate-500 mt-1 truncate">{email.previewText}</p>
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-2 space-y-3 animate-fade-in px-1">
                    {/* Preview text */}
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-slate-500 flex-shrink-0 mt-0.5">Preview:</span>
                      <span className="text-xs text-slate-400 italic">{email.previewText}</span>
                    </div>

                    {/* Body */}
                    <div className="relative">
                      <pre className="w-full bg-surface border border-surface-border rounded-xl p-4 text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                        {email.body}
                      </pre>
                      <button
                        onClick={() => copy(email.body, copyKey)}
                        className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-surface-elevated border border-surface-border rounded-lg text-xs text-slate-400 hover:text-white transition"
                      >
                        {copied === copyKey
                          ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
                          : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                    </div>

                    {/* CTA + notes */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">CTA</p>
                        <p className="text-sm text-emerald-400">{email.cta}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Writing Notes</p>
                        <p className="text-xs text-slate-400 italic">{email.writingNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
