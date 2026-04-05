'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { AnalysisState } from '@/types'
import ProgressTracker from '@/components/ProgressTracker'
import IndustryOverview from '@/components/IndustryOverview'
import CompetitorCard from '@/components/CompetitorCard'
import ComparisonTable from '@/components/ComparisonTable'
import NewsTimeline from '@/components/NewsTimeline'
import SWOTMatrix from '@/components/SWOTMatrix'
import BCGMatrix from '@/components/BCGMatrix'
import PortersForcesChart from '@/components/PortersForcesChart'
import OpportunitiesSection from '@/components/OpportunitiesSection'
import InsightsSection from '@/components/InsightsSection'
import ExportBar from '@/components/ExportBar'
import SectionNav from '@/components/SectionNav'
import { ArrowLeft, AlertTriangle, RefreshCw, Printer } from 'lucide-react'
import { saveToHistory } from '@/lib/history'

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [state, setState] = useState<AnalysisState | null>(null)
  const [connectionError, setConnectionError] = useState(false)
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const esRef = useRef<EventSource | null>(null)
  const savedRef = useRef(false)

  useEffect(() => {
    if (!id) return

    fetch(`/api/analysis/${id}`)
      .then(r => r.json())
      .then((s: AnalysisState) => {
        setState(s)
        if (s.status === 'completed') persistHistory(s)
        if (s.status === 'completed' || s.status === 'failed') return
        startStream()
      })
      .catch(() => setConnectionError(true))

    return () => { esRef.current?.close() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const persistHistory = (s: AnalysisState) => {
    if (savedRef.current || !s.result) return
    savedRef.current = true
    saveToHistory({
      id: s.id,
      industry: s.industry,
      competitorCount: s.result.competitors.length,
      createdAt: s.createdAt,
    })
  }

  const startStream = () => {
    const es = new EventSource(`/api/analysis/${id}/stream`)
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as AnalysisState
        setState(data)
        if (data.status === 'completed') {
          persistHistory(data)
          es.close()
        } else if (data.status === 'failed') {
          es.close()
        }
      } catch { /* ignore */ }
    }

    es.onerror = () => { es.close(); setConnectionError(true) }
  }

  // ── Loading / Error states ─────────────────────────────────────────────────

  if (connectionError && !state) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Connection Error</h2>
          <p className="text-slate-400">Could not connect to the analysis server.</p>
          <button onClick={() => router.push('/')} className="px-4 py-2 bg-brand-600 rounded-lg text-white text-sm">
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    )
  }

  // ── In-progress ────────────────────────────────────────────────────────────

  if (state.status === 'pending' || state.status === 'running') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Analysing: <span className="text-brand-400">{state.industry}</span>
          </h2>
          <p className="text-slate-500 text-sm">Our AI research engine is gathering intelligence…</p>
        </div>
        <ProgressTracker steps={state.steps} progress={state.progress} currentStep={state.currentStep} />
      </div>
    )
  }

  // ── Failed ─────────────────────────────────────────────────────────────────

  if (state.status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Analysis Failed</h2>
          <p className="text-slate-400 text-sm bg-surface-elevated border border-surface-border rounded-xl p-3 font-mono">
            {state.error || 'An unknown error occurred'}
          </p>
          <p className="text-slate-500 text-xs">
            Make sure <code className="text-brand-400">ANTHROPIC_API_KEY</code> is set in your environment.
          </p>
          <button onClick={() => router.push('/')} className="px-4 py-2 bg-brand-600 rounded-lg text-white text-sm">
            ← Try Again
          </button>
        </div>
      </div>
    )
  }

  // ── Completed ─────────────────────────────────────────────────────────────

  const { result } = state
  if (!result) return null

  const completedAt = state.completedAt ? new Date(state.completedAt).toLocaleString() : ''

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-14 z-40 border-b border-surface-border bg-surface/80 backdrop-blur-sm no-print">
        <div className="max-w-screen-2xl mx-auto px-6 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white transition flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-bold text-white text-sm truncate">{result.industry}</h1>
            <span className="hidden sm:inline text-xs text-slate-500">{completedAt}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-surface-border rounded-lg text-xs text-slate-400 hover:text-white hover:border-brand-500 transition"
              title="Print / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" /> PDF
            </button>
            <ExportBar analysisId={id} />
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-8 flex gap-8">
        {/* Sticky sidebar nav */}
        <SectionNav />

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-12">

          {/* AI disclaimer */}
          <div className="flex items-start gap-3 bg-amber-900/10 border border-amber-800/20 rounded-xl p-4">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/80">{result.aiDisclaimer}</p>
          </div>

          {/* ── INDUSTRY OVERVIEW ────────────────────────────────────────── */}
          <section id="overview">
            <SectionHeader icon="🏭" title="Industry Overview" />
            <IndustryOverview data={result.industryOverview} />
          </section>

          {/* ── COMPETITORS ─────────────────────────────────────────────── */}
          <section id="competitors">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚔️</span>
                <h2 className="text-xl font-bold text-white">Competitor Landscape</h2>
                <span className="px-2 py-0.5 bg-surface-elevated border border-surface-border rounded-full text-xs text-slate-400">
                  {result.competitors.length} competitors
                </span>
              </div>
              {/* View toggle */}
              <div className="flex items-center gap-1 bg-surface-elevated border border-surface-border rounded-lg p-1 no-print">
                <button
                  onClick={() => setView('cards')}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${view === 'cards' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setView('table')}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${view === 'table' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Compare
                </button>
              </div>
            </div>

            {view === 'cards' ? (
              <div className="space-y-4">
                {result.competitors.map((c, i) => (
                  <CompetitorCard key={c.id} competitor={c} index={i} />
                ))}
              </div>
            ) : (
              <ComparisonTable competitors={result.competitors} />
            )}
          </section>

          {/* ── NEWS ──────────────────────────────────────────────────────── */}
          <section id="news">
            <SectionHeader icon="📰" title="Latest News & Developments" badge={`${result.news.length} items`} />
            <NewsTimeline news={result.news} />
          </section>

          {/* ── STRATEGIC ANALYSIS ──────────────────────────────────────── */}
          <section id="strategic">
            <SectionHeader icon="♟️" title="Strategic Analysis" />
            <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
              <p className="text-slate-300 leading-relaxed">{result.strategicAnalysis.competitiveDynamics}</p>
            </div>
          </section>

          {/* ── SWOT ─────────────────────────────────────────────────────── */}
          <section id="swot">
            <SectionHeader icon="🎯" title="Industry SWOT Analysis" />
            <SWOTMatrix swot={result.strategicAnalysis.industrySWOT} title="Industry-wide SWOT" />
          </section>

          {/* ── BCG MATRIX ───────────────────────────────────────────────── */}
          <section id="bcg">
            <SectionHeader icon="📊" title="BCG Growth–Share Matrix" />
            <BCGMatrix competitors={result.competitors} narrative={result.strategicAnalysis.bcgNarrative} />
          </section>

          {/* ── PORTER'S FIVE FORCES ─────────────────────────────────────── */}
          <section id="porter">
            <SectionHeader icon="⚖️" title="Porter's Five Forces" />
            <PortersForcesChart forces={result.strategicAnalysis.portersFiveForces} />
          </section>

          {/* ── OPPORTUNITIES ────────────────────────────────────────────── */}
          <section id="opps">
            <SectionHeader icon="💡" title="Opportunities & Market Gaps" badge={`${result.opportunities.length} found`} />
            <OpportunitiesSection opportunities={result.opportunities} />
          </section>

          {/* ── INSIGHTS ─────────────────────────────────────────────────── */}
          <section id="insights">
            <SectionHeader icon="🚀" title="Actionable Insights" badge={`${result.actionableInsights.length} recommendations`} />
            <InsightsSection insights={result.actionableInsights} />
          </section>

          {/* Footer */}
          <div className="pb-12 text-center text-xs text-slate-600">
            Generated {completedAt} · Confidence: {result.dataConfidence.toUpperCase()} · Powered by Claude AI
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ icon, title, badge }: { icon: string; title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {badge && (
        <span className="px-2 py-0.5 bg-surface-elevated border border-surface-border rounded-full text-xs text-slate-400">
          {badge}
        </span>
      )}
    </div>
  )
}
