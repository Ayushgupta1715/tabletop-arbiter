import { NextResponse } from 'next/server'
import { resolveTabletopDispute, queryTournamentKnowledgeLake } from '@/lib/mcp/sanityContext'

export async function POST(req: Request) {
  try {
    const { message, game } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message query is required' }, { status: 400 })
    }

    const arbiterResult = await resolveTabletopDispute({
      scenarioQuery: message,
      gameFilter: game,
    })

    const knowledgeLake = await queryTournamentKnowledgeLake({
      query: message,
      gameFilter: game,
    })

    const citations = [
      {
        label: `📜 Base Rule: ${arbiterResult.ruleCitation.sectionCode} (${arbiterResult.ruleCitation.edition})`,
        url: '#',
        category: 'Official Printed Rulebook',
      },
    ]

    if (arbiterResult.errataOverride) {
      citations.push({
        label: `🚨 Tournament Errata: ${arbiterResult.errataOverride.patchVersion} (${arbiterResult.errataOverride.governingAuthority})`,
        url: arbiterResult.errataOverride.sourceUrl,
        category: 'Authoritative Errata Override',
      })
    }

    const agentResponseText = `### ⚖️ TableTop Arbiter — Tournament Rules Resolution

**Target Game:** \`${arbiterResult.gameTitle}\`  
**Verdict Winner:** **${arbiterResult.verdictWinner.toUpperCase()}**  
**Cryptographic Stamp:** \`${arbiterResult.provenanceHash}\`

---

#### 🏛️ Official Ruling:
${arbiterResult.officialRuling}

---

#### 📜 Base Rulebook:
- **Code:** \`${arbiterResult.ruleCitation.sectionCode}\` (${arbiterResult.ruleCitation.title})
- **Text:** "${arbiterResult.ruleCitation.originalText}"

---

#### 🚨 Active Tournament Errata:
${
  arbiterResult.errataOverride
    ? `- **Patch:** \`${arbiterResult.errataOverride.patchVersion}\` (Effective: ${arbiterResult.errataOverride.effectiveDate})\n- **Authority:** ${arbiterResult.errataOverride.governingAuthority}\n- **Ruling:** "${arbiterResult.errataOverride.officialRulingText}"`
    : 'No active errata override found; base printed rule applies.'
}

---

#### ❌ Why Vector RAG Hallucinates:
${arbiterResult.whyVectorSearchFailed}`

    return NextResponse.json({
      success: true,
      query: message,
      answer: agentResponseText,
      verdictWinner: arbiterResult.verdictWinner,
      citations,
      matchedRulesCount: knowledgeLake.matchedRules.length,
      activeErrataCount: knowledgeLake.activeErrata.length,
      provenanceHash: arbiterResult.provenanceHash,
      timestamp: new Date().toISOString(),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Arbiter agent chat error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
