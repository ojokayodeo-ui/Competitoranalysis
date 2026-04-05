'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Trash2, ChevronRight, X } from 'lucide-react'
import { getHistory, removeFromHistory, type HistoryEntry } from '@/lib/history'

export default function RecentAnalyses() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const router = useRouter()

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  if (history.length === 0) return null

  const remove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeFromHistory(id)
    setHistory(getHistory())
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch { return iso }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-500">Recent analyses</span>
      </div>
      <div className="space-y-2">
        {history.map(entry => (
          <div
            key={entry.id}
            onClick={() => router.push(`/analysis/${entry.id}`)}
            className="group flex items-center gap-3 px-4 py-3 bg-surface-card border border-surface-border rounded-xl hover:border-brand-700/50 hover:bg-brand-900/10 cursor-pointer transition"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{entry.industry}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {entry.competitorCount} competitors · {formatDate(entry.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={e => remove(entry.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
