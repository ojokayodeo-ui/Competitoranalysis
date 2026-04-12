import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import type { OutreachRequest } from '@/types/outreach'
import { createOutreach } from '@/lib/outreachStore'
import { runOutreachPipeline } from '@/lib/outreachPipeline'

export async function POST(req: NextRequest) {
  try {
    const body: OutreachRequest = await req.json()

    if (!body.companyUrl?.trim()) {
      return NextResponse.json({ error: 'companyUrl is required' }, { status: 400 })
    }
    if (!body.targetMarket?.trim()) {
      return NextResponse.json({ error: 'targetMarket is required' }, { status: 400 })
    }

    // Normalise URL
    let url = body.companyUrl.trim()
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`

    const id = uuidv4()
    createOutreach(id, {
      companyUrl: url,
      targetMarket: body.targetMarket.trim(),
      yourProduct: body.yourProduct?.trim(),
      geographyFocus: body.geographyFocus || 'Global',
      senderName: body.senderName?.trim(),
      senderCompany: body.senderCompany?.trim(),
    })

    runOutreachPipeline(id, { ...body, companyUrl: url }).catch(console.error)

    return NextResponse.json({ id }, { status: 202 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
