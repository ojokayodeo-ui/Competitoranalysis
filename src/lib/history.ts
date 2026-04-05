/**
 * Client-side analysis history using localStorage.
 * Stores lightweight metadata so users can return to past analyses.
 */

export interface HistoryEntry {
  id: string
  industry: string
  competitorCount: number
  createdAt: string   // ISO string
}

const KEY = 'cie_history'
const MAX_ENTRIES = 10

export function saveToHistory(entry: HistoryEntry): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getHistory().filter(e => e.id !== entry.id)
    const updated = [entry, ...existing].slice(0, MAX_ENTRIES)
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch {
    // localStorage may be unavailable (private browsing, storage full, etc.)
  }
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export function removeFromHistory(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const updated = getHistory().filter(e => e.id !== id)
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch { /* ignore */ }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
}
