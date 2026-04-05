import { NextRequest, NextResponse } from 'next/server'
import { getAnalysis } from '@/lib/store'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const state = getAnalysis(params.id)

  if (!state) {
    return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
  }

  return NextResponse.json(state)
}
