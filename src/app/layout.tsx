import type { Metadata } from 'next'
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
        <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-sm">
          <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition">
              <span className="text-xl">🧠</span>
              <span className="font-bold text-white text-sm tracking-tight">
                Intelligence Engine
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-xs bg-brand-900/50 border border-brand-700/40 rounded text-brand-400">
                AI-Powered
              </span>
            </a>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Powered by Claude AI</span>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
