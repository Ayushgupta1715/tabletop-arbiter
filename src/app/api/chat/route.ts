import { NextRequest, NextResponse } from 'next/server'
import {
  queryTournamentKnowledgeLake,
  getRuleErrataDiff,
  resolveTabletopDispute,
  getInitialContext,
  knowledgeBaseRead,
} from '@/lib/mcp/sanityContext'

export interface ToolCallStep {
  id: string
  tool: string
  arguments: Record<string, unknown>
  outputSummary: string
  durationMs: number
  status: 'invoked' | 'success' | 'error'
  timestamp: string
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  try {
    const { messages, apiKey, gameFilter, disputeContext } = await req.json()
    const lastUserMessage = messages?.[messages.length - 1]?.content || ''
    const effectiveApiKey =
      apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

    const toolTrace: ToolCallStep[] = []

    // --- STEP 1: Call Official Sanity Context MCP Tool `initial_context` ---
    const t0Start = Date.now()
    const kbContext = await getInitialContext()
    toolTrace.push({
      id: 'step-0-initial-context',
      tool: 'initial_context',
      arguments: {},
      outputSummary: `Sanity Context KB Discovery: Located ${kbContext.knowledgeBases.length} Knowledge Bases (${kbContext.knowledgeBases.map((k) => k.id).join(', ')}).`,
      durationMs: Date.now() - t0Start,
      status: 'success',
      timestamp: new Date().toISOString(),
    })

    // --- STEP 2: Call MCP Tool `query_tournament_knowledge_lake` ---
    const t1Start = Date.now()
    const knowledge = await queryTournamentKnowledgeLake({
      query: lastUserMessage,
      gameFilter: gameFilter || 'Magic: The Gathering',
    })
    toolTrace.push({
      id: 'step-1-query-kb',
      tool: 'query_tournament_knowledge_lake',
      arguments: { query: lastUserMessage, gameFilter: gameFilter || 'Magic: The Gathering' },
      outputSummary: `Traversed Sanity Content Lake: Matched ${knowledge.matchedRules.length} Comprehensive Rules (${knowledge.matchedRules.map((r) => r.sectionCode).slice(0, 3).join(', ')}) & ${knowledge.activeErrata.length} active errata.`,
      durationMs: Date.now() - t1Start,
      status: 'success',
      timestamp: new Date().toISOString(),
    })

    // --- STEP 3: Call Official Sanity Context Tool `knowledge_base_read` on matched entries ---
    const topRule = knowledge.matchedRules[0]
    const topErrata = knowledge.activeErrata[0]
    const tReadStart = Date.now()
    const readPaths = [
      topRule ? `mtg/cr/${topRule.sectionCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : 'mtg/cr/604-3a-stack-scope',
      topErrata ? `mtg/errata/${topErrata.patchVersion.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : 'mtg/errata/2024-04-ward-vs-fight',
    ]
    const kbReadResult = await knowledgeBaseRead({
      kbId: 'kb_mtg_comprehensive_rules_2024',
      entryPaths: readPaths,
    })
    toolTrace.push({
      id: 'step-2-kb-read',
      tool: 'knowledge_base_read',
      arguments: { kbId: 'kb_mtg_comprehensive_rules_2024', entryPaths: readPaths },
      outputSummary: `Sanity KB Read: Retrieved ${kbReadResult.entries.length} authoritative source documents with linked origin provenance.`,
      durationMs: Date.now() - tReadStart,
      status: 'success',
      timestamp: new Date().toISOString(),
    })

    // --- STEP 4: Call MCP Tool `get_rule_errata_diff` on top rule ---
    let diffResult: Awaited<ReturnType<typeof getRuleErrataDiff>> | null = null
    if (topRule) {
      const t2Start = Date.now()
      diffResult = await getRuleErrataDiff(topRule.id)
      toolTrace.push({
        id: 'step-3-rule-diff',
        tool: 'get_rule_errata_diff',
        arguments: { ruleId: topRule.id, sectionCode: topRule.sectionCode },
        outputSummary: diffResult.hasOverride
          ? `CRITICAL OVERRIDE DETECTED: Base rule ${topRule.sectionCode} is superseded by "${diffResult.errata?.patchVersion}" (${diffResult.errata?.governingAuthority}).`
          : `Base rule ${topRule.sectionCode} has no superseding errata. Base printed rule text stands.`,
        durationMs: Date.now() - t2Start,
        status: 'success',
        timestamp: new Date().toISOString(),
      })
    }

    // --- STEP 5: Call MCP Tool `resolve_tabletop_dispute` ---
    const t3Start = Date.now()
    const arbitration = await resolveTabletopDispute({
      scenarioQuery: lastUserMessage,
      gameFilter: gameFilter || 'Magic: The Gathering',
      playerAClaim: disputeContext?.playerAClaim,
      playerBClaim: disputeContext?.playerBClaim,
    })
    toolTrace.push({
      id: 'step-4-resolve-dispute',
      tool: 'resolve_tabletop_dispute',
      arguments: {
        scenarioQuery: lastUserMessage.slice(0, 80) + '...',
        governingRuleId: topRule?.id,
        governingErrataId: diffResult?.errata?.id,
      },
      outputSummary: `Verdict certified: UPHELD for ${arbitration.verdictWinner.toUpperCase()}. Lineage verified with hash ${arbitration.provenanceHash}.`,
      durationMs: Date.now() - t3Start,
      status: 'success',
      timestamp: new Date().toISOString(),
    })

    // --- STEP 4: Dual-Stream Live Execution (Naive Baseline vs Grounded Arbiter) ---
    let liveNaiveAnswer = ''
    let liveGroundedAnswer = ''

    if (effectiveApiKey) {
      // 4A: Call Naive Model with ZERO Knowledge Base Context
      try {
        const naivePrompt = `You are a casual player answering a tabletop rules question from memory without checking any rulebook or tournament errata.
Answer briefly (2-3 sentences) based on casual intuition and card keywords:
Question: ${lastUserMessage}`

        const naiveRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${effectiveApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: naivePrompt }] }] }),
          }
        )
        if (naiveRes.ok) {
          const naiveData = await naiveRes.json()
          liveNaiveAnswer =
            naiveData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
        }
      } catch (err) {
        console.warn('Naive LLM call failed:', err)
      }

      // 4B: Call Grounded Arbiter with Real Sanity MCP Context
      try {
        const groundedPrompt = `You are TableTop Arbiter, the official Head Tournament Judge.
You have access to authoritative data from the Sanity Context Knowledge Base:
- Matched Rules: ${JSON.stringify(knowledge.matchedRules.map((r) => ({ code: r.sectionCode, text: r.officialRawText })))}
- Active Errata Overrides: ${JSON.stringify(knowledge.activeErrata.map((e) => ({ version: e.patchVersion, ruling: e.officialRulingText, authority: e.governingAuthority })))}
- Tool Trace Summary: ${JSON.stringify(toolTrace.map((t) => ({ tool: t.tool, summary: t.outputSummary })))}

Provide the official tournament ruling for: "${lastUserMessage}".
Structure your reply:
1. ⚖️ **OFFICIAL ARBITER VERDICT:** State decisively who is right.
2. 📜 **AUTHORITATIVE CITATION:** Quote the exact CR section code and official wording.
3. 🚨 **ERRATA / TIMING OVERRIDE:** Explain the governing authority ruling.
4. ❌ **WHY NAIVE LLMs HALLUCINATE:** Explain why vector keyword matching fails here.`

        const groundedRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${effectiveApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: groundedPrompt }] }] }),
          }
        )
        if (groundedRes.ok) {
          const groundedData = await groundedRes.json()
          liveGroundedAnswer =
            groundedData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
        }
      } catch (err) {
        console.warn('Grounded LLM call failed:', err)
      }
    }

    // High-fidelity fallback / baseline generator if API key wasn't supplied or call failed
    if (!liveNaiveAnswer) {
      liveNaiveAnswer = arbitration.naiveLLMResponse ||
        `"Based on surface card text, the ability appears to work intuitively because keywords match directly, without considering timing layers or stack zone boundaries."`
    }

    if (!liveGroundedAnswer) {
      liveGroundedAnswer = arbitration.officialRuling
    }

    return NextResponse.json({
      reply: liveGroundedAnswer,
      naiveAnswer: liveNaiveAnswer,
      toolCallsTrace: toolTrace,
      verdictWinner: arbitration.verdictWinner,
      citations: [
        {
          code: arbitration.ruleCitation.sectionCode,
          title: arbitration.ruleCitation.title,
          text: arbitration.ruleCitation.originalText,
        },
        ...(arbitration.errataOverride
          ? [
              {
                code: arbitration.errataOverride.patchVersion,
                title: arbitration.errataOverride.title,
                text: arbitration.errataOverride.officialRulingText,
                authority: arbitration.errataOverride.governingAuthority,
                url: arbitration.errataOverride.sourceUrl,
              },
            ]
          : []),
      ],
      provenanceHash: arbitration.provenanceHash,
      executionTimeMs: Date.now() - startTime,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error processing inquiry'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
