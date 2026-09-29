import { NextResponse } from 'next/server'
import { resolveTabletopDispute } from '@/lib/mcp/sanityContext'

export async function POST(req: Request) {
  try {
    const { scenarioQuery, gameFilter, playerAClaim, playerBClaim, disputeId } = await req.json()

    if (!scenarioQuery && !disputeId) {
      return NextResponse.json({ error: 'scenarioQuery or disputeId is required' }, { status: 400 })
    }

    const result = await resolveTabletopDispute({
      scenarioQuery: scenarioQuery || '',
      gameFilter,
      playerAClaim,
      playerBClaim,
      disputeId,
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      verifiedBy: 'Sanity Context TableTop Arbiter Errata Knowledge Lake',
      ...result,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Tabletop arbiter audit error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
