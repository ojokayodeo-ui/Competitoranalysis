'use client'
import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'overview',    label: 'Industry Overview', icon: '🏭' },
  { id: 'competitors', label: 'Competitors',        icon: '⚔️' },
  { id: 'news',        label: 'News',               icon: '📰' },
  { id: 'strategic',   label: 'Strategic Analysis', icon: '♟️' },
  { id: 'swot',        label: 'SWOT',               icon: '🎯' },
  { id: 'bcg',         label: 'BCG Matrix',         icon: '📊' },
  { id: 'porter',      label: "Porter's Forces",    icon: '⚖️' },
  { id: 'opps',        label: 'Opportunities',      icon: '💡' },
  { id: 'insights',    label: 'Insights',           icon: '🚀' },
]

export default function SectionNav() {
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="sticky top-4 hidden xl:flex flex-col gap-1 w-48">
      {SECTIONS.map(s => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition ${
            active === s.id
              ? 'bg-brand-900/40 border border-brand-700/30 text-brand-300'
              : 'text-slate-500 hover:text-slate-300 hover:bg-surface-elevated'
          }`}
        >
          <span>{s.icon}</span>
          <span>{s.label}</span>
        </button>
      ))}
    </nav>
  )
}
