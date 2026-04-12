import { NextRequest, NextResponse } from 'next/server'
import { getOutreach } from '@/lib/outreachStore'
import { outreachToJson, outreachToText, outreachToHtml } from '@/lib/outreachExport'
import type { OutreachExportFormat } from '@/types/outreach'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; format: OutreachExportFormat } }
) {
  const state = getOutreach(params.id)
  if (!state?.result) return NextResponse.json({ error: 'Not found or not complete' }, { status: 404 })

  const { result } = state
  const slug = (result.companyIntelligence?.name || 'company').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const ts = new Date(result.generatedAt).toISOString().slice(0, 10)
  const filename = `outreach-${slug}-${ts}`

  switch (params.format) {
    case 'html':
      return new Response(outreachToHtml(result), {
        headers: { 'Content-Type': 'text/html', 'Content-Disposition': `attachment; filename="${filename}.html"` },
      })
    case 'txt':
      return new Response(outreachToText(result), {
        headers: { 'Content-Type': 'text/plain', 'Content-Disposition': `attachment; filename="${filename}.txt"` },
      })
    case 'json':
      return new Response(outreachToJson(result), {
        headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="${filename}.json"` },
      })
    default:
      return NextResponse.json({ error: 'Use html, txt, or json' }, { status: 400 })
  }
}
