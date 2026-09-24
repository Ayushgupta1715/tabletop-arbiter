import { NextResponse } from 'next/server'
import { detectVersionDrift } from '@/lib/mcp/sanityContext'

export async function POST(req: Request) {
  try {
    const { query, codeSnippet, library } = await req.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query or dilemma description is required' }, { status: 400 })
    }

    const result = await detectVersionDrift({ query, codeSnippet, library })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      verifiedBy: 'Sanity Context Version Drift Knowledge Base',
      ...result,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Version drift audit error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
