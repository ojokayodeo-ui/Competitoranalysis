'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, AlertTriangle, RefreshCw, Download,
  ExternalLink, Printer,
} from 'lucide-react'
import type { OutreachState } from '@/types/outreach'
import ProgressTracker from '@/components/ProgressTracker'
import IcpScoreRing from '@/components/outreach/IcpScoreRing'
import EmailSequence from '@/components/outreach/EmailSequence'
import LinkedInPanel from '@/components/outreach/LinkedInPanel'
import ObjectionBank from '@/components/outreach/ObjectionBank'

export default function OutreachReportPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [state, setState] = useState<OutreachState | null>(null)
  const [connError, setConnError] = useState(false)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/outreach/${id}`)
      .then(r => r.json())
      .then((s: OutreachState) => {
        setState(s)
        if (s.status !== 'completed' && s.status !== 'failed') stream()
      })
      .catch(() => setConnError(true))
    return () => esRef.current?.close()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const stream = () => {
    const es = new EventSource(`/api/outreach/${id}/stream`)
    esRef.current = es
    es.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data) as OutreachState
        setState(d)
        if (d.status === 'completed' || d.status === 'failed') es.close()
      } catch { /* ignore */ }
    }
    es.onerror = () => { es.close(); setConnError(true) }
  }

  const dl = (fmt: string) => window.open(`/api/outreach/${id}/export/${fmt}`, '_blank')

  // ── States ────────────────────────────────────────────────────────────────

  if (connError && !state) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-white font-semibold">Connection error</p>
        <button onClick={() => router.push('/outreach')} className="px-4 py-2 bg-brand-600 rounded-lg text-sm text-white">← Back</button>
      </div>
    </div>
  )

  if (!state) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw className="w-7 h-7 text-brand-400 animate-spin" />
    </div>
  )

  if (state.status === 'pending' || state.status === 'running') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Generating outreach report…</h2>
        <p className="text-slate-500 text-sm">
          Scraping <span className="text-brand-400">{state.companyUrl}</span>
        </p>
      </div>
      <ProgressTracker steps={state.steps} progress={state.progress} currentStep={state.currentStep} />
    </div>
  )

  if (state.status === 'failed') return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Generation Failed</h2>
        <p className="text-sm text-slate-400 bg-surface-elevated border border-surface-border rounded-xl p-3 font-mono">
          {state.error}
        </p>
        <button onClick={() => router.push('/outreach')} className="px-4 py-2 bg-brand-600 rounded-lg text-sm text-white">← Try Again</button>
      </div>
    </div>
  )

  const r = state.result!
  const c = r.companyIntelligence
  const completedAt = state.completedAt ? new Date(state.completedAt).toLocaleString() : ''

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-14 z-40 border-b border-surface-border bg-surface/80 backdrop-blur-sm no-print">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push('/outreach')} className="text-slate-400 hover:text-white transition flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-bold text-white text-sm truncate">{c?.name || state.companyUrl}</h1>
            <span className="hidden sm:inline text-xs text-slate-500">{completedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-surface-border rounded-lg text-xs text-slate-400 hover:text-white transition">
              <Printer className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={() => dl('html')} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-surface-border rounded-lg text-xs text-slate-400 hover:text-white transition">
              <Download className="w-3.5 h-3.5" /> HTML
            </button>
            <button onClick={() => dl('txt')} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-700 hover:bg-brand-600 border border-brand-600 rounded-lg text-xs text-white transition">
              <Download className="w-3.5 h-3.5" /> Templates (.txt)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-900/10 border border-amber-800/20 rounded-xl p-4">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80">{r.disclaimer}</p>
        </div>

        {/* ── Company Intelligence ──────────────────────────────────────────── */}
        <section>
          <SH icon="🏢" title="Company Intelligence" />
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-5">
            {/* Name + link */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-xl font-bold text-white">{c.name}</h3>
                <a href={r.companyUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-400 transition mt-0.5">
                  {r.companyUrl} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {c.industry && <Chip>{c.industry}</Chip>}
                {c.estimatedSize && <Chip>{c.estimatedSize}</Chip>}
              </div>
            </div>
            <p className="text-slate-300">{c.description}</p>

            {/* ICP score */}
            <div className="border-t border-surface-border pt-5">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">ICP Match Score</p>
              <IcpScoreRing score={c.icpMatchScore} reasoning={c.icpMatchReasoning} />
            </div>

            {/* Best angle */}
            <div className="bg-brand-900/20 border border-brand-800/30 rounded-xl p-4">
              <p className="text-xs text-brand-400 font-semibold uppercase tracking-wide mb-1">🎯 Best Outreach Angle</p>
              <p className="text-sm text-brand-200">{c.outreachAngle}</p>
            </div>

            {/* Pain points + signals */}
            <div className="grid sm:grid-cols-3 gap-4">
              <InfoList title="Likely Pain Points" items={c.likelyPainPoints} dot="bg-red-400" />
              {c.growthSignals.length > 0 && <InfoList title="Growth Signals" items={c.growthSignals} dot="bg-emerald-400" />}
              {c.techStackHints.length > 0 && <InfoList title="Tech / Tools Detected" items={c.techStackHints} dot="bg-blue-400" />}
            </div>
          </div>
        </section>

        {/* ── Personalisation Hooks ─────────────────────────────────────────── */}
        <section>
          <SH icon="🪝" title="Personalisation Hooks" badge={`${r.personalizationHooks.length} hooks`} />
          <div className="space-y-3">
            {r.personalizationHooks.map((h, i) => (
              <div key={i} className={`bg-surface-card border rounded-xl p-4 ${h.strength === 'strong' ? 'border-brand-700/40' : 'border-surface-border'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full border capitalize ${
                    h.strength === 'strong' ? 'bg-brand-900/40 text-brand-300 border-brand-700/30' :
                    h.strength === 'medium' ? 'bg-blue-900/30 text-blue-300 border-blue-700/30' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>{h.strength}</span>
                  <span className="text-xs text-slate-500">{h.sourceContext}</span>
                </div>
                <p className="text-sm text-slate-300 mb-2">{h.hook}</p>
                <div className="bg-surface border border-surface-border rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500 mb-0.5">Usage example</p>
                  <p className="text-sm text-brand-300 italic">"{h.usageExample}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Email Sequence ────────────────────────────────────────────────── */}
        <section>
          <SH icon="📧" title="Email Sequence" badge={`${r.emailSequence.length} emails`} />
          <EmailSequence emails={r.emailSequence} />
        </section>

        {/* ── LinkedIn ─────────────────────────────────────────────────────── */}
        <section>
          <SH icon="💼" title="LinkedIn Messages" />
          <LinkedInPanel messages={r.linkedInMessages} />
        </section>

        {/* ── Objections ───────────────────────────────────────────────────── */}
        <section>
          <SH icon="🛡️" title="Objection Handling" badge={`${r.objectionHandling.length} objections`} />
          <ObjectionBank objections={r.objectionHandling} />
        </section>

        {/* ── Campaign Strategy ─────────────────────────────────────────────── */}
        <section>
          <SH icon="📐" title="Campaign Strategy" />
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-5">
            <p className="text-slate-300 leading-relaxed">{r.campaignStrategy.recommendedApproach}</p>
            <p className="text-sm text-slate-400">{r.campaignStrategy.sequenceOverview}</p>

            <div className="grid sm:grid-cols-3 gap-4">
              <StatBox label="Primary Channel"   value={r.campaignStrategy.primaryChannel} />
              <StatBox label="Secondary Channel" value={r.campaignStrategy.secondaryChannel} />
              <StatBox label="Ideal Send Times"  value={r.campaignStrategy.idealSendTimes} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <InfoList title="Key Messages" items={r.campaignStrategy.keyMessages} dot="bg-brand-400" />
              <InfoList title="Do NOT" items={r.campaignStrategy.doNots} dot="bg-red-400" />
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-slate-600 pb-10">
          Generated {completedAt} · Powered by Claude AI · Replace [[PLACEHOLDERS]] before sending
        </p>
      </div>
    </div>
  )
}

function SH({ icon, title, badge }: { icon: string; title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xl">{icon}</span>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {badge && <span className="px-2 py-0.5 bg-surface-elevated border border-surface-border rounded-full text-xs text-slate-400">{badge}</span>}
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-0.5 bg-surface-elevated border border-surface-border rounded-full text-xs text-slate-400">{children}</span>
}

function InfoList({ title, items, dot }: { title: string; items: string[]; dot: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-elevated border border-surface-border rounded-xl p-4">
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  )
}
