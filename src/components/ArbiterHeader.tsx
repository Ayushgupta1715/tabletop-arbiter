'use client'

import React from 'react'
import Link from 'next/link'
import {
  Scale,
  ExternalLink,
  FileCheck2,
  Terminal,
  Key,
  Database,
  Radio,
  Layers,
} from 'lucide-react'

interface ArbiterHeaderProps {
  onOpenMcpInspector: () => void
  onOpenRulingSlip: () => void
  onOpenApiKeyModal: () => void
  onOpenContradictionMatrix?: () => void
  hasApiKey: boolean
}

export function ArbiterHeader({
  onOpenMcpInspector,
  onOpenRulingSlip,
  onOpenApiKeyModal,
  onOpenContradictionMatrix,
  hasApiKey,
}: ArbiterHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border)] bg-[var(--felt-0)]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand mark */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#e5ba55] to-[#8a6f34] p-[1px] shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              <div className="w-full h-full rounded-[11px] bg-[var(--felt-1)] flex items-center justify-center text-[var(--brass-light)] shadow-inner">
                <Scale className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-xl font-bold text-[var(--parchment-bright)] tracking-tight drop-shadow-sm">
                  TableTop Arbiter
                </span>
                <span className="eyebrow-label text-[var(--brass-light)] border border-[var(--brass-dim)] px-2 py-0.5 rounded text-[10px] hidden sm:inline-flex items-center gap-1.5 bg-[rgba(212,167,72,0.1)] shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brass)] shadow-[0_0_6px_#f5d98e] animate-pulse" />
                  Sanity Context MCP
                </span>
              </div>
              <span className="text-[11px] font-mono text-[var(--muted)] hidden md:block">
                Tournament Errata Grounding Engine · Zero Hallucination
              </span>
            </div>
          </div>

          {/* Action CTAs: Restrained, Gold strictly on center hero decree */}
          <div className="flex items-center gap-4">
            
            {/* Sanity Studio Link - Clean Text Link */}
            <Link
              href="/studio"
              target="_blank"
              className="text-xs text-[var(--muted)] hover:text-[var(--parchment-bright)] transition-colors flex items-center gap-1 font-sans cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[var(--brass-dim)]" />
              <span className="hidden sm:inline">Sanity Studio</span>
              <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
            </Link>

            {/* MCP Protocol Link - Clean Text Link */}
            <button
              onClick={onOpenMcpInspector}
              className="text-xs text-[var(--muted)] hover:text-[var(--parchment-bright)] transition-colors flex items-center gap-1 font-sans cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-[var(--brass-dim)]" />
              <span className="hidden sm:inline">MCP Protocol</span>
            </button>

            {/* Contradictions Matrix Link - Clean Text Link */}
            {onOpenContradictionMatrix && (
              <button
                onClick={onOpenContradictionMatrix}
                className="text-xs text-[var(--muted)] hover:text-[var(--parchment-bright)] transition-colors flex items-center gap-1 font-sans cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[var(--brass-dim)]" />
                <span className="hidden sm:inline">Contradictions</span>
              </button>
            )}

            {/* Ruling Slip Modal Button - Restrained Outline / Cream text */}
            <button
              onClick={onOpenRulingSlip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-[var(--parchment)] bg-transparent hover:bg-[var(--felt-1)] border border-[var(--border)] hover:border-[var(--brass-dim)] transition-all cursor-pointer"
              title="Shortcut: Press [G]"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-[var(--brass-light)]" />
              <span>Ruling Slip</span>
              <kbd className="hidden md:inline font-mono text-[10px] text-[var(--muted)] bg-[var(--felt-1)] px-1 py-0.5 rounded border border-[var(--border)]">G</kbd>
            </button>

            {/* Gemini API Key - Icon Only Button */}
            <button
              onClick={onOpenApiKeyModal}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--brass-light)] hover:bg-[var(--felt-1)] border border-[var(--border)] hover:border-[var(--brass-dim)] transition-all cursor-pointer"
              title={hasApiKey ? 'Gemini 2.0 Key Configured' : 'Configure optional Gemini API Key'}
              aria-label="API Key Settings"
            >
              <Key className="w-3.5 h-3.5 text-[var(--brass-light)]" />
            </button>

          </div>

        </div>
      </div>
      
      {/* Delicate hairline brass divider */}
      <div className="brass-hairline" />
    </header>
  )
}
