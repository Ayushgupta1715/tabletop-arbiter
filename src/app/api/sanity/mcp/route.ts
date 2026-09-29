import { NextResponse } from 'next/server'
import {
  resolveTabletopDispute,
  getRuleErrataDiff,
  queryTournamentKnowledgeLake,
  fetchSupportedGames,
} from '@/lib/mcp/sanityContext'

// Returns MCP manifest & tools metadata
export async function GET() {
  return NextResponse.json({
    mcpVersion: '1.0',
    server: {
      name: 'sanity-context-tabletop-arbiter-mcp',
      version: '1.0.0',
      description:
        'Sanity Context MCP Server for TableTop Arbiter. Deterministic rules resolution and errata overrides for competitive tabletop games & TCGs (Magic: The Gathering, Warhammer 40k, Catan, Gloomhaven, D&D). Queries Sanity Content Lake using GROQ dereferencing to prevent LLM hallucinations.',
    },
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
    tools: [
      {
        name: 'resolve_tabletop_dispute',
        description:
          'Evaluates a tabletop game rule argument between players by querying Sanity structured core rules and overriding official tournament errata.',
        parameters: {
          type: 'object',
          properties: {
            scenarioQuery: { type: 'string', description: 'Description of the dispute or card interaction occurring at the table' },
            gameFilter: { type: 'string', description: 'Game name or ID (e.g. "Magic: The Gathering", "Warhammer 40,000", "Catan")' },
            playerAClaim: { type: 'string', description: 'Optional argument made by Player A' },
            playerBClaim: { type: 'string', description: 'Optional argument made by Player B' },
            disputeId: { type: 'string', description: 'Optional pre-calibrated dispute ID' },
          },
          required: ['scenarioQuery'],
        },
      },
      {
        name: 'get_rule_errata_diff',
        description:
          'Fetches the base printed rule and any overriding tournament errata documents that reference and supersede it.',
        parameters: {
          type: 'object',
          properties: {
            ruleId: { type: 'string', description: 'The unique ID of the base game rule' },
          },
          required: ['ruleId'],
        },
      },
      {
        name: 'query_tournament_knowledge_lake',
        description:
          'Queries Sanity Content Lake for rules, official FAQ rulings, and tournament errata using GROQ structured traversal.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Keywords or rules section code (e.g. "CR 702.21a", "Deep Strike 9 inches")' },
            gameFilter: { type: 'string', description: 'Optional target game name' },
          },
          required: ['query'],
        },
      },
      {
        name: 'fetch_supported_games',
        description: 'Returns the catalog of supported tabletop games and their governing tournament circuits.',
        parameters: { type: 'object', properties: {} },
      },
    ],
  })
}

// Executes an MCP tool call (JSON-RPC / REST format)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tool, params, method, id } = body

    // Support standard MCP JSON-RPC 2.0 methods:
    if (method === 'tools/list' || body.method === 'tools/list') {
      const manifest = await (await GET()).json()
      return NextResponse.json({
        jsonrpc: '2.0',
        id: id || 1,
        result: {
          tools: manifest.tools,
        },
      })
    }

    if (method === 'initialize' || body.method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: id || 1,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'sanity-context-tabletop-arbiter-mcp',
            version: '1.0.0',
          },
          capabilities: {
            tools: {},
            resources: {},
            prompts: {},
          },
        },
      })
    }

    // Support standard JSON-RPC 2.0 or direct tool call
    const toolName =
      tool ||
      body.name ||
      body.params?.name ||
      (method === 'tools/call' ? body.params?.name : null) ||
      (typeof method === 'string' && method !== 'tools/call' ? method : null)
    const toolParams =
      params ||
      body.arguments ||
      body.params?.arguments ||
      (method === 'tools/call' ? body.params?.arguments : {}) ||
      {}

    let result: unknown

    switch (toolName) {
      case 'resolve_tabletop_dispute':
        result = await resolveTabletopDispute({
          scenarioQuery: toolParams.scenarioQuery || toolParams.query || '',
          gameFilter: toolParams.gameFilter || toolParams.game,
          playerAClaim: toolParams.playerAClaim,
          playerBClaim: toolParams.playerBClaim,
          disputeId: toolParams.disputeId,
        })
        break

      case 'get_rule_errata_diff':
        result = await getRuleErrataDiff(toolParams.ruleId)
        break

      case 'query_tournament_knowledge_lake':
        result = await queryTournamentKnowledgeLake({
          query: toolParams.query || '',
          gameFilter: toolParams.gameFilter,
        })
        break

      case 'fetch_supported_games':
        result = await fetchSupportedGames()
        break

      default:
        return NextResponse.json(
          {
            jsonrpc: '2.0',
            id: id || null,
            error: {
              code: -32601,
              message: `Method or tool not found: ${toolName}. Available tools: resolve_tabletop_dispute, get_rule_errata_diff, query_tournament_knowledge_lake, fetch_supported_games`,
            },
          },
          { status: 404 }
        )
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id: id || 1,
      result: {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
        ],
        structuredData: result,
      },
    })
  } catch (err: unknown) {
    console.error('[Sanity TableTop Arbiter MCP Error]', err)
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: err instanceof Error ? err.message : 'Unknown internal MCP error',
        },
      },
      { status: 500 }
    )
  }
}
