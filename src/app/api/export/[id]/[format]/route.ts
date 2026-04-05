import { NextRequest, NextResponse } from 'next/server'
import { getAnalysis } from '@/lib/store'
import { toJson, toCsv, toHtml } from '@/lib/export'
import type { ExportFormat } from '@/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; format: ExportFormat } }
) {
  const state = getAnalysis(params.id)

  if (!state || !state.result) {
    return NextResponse.json({ error: 'Analysis not found or not complete' }, { status: 404 })
  }

  const { result } = state
  const slugName = result.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const ts = new Date(result.generatedAt).toISOString().slice(0, 10)
  const filename = `intelligence-${slugName}-${ts}`

  switch (params.format) {
    case 'json':
      return new Response(toJson(result), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}.json"`,
        },
      })

    case 'csv':
      return new Response(toCsv(result), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      })

    case 'html':
      return new Response(toHtml(result), {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${filename}.html"`,
        },
      })

    default:
      return NextResponse.json({ error: 'Unsupported format. Use json, csv, or html' }, { status: 400 })
  }
}
