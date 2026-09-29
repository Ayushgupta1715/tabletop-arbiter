'use client'

import React, { useState } from 'react'
import {
  Terminal,
  X,
  Copy,
  Check,
  Play,
  Activity,
  Cpu,
  Database,
  ExternalLink,
} from 'lucide-react'

interface SanityMcpInspectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SanityMcpInspectorModal({
  isOpen,
  onClose,
}: SanityMcpInspectorModalProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'console' | 'groq' | 'jsonrpc' | 'architecture'>('console')
  const [selectedTool, setSelectedTool] = useState<string>('resolve_tabletop_dispute')
  const [testParam, setTestParam] = useState<string>('Carnage Tyrant fight vs Ward {2} creature')
  const [toolOutput, setToolOutput] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)

  if (!isOpen) return null

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tabName)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const handleRunMcpTool = async () => {
    setIsExecuting(true)
    setToolOutput(null)
    const startTime = Date.now()
    try {
      const res = await fetch('/api/sanity/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `manual-tool-${Date.now()}`,
          name: selectedTool,
          arguments: {
            scenarioQuery: testParam,
            query: testParam,
            gameFilter: 'Magic: The Gathering',
            ruleId: 'rule-mtg-ward',
          },
        }),
      })
      const data = await res.json()
      setExecutionTime(Date.now() - startTime)
      setToolOutput(JSON.stringify(data, null, 2))
    } catch {
      setToolOutput('// Error connecting to /api/sanity/mcp endpoint.')
    } finally {
      setIsExecuting(false)
    }
  }

  const groqCode = `// ⚡ TableTop Arbiter: GROQ Hierarchical Errata Dereferencing Query
// Resolves base printed rules and queries active superseding errata in a single atomic graph query:

*[_type == "gameRule" && $ruleId == _id][0] {
  "ruleId": _id,
  ruleTitle,
  sectionCode,
  gameName,
  originalRulebookEdition,
  officialRawText,
  apparentInterpretation,
  isSuperseded,
  
  // 🚀 Dereferencing superseding errata documents from the Content Lake:
  "activeErrata": *[_type == "ruleErrata" && references(^._id)] | order(effectiveDate desc)[0] {
    "errataId": _id,
    title,
    patchVersion,
    effectiveDate,
    governingAuthority,
    errataClassification,
    officialRulingText,
    rationale,
    sourceUrl,
    sourceDocumentLabel,
    whyVectorRAGFails
  }
}`

  const jsonRpcCode = `// 🛰️ Model Context Protocol (MCP) JSON-RPC Request to /api/sanity/mcp
POST /api/sanity/mcp HTTP/1.1
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": "req-arbiter-001",
  "method": "tools/call",
  "params": {
    "name": "resolve_tabletop_dispute",
    "arguments": {
      "scenarioQuery": "Does Carnage Tyrant's uncounterable text protect a fight spell targeting a Ward {2} creature?",
      "gameFilter": "Magic: The Gathering"
    }
  }
}

// 🟢 MCP Server Response (Sanity Structured Grounding Payload):
{
  "jsonrpc": "2.0",
  "id": "req-arbiter-001",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "OFFICIAL ARBITER VERDICT: Under Comprehensive Rules § 604.3a and § 113.6, uncounterable text is stack-only. When Player A targets a Ward {2} creature with a fight spell without paying {2}, Ward triggers and counters the fight spell under CR 702.21a. Player B is UPHELD."
      }
    ],
    "structuredData": {
      "gameTitle": "Magic: The Gathering",
      "verdictWinner": "player_b",
      "ruleCitation": {
        "sectionCode": "CR 702.21a",
        "edition": "Magic Comprehensive Rules (2024 Update)"
      },
      "errataOverride": {
        "patchVersion": "WotC Oracle & CR 604.3a Update",
        "governingAuthority": "Wizards of the Coast Rules Manager"
      },
      "provenanceHash": "sha256-arbiter-mtg-ward-colossus"
    }
  }
}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="plaque-3d-active relative w-full max-w-4xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-[var(--parchment)] shadow-2xl">
        
        {/* Authentic 3D Brass Corner Brackets */}
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-3d-surface absolute top-4 right-4 p-1.5 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5 text-[var(--brass-light)]" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-[var(--border)] pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#e5ba55] to-[#8a6f34] p-[1px] shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            <div className="w-full h-full rounded-[11px] bg-[var(--felt-1)] flex items-center justify-center text-[var(--brass-light)] shadow-inner">
              <Terminal className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif text-[var(--parchment-bright)] font-bold">
                Sanity Context MCP Protocol Hub & Telemetry
              </h3>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(52,211,153,0.15)] text-[#34D399] border border-[rgba(52,211,153,0.3)]">
                v2024-11-05
              </span>
            </div>
            <p className="eyebrow-label text-[var(--brass-light)] mt-0.5 font-bold">
              DEV Challenge · Path One: Ship an Agent That Queries Real Content
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-2.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'console'
                ? 'btn-3d-brass'
                : 'btn-3d-surface'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live MCP Tool Runner</span>
          </button>

          <button
            onClick={() => setActiveTab('groq')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'groq'
                ? 'btn-3d-brass'
                : 'btn-3d-surface'
            }`}
          >
            GROQ Graph Query
          </button>

          <button
            onClick={() => setActiveTab('jsonrpc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'jsonrpc'
                ? 'btn-3d-brass'
                : 'btn-3d-surface'
            }`}
          >
            MCP JSON-RPC Spec
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'btn-3d-brass'
                : 'btn-3d-surface'
            }`}
          >
            Why Vector RAG Fails
          </button>
        </div>

        {/* Tab 1: Live Interactive MCP Tool Runner */}
        {activeTab === 'console' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--felt-0)] border border-[var(--border)] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-sans font-semibold text-[var(--brass-light)] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[var(--brass-light)]" />
                  <span>Select Registered MCP Tool to Execute:</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[var(--muted)]">Transport: HTTP POST</span>
                  <code className="text-[11px] font-mono text-[var(--brass-light)] bg-[var(--felt-1)] px-2 py-0.5 rounded border border-[var(--border)]">
                    /api/sanity/mcp
                  </code>
                </div>
              </div>

              {/* Tool Selector Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'resolve_tabletop_dispute',
                    name: 'resolve_tabletop_dispute',
                    desc: 'Dereferences rules + errata & stamps verdict',
                  },
                  {
                    id: 'get_rule_errata_diff',
                    name: 'get_rule_errata_diff',
                    desc: 'Fetches base rule vs superseding errata diff',
                  },
                  {
                    id: 'query_tournament_knowledge_lake',
                    name: 'query_tournament_knowledge_lake',
                    desc: 'GROQ graph search across Sanity Lake',
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTool(t.id)
                      if (t.id === 'get_rule_errata_diff') setTestParam('rule-mtg-ward')
                      else setTestParam('Carnage Tyrant fight vs Ward {2} creature')
                    }}
                    className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                      selectedTool === t.id
                        ? 'bg-[var(--felt-2)] border-[var(--brass-dim)] shadow-xs'
                        : 'bg-[var(--felt-1)] border-[var(--border)] hover:border-[var(--brass-dim)]/50'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold text-[var(--brass-light)]">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-[var(--muted)] font-sans mt-0.5">
                      {t.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Argument Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-mono text-[var(--muted)] flex items-center justify-between">
                  <span>Parameter Payload (JSON-RPC arguments):</span>
                  <span>Target: Magic: The Gathering (CR 2024)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testParam}
                    onChange={(e) => setTestParam(e.target.value)}
                    placeholder="Enter query argument..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--felt-1)] border border-[var(--border)] text-xs font-mono text-[var(--parchment-bright)] focus:outline-none focus:border-[var(--brass)]"
                  />
                  <button
                    onClick={handleRunMcpTool}
                    disabled={isExecuting}
                    className="btn-3d-brass px-4 py-2 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
                    <span>{isExecuting ? 'Executing...' : 'Execute Tool'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Response Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[var(--brass-light)] flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Real Live MCP Response Output:</span>
                </span>
                {executionTime !== null && (
                  <span className="text-[10px] font-mono text-[#34D399] bg-[rgba(52,211,153,0.1)] px-2 py-0.5 rounded border border-[rgba(52,211,153,0.3)]">
                    Latency: {executionTime}ms (JSON-RPC 2.0)
                  </span>
                )}
              </div>

              <pre className="p-4 rounded-xl bg-[var(--felt-0)] border border-[var(--border)] text-xs font-mono text-[var(--brass)] max-h-64 overflow-y-auto overflow-x-auto leading-relaxed shadow-inner">
                {toolOutput ||
                  '// Click "Execute Tool" to trigger live Sanity Context MCP execution directly against /api/sanity/mcp'}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: GROQ */}
        {activeTab === 'groq' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span className="font-mono text-[11px]">Atomic GROQ dereferencing query:</span>
              <button
                onClick={() => handleCopy(groqCode, 'groq')}
                className="flex items-center gap-1 text-[var(--brass)] hover:underline font-mono text-[11px] cursor-pointer"
              >
                {copiedTab === 'groq' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy GROQ</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-[var(--felt-0)] border border-[var(--border)] text-xs font-mono text-[var(--parchment)] overflow-x-auto leading-relaxed">
              {groqCode}
            </pre>
          </div>
        )}

        {/* Tab 3: JSON-RPC */}
        {activeTab === 'jsonrpc' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span className="font-mono text-[11px]">Model Context Protocol (MCP) request & response:</span>
              <button
                onClick={() => handleCopy(jsonRpcCode, 'jsonrpc')}
                className="flex items-center gap-1 text-[var(--brass)] hover:underline font-mono text-[11px] cursor-pointer"
              >
                {copiedTab === 'jsonrpc' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON-RPC</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-[var(--felt-0)] border border-[var(--border)] text-xs font-mono text-[var(--brass)] overflow-x-auto leading-relaxed">
              {jsonRpcCode}
            </pre>
          </div>
        )}

        {/* Tab 4: Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-4 text-xs sm:text-sm text-[var(--parchment)] leading-relaxed">
            <div className="p-4 rounded-lg bg-[var(--felt-2)] border border-[var(--brass-dim)] space-y-2">
              <h4 className="font-serif font-semibold text-[var(--brass)] text-sm">
                The Architecture: Why Structured Content Lake Overrides Vector RAG
              </h4>
              <p className="text-xs text-[var(--parchment)] leading-relaxed">
                In competitive tabletop gaming, answers cannot be hallucinated. A single misquoted rule alters who wins a tournament or starts an argument at the game table.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-[var(--felt-0)] border border-[var(--border)] space-y-1.5">
                <span className="eyebrow-label">Vector Embeddings (RAG)</span>
                <ul className="list-disc list-inside space-y-1 text-[var(--muted)] font-mono text-[11px]">
                  <li>Chunks text blindly without structural awareness</li>
                  <li>Blends obsolete 2014 rules with 2024 errata</li>
                  <li>Cannot evaluate supersedes references</li>
                  <li>Zero verifiable cryptographic provenance</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--felt-0)] border border-[var(--brass-dim)] space-y-1.5">
                <span className="eyebrow-label text-[var(--brass)]">Sanity Context MCP</span>
                <ul className="list-disc list-inside space-y-1 text-[var(--parchment)] font-mono text-[11px]">
                  <li>Structured documents with exact schemas and types</li>
                  <li>Relational dereferencing: references($ruleId)</li>
                  <li>Deterministic version priority and errata hierarchy</li>
                  <li>Zero AI token retrieval tax on tool calls</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)]">
          <span className="font-mono text-[11px]">Endpoint: /api/sanity/mcp (HTTP JSON-RPC 2.0 · 4 Tools Active)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[var(--felt-2)] hover:bg-[var(--felt-0)] border border-[var(--border)] text-[var(--parchment)] text-xs font-mono transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
