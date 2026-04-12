import { NextRequest } from 'next/server'
import { getOutreach, subscribeOutreach } from '@/lib/outreachStore'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const existing = getOutreach(params.id)
  if (!existing) return new Response('Not found', { status: 404 })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        try { controller.enqueue(encoder.encode(`data: ${data}\n\n`)) } catch { /* disconnected */ }
      }

      const current = getOutreach(params.id)
      if (current) send(JSON.stringify(current))
      if (current?.status === 'completed' || current?.status === 'failed') {
        controller.close(); return
      }

      const unsub = subscribeOutreach(params.id, (data) => {
        send(data)
        try {
          const s = JSON.parse(data)
          if (s.status === 'completed' || s.status === 'failed') {
            unsub(); controller.close()
          }
        } catch { /* ignore */ }
      })

      setTimeout(() => { unsub(); try { controller.close() } catch { /* already closed */ } }, 10 * 60 * 1000)
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
