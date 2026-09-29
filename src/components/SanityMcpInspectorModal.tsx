'use client'

import React, { useState } from 'react'
import {
  Terminal,
  X,
  Copy,
  Check,
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
  const [activeTab, setActiveTab] = useState<'groq' | 'jsonrpc' | 'architecture'>('groq')

  if (!isOpen) return null

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tabName)
    setTimeout(() => setCopiedTab(null), 2000)
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
      "scenarioQuery": "Can Ward counter an uncounterable spell like Carnage Tyrant in Magic?",
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
        "text": "OFFICIAL ARBITER VERDICT: Under Comprehensive Rules § 702.21b and § 101.2 (Golden Rule)..."
      }
    ],
    "structuredData": {
      "gameTitle": "Magic: The Gathering",
      "verdictWinner": "player_a",
      "ruleCitation": {
        "sectionCode": "CR 702.21a",
        "edition": "Comprehensive Rules 2021"
      },
      "errataOverride": {
        "patchVersion": "CR Update 2024-04 § 702.21b",
        "governingAuthority": "Wizards of the Coast Rules Manager"
      },
      "provenanceHash": "sha256-mtg-702-21b-arbiter-cert"
    }
  }
}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="plaque-3d-active relative w-full max-w-3xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-[var(--parchment)] shadow-2xl">
        
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
            <h3 className="text-lg font-serif text-[var(--parchment-bright)] font-bold flex items-center gap-2">
              <span>Sanity Context MCP & GROQ Telemetry</span>
            </h3>
            <p className="eyebrow-label text-[var(--brass-light)] mt-0.5 font-bold">
              DEV Challenge · Path One: Ship an Agent That Queries Real Content
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-2.5">
          <button
            onClick={() => setActiveTab('groq')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'groq'
                ? 'btn-3d-brass'
                : 'btn-3d-surface'
            }`}
          >
            GROQ Graph Query
          </button>

          <button
            onClick={() => setActiveTab('jsonrpc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'jsonrpc'
                ? 'btn-3d-brass'
                : 'btn-3d-surface'
            }`}
          >
            MCP JSON-RPC Endpoint
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'btn-3d-brass'
                : 'btn-3d-surface'
            }`}
          >
            Why Vector RAG Fails
          </button>
        </div>

        {/* Tab Content */}
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
          <span className="font-mono text-[11px]">Endpoint: /api/sanity/mcp (HTTP JSON-RPC 2.0)</span>
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
