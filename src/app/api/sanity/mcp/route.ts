import { NextResponse } from 'next/server'
import {
  detectVersionDrift,
  queryDriftKnowledgeBase,
  getMigrationDiff,
  recordDecision,
  inspectKnowledgeSources,
  fetchLibraries,
} from '@/lib/mcp/sanityContext'

// Returns MCP manifest & tools metadata
export async function GET() {
  return NextResponse.json({
    mcpVersion: '1.0',
    server: {
      name: 'sanity-context-version-drift-mcp',
      version: '1.0.0',
      description:
        'Sanity Context MCP Server for Version-Drift Detection & Breaking Change Reconciliation. Resolves contradictions between v3 legacy tutorials and v4 modern canonical documentation for fast-moving developer libraries (Tailwind CSS, React Router, Next.js).',
    },
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
    tools: [
      {
        name: 'drift_detect_version_conflict',
        description:
          'Evaluates a developer question or code snippet against the Sanity Knowledge Base to detect breaking version drift, surface side-by-side legacy vs modern claims, and explain why keyword search fails.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Developer question, e.g. "Tailwind mein @apply ab bhi chalta hai kya?"' },
            codeSnippet: { type: 'string', description: 'Optional code snippet to analyze for deprecated or broken syntax' },
            library: { type: 'string', description: 'Optional library filter (e.g. "Tailwind CSS")' },
          },
          required: ['query'],
        },
      },
      {
        name: 'drift_query_knowledge_base',
        description:
          'Queries Sanity for multi-source contradiction records citing official modern docs, migration guides, legacy archives, and outdated tutorials.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search term or question regarding syntax changes' },
            library: { type: 'string', description: 'Optional library filter' },
          },
          required: ['query'],
        },
      },
      {
        name: 'drift_get_migration_diff',
        description:
          'Generates a precise line-by-line migration diff (- legacy v3 / + modern v4) for a specific breaking change.',
        parameters: {
          type: 'object',
          properties: {
            driftId: { type: 'string', description: 'The unique ID of the version drift record' },
          },
          required: ['driftId'],
        },
      },
      {
        name: 'drift_record_decision',
        description:
          'Records and persists an architectural decision ("v4 current, v3 legacy") into MCP memory so downstream agents build with that assumption.',
        parameters: {
          type: 'object',
          properties: {
            driftId: { type: 'string', description: 'Target version drift ID' },
            decision: { type: 'string', description: 'Resolution statement' },
            status: { type: 'string', enum: ['enforced_modern', 'legacy_fallback', 'migration_progress'] },
          },
          required: ['driftId', 'decision'],
        },
      },
      {
        name: 'drift_inspect_sources',
        description:
          'Inspects the 125+ ingested Sanity knowledge sources across official docs, migration guides, GitHub releases, and outdated tutorials.',
        parameters: {
          type: 'object',
          properties: {
            library: { type: 'string' },
            freshness: { type: 'string', enum: ['all', 'canonical_current', 'deprecated_legacy', 'outdated_pitfall'] },
            search: { type: 'string' },
          },
        },
      },
      {
        name: 'drift_fetch_libraries',
        description: 'Returns supported library profiles (Tailwind CSS, React Router, Next.js).',
        parameters: { type: 'object', properties: {} },
      },
    ],
  })
}

// Executes an MCP tool call via JSON-RPC / MCP standard
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tool, params } = body

    if (!tool) {
      return NextResponse.json({ error: 'Missing "tool" name in MCP request' }, { status: 400 })
    }

    switch (tool) {
      case 'drift_detect_version_conflict': {
        const res = await detectVersionDrift(params)
        return NextResponse.json({ result: res })
      }
      case 'drift_query_knowledge_base': {
        const res = await queryDriftKnowledgeBase(params)
        return NextResponse.json({ result: res })
      }
      case 'drift_get_migration_diff': {
        const res = await getMigrationDiff(params)
        return NextResponse.json({ result: res })
      }
      case 'drift_record_decision': {
        const res = await recordDecision(params)
        return NextResponse.json({ result: res })
      }
      case 'drift_inspect_sources': {
        const res = await inspectKnowledgeSources(params)
        return NextResponse.json({ result: res })
      }
      case 'drift_fetch_libraries': {
        const res = await fetchLibraries()
        return NextResponse.json({ result: res })
      }
      default:
        return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 404 })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'MCP execution failure'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
