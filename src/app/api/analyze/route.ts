import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import type { AnalysisRequest } from '@/types'
import { createAnalysis } from '@/lib/store'
import { runPipeline } from '@/lib/pipeline'

export async function POST(req: NextRequest) {
  try {
    const body: AnalysisRequest = await req.json()

    if (!body.industry?.trim()) {
      return NextResponse.json({ error: 'industry field is required' }, { status: 400 })
    }

    const id = uuidv4()
    createAnalysis(id, body.industry.trim())

    // Fire-and-forget — pipeline runs in background
    runPipeline(id, body).catch(console.error)

    return NextResponse.json({ id }, { status: 202 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
