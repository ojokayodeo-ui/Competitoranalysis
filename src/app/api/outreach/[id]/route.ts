import { NextRequest, NextResponse } from 'next/server'
import { getOutreach } from '@/lib/outreachStore'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const state = getOutreach(params.id)
  if (!state) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(state)
}
