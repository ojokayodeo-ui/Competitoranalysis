import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Industry & Competitive Intelligence Engine',
  description: 'AI-powered deep competitive analysis for any industry — competitor profiling, SWOT, BCG Matrix, market trends and strategic insights.',
  keywords: 'competitive intelligence, market analysis, competitor research, SWOT analysis, BCG matrix',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface text-slate-200 antialiased">
        {/* Top nav */}
        <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-sm no-print">
          <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Left: logo */}
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition flex-shrink-0">
              <span className="text-xl">🧠</span>
              <span className="font-bold text-white text-sm tracking-tight hidden sm:inline">
                Intelligence Engine
              </span>
              <span className="px-1.5 py-0.5 text-xs bg-brand-900/50 border border-brand-700/40 rounded text-brand-400 hidden sm:inline">
                AI-Powered
              </span>
            </Link>

            {/* Centre: nav links */}
            <nav className="flex items-center gap-1">
              <NavLink href="/"         label="🏭 Market Intel" />
              <NavLink href="/outreach" label="📧 Cold Outreach" highlight />
            </nav>

            {/* Right: tag */}
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 flex-shrink-0">
              <span>Powered by Claude AI</span>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  )
}

function NavLink({ href, label, highlight }: { href: string; label: string; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
        highlight
          ? 'bg-brand-600/20 border border-brand-700/40 text-brand-300 hover:bg-brand-600/30'
          : 'text-slate-400 hover:text-white hover:bg-surface-elevated'
      }`}
    >
      {label}
    </Link>
  )
}
