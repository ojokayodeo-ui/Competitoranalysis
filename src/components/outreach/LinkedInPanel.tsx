'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { LinkedInMessages } from '@/types/outreach'

const PANELS: Array<{ key: keyof LinkedInMessages; label: string; icon: string; limit?: string }> = [
  { key: 'connectionRequest',  label: 'Connection Request', icon: '🤝', limit: '≤300 chars' },
  { key: 'immediateFollowUp',  label: 'Post-Connect Follow-Up', icon: '📬' },
  { key: 'valueMessage',       label: 'Value Message (5 days, no reply)', icon: '💎' },
  { key: 'voiceNoteScript',    label: 'Voice Note Script (60 sec)', icon: '🎙️' },
]

interface Props { messages: LinkedInMessages }

export default function LinkedInPanel({ messages }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {PANELS.map(({ key, label, icon, limit }) => (
        <div key={key} className="bg-surface-card border border-surface-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span>{icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                {limit && <p className="text-xs text-slate-500">{limit}</p>}
              </div>
            </div>
            <button
              onClick={() => copy(messages[key], key)}
              className="flex items-center gap-1.5 px-2 py-1 bg-surface-elevated border border-surface-border rounded-lg text-xs text-slate-400 hover:text-white transition"
            >
              {copied === key
                ? <><Check className="w-3 h-3 text-emerald-400" />Copied</>
                : <><Copy className="w-3 h-3" />Copy</>}
            </button>
          </div>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
            {messages[key]}
          </pre>
          {key === 'connectionRequest' && (
            <p className="text-xs text-slate-600 mt-2">
              {messages[key].length} / 300 chars
              {messages[key].length > 300 && <span className="text-red-400 ml-1">⚠ Too long — edit before sending</span>}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
