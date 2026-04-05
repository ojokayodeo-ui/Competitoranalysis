import { NextRequest } from 'next/server'
import { getAnalysis, subscribe } from '@/lib/store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const existing = getAnalysis(params.id)
  if (!existing) {
    return new Response('Analysis not found', { status: 404 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Immediately send current state
      const sendEvent = (data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch {
          // Client disconnected
        }
      }

      // Send current state right away
      const current = getAnalysis(params.id)
      if (current) sendEvent(JSON.stringify(current))

      // If already terminal, close immediately
      if (current?.status === 'completed' || current?.status === 'failed') {
        controller.close()
        return
      }

      // Subscribe to updates
      const unsubscribe = subscribe(params.id, (eventData) => {
        sendEvent(eventData)

        // Parse and check if terminal
        try {
          const state = JSON.parse(eventData)
          if (state.status === 'completed' || state.status === 'failed') {
            unsubscribe()
            controller.close()
          }
        } catch {
          // ignore parse errors
        }
      })

      // Auto-close after 10 minutes (safety valve)
      setTimeout(() => {
        unsubscribe()
        try { controller.close() } catch { /* already closed */ }
      }, 10 * 60 * 1000)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
