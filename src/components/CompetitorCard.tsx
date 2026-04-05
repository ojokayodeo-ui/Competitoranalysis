'use client'
import { useState } from 'react'
import {
  ChevronDown, ChevronUp, ExternalLink, Target, Users,
  Megaphone, TrendingUp, Activity, Shield
} from 'lucide-react'
import type { Competitor } from '@/types'

const POSITIONING_STYLE: Record<string, string> = {
  premium:     'bg-amber-900/30 text-amber-300 border-amber-700/30',
  'mid-market':'bg-blue-900/30 text-blue-300 border-blue-700/30',
  budget:      'bg-green-900/30 text-green-300 border-green-700/30',
  niche:       'bg-purple-900/30 text-purple-300 border-purple-700/30',
  enterprise:  'bg-indigo-900/30 text-indigo-300 border-indigo-700/30',
  freemium:    'bg-teal-900/30 text-teal-300 border-teal-700/30',
}

const BCG_STYLE: Record<string, { bg: string; label: string; icon: string }> = {
  star:          { bg: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/30', label: 'Star', icon: '⭐' },
  cash_cow:      { bg: 'bg-green-900/30 text-green-300 border-green-700/30',  label: 'Cash Cow', icon: '🐄' },
  question_mark: { bg: 'bg-blue-900/30 text-blue-300 border-blue-700/30',    label: 'Question Mark', icon: '❓' },
  dog:           { bg: 'bg-slate-800 text-slate-400 border-slate-700',       label: 'Dog', icon: '🐕' },
}

const TRAFFIC_BAR: Record<string, number> = {
  'very high': 5, high: 4, medium: 3, low: 2, 'very low': 1,
}

interface Props { competitor: Competitor; index: number }

export default function CompetitorCard({ competitor: c, index }: Props) {
  const [expanded, setExpanded] = useState(false)
  const bcg = BCG_STYLE[c.bcg.category] || BCG_STYLE.question_mark

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden transition-all animate-slide-up" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Header */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="text-lg font-bold text-white">{c.name}</h3>
            <span className={`px-2 py-0.5 text-xs border rounded-full capitalize ${POSITIONING_STYLE[c.positioning] || 'bg-slate-700 text-slate-300'}`}>
              {c.positioning}
            </span>
            <span className={`px-2 py-0.5 text-xs border rounded-full ${bcg.bg}`}>
              {bcg.icon} {bcg.label}
            </span>
          </div>
          <a href={c.website} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-400 transition"
            onClick={e => e.stopPropagation()}>
            {c.website} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-2 hover:bg-surface-elevated rounded-lg transition text-slate-400 hover:text-white"
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Quick facts row */}
      <div className="px-5 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-surface-border/50 pt-4">
        <QuickFact label="Core Offer" value={c.coreOffer} />
        <QuickFact label="Target Audience" value={c.targetAudience} />
        <QuickFact label="USP" value={c.usp} />
        <QuickFact label="Pricing" value={c.pricing || '—'} />
      </div>

      {/* Traffic bar */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <span className="text-xs text-slate-500">Est. Traffic:</span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(n => (
            <div
              key={n}
              className={`w-4 h-1.5 rounded-full ${n <= (TRAFFIC_BAR[c.estimatedTrafficLevel] || 3) ? 'bg-brand-500' : 'bg-surface-elevated'}`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-400 capitalize">{c.estimatedTrafficLevel}</span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-surface-border px-5 py-5 space-y-6 animate-fade-in">

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {c.foundedYear && <span>📅 Founded {c.foundedYear}</span>}
            {c.employeeCount && <span>👥 {c.employeeCount} employees</span>}
            {c.headquarters && <span>📍 {c.headquarters}</span>}
          </div>

          {/* Marketing channels */}
          <Section icon={<Megaphone className="w-4 h-4 text-blue-400" />} title="Marketing Channels">
            <div className="flex flex-wrap gap-2">
              {c.marketingChannels.map(ch => (
                <span key={ch} className="px-2 py-1 bg-surface-elevated border border-surface-border rounded-md text-xs text-slate-300">{ch}</span>
              ))}
            </div>
          </Section>

          {/* Messaging */}
          <Section icon={<Target className="w-4 h-4 text-purple-400" />} title="Messaging Angles">
            <ul className="space-y-1">
              {c.messagingAngles.map((m, i) => <li key={i} className="text-sm text-slate-400 flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span>{m}</li>)}
            </ul>
          </Section>

          {/* Sales funnel */}
          <Section icon={<TrendingUp className="w-4 h-4 text-emerald-400" />} title="Sales Funnel">
            <p className="text-sm text-slate-400">{c.funnelStructure}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">Lead Magnets</p>
                <ul className="space-y-1">{c.leadMagnets.map((l,i) => <li key={i} className="text-xs text-slate-400">• {l}</li>)}</ul>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">CTAs</p>
                <ul className="space-y-1">{c.ctas.map((ct,i) => <li key={i} className="text-xs text-slate-400">• {ct}</li>)}</ul>
              </div>
            </div>
          </Section>

          {/* Content strategy */}
          <Section icon={<Activity className="w-4 h-4 text-amber-400" />} title="Content Strategy">
            <p className="text-sm text-slate-400">{c.contentStrategy}</p>
          </Section>

          {/* Recent activity */}
          {c.recentActivity.length > 0 && (
            <Section icon={<Activity className="w-4 h-4 text-rose-400" />} title="Recent Activity">
              <ul className="space-y-1">
                {c.recentActivity.map((a, i) => <li key={i} className="text-sm text-slate-400 flex items-start gap-2"><span className="text-rose-400 mt-0.5">→</span>{a}</li>)}
              </ul>
            </Section>
          )}

          {/* Strengths & Weaknesses */}
          <Section icon={<Shield className="w-4 h-4 text-brand-400" />} title="Strengths & Weaknesses">
            <div className="grid grid-cols-2 gap-4">
              <div>
                {c.strengths.map((s, i) => (
                  <div key={i} className="text-sm text-emerald-400 flex items-start gap-2 mb-1">
                    <span>✓</span><span>{s}</span>
                  </div>
                ))}
              </div>
              <div>
                {c.weaknesses.map((w, i) => (
                  <div key={i} className="text-sm text-red-400 flex items-start gap-2 mb-1">
                    <span>✗</span><span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* BCG reasoning */}
          <div className={`rounded-xl p-4 border text-sm ${bcg.bg}`}>
            <p className="font-medium mb-1">{bcg.icon} BCG Classification: {bcg.label}</p>
            <p className="opacity-80">{c.bcg.reasoning}</p>
            <div className="flex gap-4 mt-2 text-xs opacity-70">
              <span>Market Growth: {c.bcg.marketGrowthScore}/100</span>
              <span>Market Share: {c.bcg.marketShareScore}/100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-sm font-semibold text-slate-300">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-slate-300 line-clamp-2">{value}</p>
    </div>
  )
}
