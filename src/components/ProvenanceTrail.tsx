'use client'

import React from 'react'
import { CitationChip } from './CitationChip'
import { ThreeDMedallion } from './ThreeDMedallion'
import { ExternalLink, GitFork } from 'lucide-react'

export interface ProvenanceData {
  rulebook: {
    title: string
    edition: string
    publisher: string
  }
  gameRule: {
    sectionCode: string
    ruleTitle: string
    officialText: string
  }
  errata: {
    title: string
    patchVersion: string
    effectiveDate: string
    governingAuthority: string
    officialRulingText: string
    supersedes: boolean
    sourceUrl?: string
    sourceDocumentLabel?: string
  } | null
  groqQuerySnippet?: string
}

interface ProvenanceTrailProps {
  data: ProvenanceData
  onOpenMcpInspector?: () => void
  onOpenRuleDetail?: () => void
}

export function ProvenanceTrail({ data, onOpenMcpInspector, onOpenRuleDetail }: ProvenanceTrailProps) {
  const { rulebook, gameRule, errata } = data
  const hasSupersedingErrata = Boolean(errata && errata.supersedes)

  return (
    <aside className="space-y-4">
      
      {/* 1. Interactive 3D Tournament Adjudication D20 Die */}
      <ThreeDMedallion label="3D Adjudication D20" />

      {/* Eyebrow Label */}
      <div className="flex items-center justify-between pb-1 pt-1">
        <span className="eyebrow-label text-[var(--brass-light)] font-bold">Rules Provenance Lineage</span>
        {onOpenMcpInspector && (
          <button
            onClick={onOpenMcpInspector}
            className="text-xs font-sans text-[var(--muted)] hover:text-[var(--brass-light)] transition-colors underline cursor-pointer"
          >
            Inspect GROQ
          </button>
        )}
      </div>

      {/* 2. Vertical Timeline Card */}
      <div className="plaque-3d p-5 rounded-xl relative overflow-hidden border border-[var(--border)]">
        {/* Brass corner brackets */}
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Continuous Connecting Vertical Line with glowing active pulse */}
        <div className="absolute left-[31px] top-[42px] bottom-[50px] w-0.5 bg-gradient-to-b from-[#fde8a7] via-[#9a7628] to-[#e0ac42] pointer-events-none opacity-85 shadow-[0_0_6px_rgba(224,172,66,0.5)]" />

        <div className="space-y-6 relative">
          
          {/* Node 1: Official Rulebook Codex */}
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#f5c95c] to-[#9a7628] text-[#061109] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 z-10 shadow-[0_2px_6px_rgba(0,0,0,0.7)] border border-[#fde8a7]">
              <span>I</span>
            </div>
            <div className="space-y-1 min-w-0">
              <span className="eyebrow-label">Codex Origin</span>
              <div className="text-sm font-serif font-bold text-[var(--parchment-bright)] leading-tight">
                {rulebook.title}
              </div>
              <div className="font-sans text-xs text-[var(--brass-light)] font-medium">
                {rulebook.edition}
              </div>
              <div className="text-xs text-[var(--muted)] font-sans">
                Authority: {rulebook.publisher}
              </div>
            </div>
          </div>

          {/* Node 2: Base Printed GameRule */}
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#f5c95c] to-[#9a7628] text-[#061109] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 z-10 shadow-[0_2px_6px_rgba(0,0,0,0.7)] border border-[#fde8a7]">
              <span>II</span>
            </div>
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="eyebrow-label">Base Printed Clause</span>
                <CitationChip code={gameRule.sectionCode} onClick={onOpenRuleDetail} />
              </div>
              
              <div className="text-xs font-semibold text-[var(--parchment-bright)] font-sans leading-snug">
                {gameRule.ruleTitle}
              </div>

              <div className="p-3 rounded-lg bg-[var(--felt-0)] border border-[var(--border)] font-sans text-xs text-[var(--parchment)] leading-relaxed shadow-inner">
                &ldquo;{gameRule.officialText}&rdquo;
              </div>
            </div>
          </div>

          {/* Node 3: Tournament Errata Override (Active step with gold dot) */}
          <div className="flex items-start gap-3.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 font-mono font-bold text-xs border relative ${
                hasSupersedingErrata
                  ? 'bg-gradient-to-b from-[#fde8a7] via-[#e0ac42] to-[#9a7628] text-[#061109] border-[#fffdf7] shadow-[0_0_12px_rgba(224,172,66,0.7)]'
                  : 'bg-[var(--felt-2)] border-[var(--border)] text-[var(--muted)]'
              }`}
            >
              <span>III</span>
              {/* Active Step Glowing Gold Dot */}
              {hasSupersedingErrata && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#fde8a7] shadow-[0_0_8px_#fde8a7] animate-ping" />
              )}
            </div>

            <div
              className={`space-y-2.5 min-w-0 p-4 rounded-xl transition-all flex-1 border ${
                hasSupersedingErrata
                  ? 'plaque-3d-active border-[var(--brass-dim)]'
                  : 'plaque-3d border-[var(--border)]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="eyebrow-label text-[var(--brass-light)] font-bold">Tournament Errata</span>
                {hasSupersedingErrata && (
                  <span className="seal-overruled-3d font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    supersedes
                  </span>
                )}
              </div>

              {errata ? (
                <>
                  <div className="font-mono text-xs font-bold text-[var(--brass-light)]">
                    {errata.patchVersion}
                  </div>
                  
                  <div className="text-xs text-[var(--parchment-bright)] font-sans font-semibold leading-snug">
                    {errata.title}
                  </div>
                  
                  <div className="p-3 rounded-lg bg-[var(--felt-0)] border border-[var(--border)] font-sans text-xs text-[var(--parchment)] leading-relaxed shadow-inner">
                    &ldquo;{errata.officialRulingText}&rdquo;
                  </div>

                  <div className="space-y-1 font-sans text-xs text-[var(--muted)] pt-1 border-t border-[var(--border)]">
                    <div>Effective: {errata.effectiveDate}</div>
                    <div>Authority: {errata.governingAuthority}</div>
                  </div>

                  {errata.sourceUrl && (
                    <a
                      href={errata.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-sans text-xs text-[var(--brass-light)] hover:underline pt-1"
                    >
                      <span className="truncate max-w-[190px]">
                        {errata.sourceDocumentLabel || 'Official Rulebook FAQ'}
                      </span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  )}
                </>
              ) : (
                <div className="text-xs text-[var(--muted)] italic font-sans">
                  No active tournament errata. Base printed clause stands.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Atomic GROQ Graph Join Drawer */}
      <div className="plaque-3d p-4 rounded-xl space-y-2 relative overflow-hidden border border-[var(--border)]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-xs font-sans font-semibold flex items-center gap-1.5 text-[var(--brass-light)]">
            <GitFork className="w-3.5 h-3.5 text-[var(--brass-light)]" />
            <span>Sanity Graph Traversal</span>
          </span>
          <span className="font-mono text-[10px] text-[var(--muted)]">Atomic Join</span>
        </div>

        <pre className="font-mono text-[10.5px] text-[var(--parchment)] overflow-x-auto leading-relaxed p-3 bg-[var(--felt-0)] rounded-lg border border-[var(--border)] shadow-inner">
{`*[_type == "gameRule" && _id == $id][0] {
  ...,
  "activeErrata": *[
    _type == "ruleErrata" && 
    references(^._id)
  ] | order(effectiveDate desc)[0]
}`}
        </pre>
      </div>

    </aside>
  )
}
