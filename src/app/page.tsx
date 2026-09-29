'use client'

import React, { useState, useEffect } from 'react'
import { ArbiterHeader } from '@/components/ArbiterHeader'
import { GameSwitcherRail } from '@/components/GameSwitcherRail'
import { ArbiterBoardCenter } from '@/components/ArbiterBoardCenter'
import { ProvenanceTrail, ProvenanceData } from '@/components/ProvenanceTrail'
import { RulingSlipModal } from '@/components/RulingSlipModal'
import { SanityMcpInspectorModal } from '@/components/SanityMcpInspectorModal'
import { ApiKeyModal } from '@/components/ApiKeyModal'
import { RuleDetailDrawer } from '@/components/RuleDetailDrawer'
import { ContradictionMatrixModal } from '@/components/ContradictionMatrixModal'
import {
  SEED_GAMES,
  SEED_DISPUTES,
  SEED_RULES,
  SEED_ERRATAS,
} from '@/sanity/lib/seedData'
import Link from 'next/link'
import { ShieldCheck, Terminal, Database, BookMarked, Scale, GitFork } from 'lucide-react'

export default function Home() {
  const [selectedGameId, setSelectedGameId] = useState<string>(SEED_GAMES[0].id)
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(SEED_DISPUTES[0].id)
  const [apiKey, setApiKey] = useState<string>('')
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)
  const [isMcpInspectorOpen, setIsMcpInspectorOpen] = useState(false)
  const [isRulingSlipModalOpen, setIsRulingSlipModalOpen] = useState(false)
  const [isRuleDrawerOpen, setIsRuleDrawerOpen] = useState(false)
  const [isContradictionMatrixOpen, setIsContradictionMatrixOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<'library' | 'decree' | 'provenance'>('decree')

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('TABLETOP_ARBITER_GEMINI_KEY')
      if (savedKey) setApiKey(savedKey)
    } catch {}
  }, [])

  // Global Keyboard Shortcuts: R to roll d20, G to generate ruling slip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable
      if (isInput) return

      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault()
        setIsRulingSlipModalOpen(true)
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        const rollBtn = document.querySelector('button[title*="Roll ceremonial"]') as HTMLButtonElement
        if (rollBtn) rollBtn.click()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSaveApiKey = (key: string) => {
    setApiKey(key)
    try {
      if (key) {
        localStorage.setItem('TABLETOP_ARBITER_GEMINI_KEY', key)
      } else {
        localStorage.removeItem('TABLETOP_ARBITER_GEMINI_KEY')
      }
    } catch {}
  }

  // Active records based on selected game and selected controversy
  const activeGame =
    SEED_GAMES.find((g) => g.id === selectedGameId) || SEED_GAMES[0]

  const gameDisputes = SEED_DISPUTES.filter((d) => d.gameId === activeGame.id)

  const activeDispute =
    gameDisputes.find((d) => d.id === selectedDisputeId) || gameDisputes[0] || SEED_DISPUTES[0]

  const activeRule =
    SEED_RULES.find((r) => r.id === activeDispute.governingRuleId) || SEED_RULES[0]

  const activeErrata =
    SEED_ERRATAS.find((e) => e.id === activeDispute.governingErrataId) || null

  // Data-driven Sanity shape for the Provenance Trail
  const provenanceData: ProvenanceData = {
    rulebook: {
      title: activeGame.title,
      edition: activeGame.currentEdition,
      publisher: activeGame.publisher,
    },
    gameRule: {
      sectionCode: activeRule.sectionCode,
      ruleTitle: activeRule.ruleTitle,
      officialText: activeRule.officialRawText,
    },
    errata: activeErrata
      ? {
          title: activeErrata.title,
          patchVersion: activeErrata.patchVersion,
          effectiveDate: activeErrata.effectiveDate,
          governingAuthority: activeErrata.governingAuthority,
          officialRulingText: activeErrata.officialRulingText,
          supersedes: true, // triggers brass highlight!
          sourceUrl: activeErrata.sourceUrl,
          sourceDocumentLabel: activeErrata.sourceDocumentLabel,
        }
      : null,
  }

  return (
    <div className="min-h-screen felt-table-ambient text-[var(--parchment)] flex flex-col font-sans selection:bg-[var(--brass)] selection:text-[var(--felt-0)]">
      
      {/* Top Header */}
      <ArbiterHeader
        onOpenMcpInspector={() => setIsMcpInspectorOpen(true)}
        onOpenRulingSlip={() => setIsRulingSlipModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenContradictionMatrix={() => setIsContradictionMatrixOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Main Three-Column Board Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Archival Status Plaque */}
        <div className="plaque-3d px-4 py-2.5 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[var(--brass-light)] font-bold">
              <span className="w-2 h-2 rounded-full bg-[var(--brass)] shadow-[0_0_8px_#fde8a7] animate-pulse" />
              <span>Sanity Content Lake · Synced</span>
            </span>
            <span className="text-[var(--border)]">|</span>
            <span className="text-[var(--parchment)] font-sans">Official Magic CR & 4 Real Controversies Grounded</span>
            <span className="text-[var(--border)] hidden sm:inline">|</span>
            <span className="hidden sm:inline text-[var(--muted)] font-sans">Atomic Graph Dereferencing</span>
          </div>

          <div className="flex items-center gap-3 font-sans text-xs">
            <div className="hidden md:flex items-center gap-2 text-[var(--muted)] text-[11px]">
              <span>Shortcuts:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--felt-0)] border border-[var(--border)] font-mono text-[10px]">G</kbd>
              <span>Slip</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--felt-0)] border border-[var(--border)] font-mono text-[10px]">R</kbd>
              <span>Roll</span>
            </div>

            <code className="text-[var(--brass-light)] font-mono text-[11px] font-bold bg-[rgba(224,172,66,0.12)] px-2 py-0.5 rounded border border-[var(--brass-dim)]">
              /api/sanity/mcp
            </code>
          </div>
        </div>

        {/* Mobile View Switcher (Visible on mobile only) */}
        <div className="flex lg:hidden rounded-lg bg-[var(--felt-1)] border border-[var(--border)] p-1 mb-5 text-xs font-sans">
          <button
            onClick={() => setMobileTab('library')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'library'
                ? 'bg-[var(--felt-2)] text-[var(--brass-light)] font-bold'
                : 'text-[var(--muted)]'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Library</span>
          </button>

          <button
            onClick={() => setMobileTab('decree')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'decree'
                ? 'bg-[var(--felt-2)] text-[var(--brass-light)] font-bold'
                : 'text-[var(--muted)]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Ruling Decree</span>
          </button>

          <button
            onClick={() => setMobileTab('provenance')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'provenance'
                ? 'bg-[var(--felt-2)] text-[var(--brass-light)] font-bold'
                : 'text-[var(--muted)]'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Lineage</span>
          </button>
        </div>

        {/* The Three-Column Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          
          {/* 1. Left Rail: Game / Library Switcher (col-span-3) */}
          <div className={`lg:col-span-3 ${mobileTab === 'library' ? 'block' : 'hidden lg:block'}`}>
            <GameSwitcherRail
              games={SEED_GAMES}
              selectedGameId={selectedGameId}
              onSelectGame={(id) => {
                setSelectedGameId(id)
                const firstDispute = SEED_DISPUTES.find((d) => d.gameId === id)
                if (firstDispute) setSelectedDisputeId(firstDispute.id)
                setMobileTab('decree')
              }}
            />
          </div>

          {/* 2. Center Rail: Hero Q -> Cited-Ruling (col-span-6) */}
          <div className={`lg:col-span-6 ${mobileTab === 'decree' ? 'block' : 'hidden lg:block'}`}>
            <ArbiterBoardCenter
              dispute={activeDispute}
              rule={activeRule}
              errata={activeErrata}
              availableDisputes={gameDisputes}
              onSelectDisputeId={setSelectedDisputeId}
              onOpenRulingSlip={() => setIsRulingSlipModalOpen(true)}
              onOpenRuleDetail={() => setIsRuleDrawerOpen(true)}
              onOpenContradictionMatrix={() => setIsContradictionMatrixOpen(true)}
              apiKey={apiKey}
            />
          </div>

          {/* 3. Right Rail: Vertical Provenance Trail (col-span-3) */}
          <div className={`lg:col-span-3 ${mobileTab === 'provenance' ? 'block' : 'hidden lg:block'}`}>
            <ProvenanceTrail
              data={provenanceData}
              onOpenMcpInspector={() => setIsMcpInspectorOpen(true)}
              onOpenRuleDetail={() => setIsRuleDrawerOpen(true)}
            />
          </div>

        </div>

      </main>

      {/* Restrained Compendium Footer */}
      <footer className="border-t border-[var(--border)] py-8 mt-16 text-xs text-[var(--muted)] font-sans bg-[var(--felt-1)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-serif text-sm font-semibold text-[var(--parchment-bright)]">
                TableTop Arbiter
              </div>
              <p className="text-xs text-[var(--muted)] font-sans">
                Zero-hallucination tournament rules arbitration powered by Sanity Structured Content Lake.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-sans">
              <Link
                href="/studio"
                target="_blank"
                className="hover:text-[var(--brass-light)] transition-colors flex items-center gap-1"
              >
                <Database className="w-3.5 h-3.5 text-[var(--brass-dim)]" />
                <span>Sanity Studio</span>
              </Link>

              <button
                onClick={() => setIsMcpInspectorOpen(true)}
                className="hover:text-[var(--brass-light)] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-[var(--brass-dim)]" />
                <span>MCP Endpoint</span>
              </button>

              <a
                href="https://dev.to/challenges/sanity-2026-09-16"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--brass-light)] transition-colors text-[var(--brass-light)] font-semibold"
              >
                DEV x Sanity Challenge →
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)]">
            <span>MIT License · Authoritative Rules Engine</span>
            <span>Grounded via GROQ relational dereferencing</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <RulingSlipModal
        isOpen={isRulingSlipModalOpen}
        onClose={() => setIsRulingSlipModalOpen(false)}
        dispute={activeDispute}
      />

      <SanityMcpInspectorModal
        isOpen={isMcpInspectorOpen}
        onClose={() => setIsMcpInspectorOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={apiKey}
      />

      <RuleDetailDrawer
        isOpen={isRuleDrawerOpen}
        onClose={() => setIsRuleDrawerOpen(false)}
        rule={activeRule}
        errata={activeErrata}
      />

      <ContradictionMatrixModal
        isOpen={isContradictionMatrixOpen}
        onClose={() => setIsContradictionMatrixOpen(false)}
        onSelectScenario={(id) => {
          setSelectedDisputeId(id)
          const found = SEED_DISPUTES.find((d) => d.id === id)
          if (found) setSelectedGameId(found.gameId)
        }}
      />

    </div>
  )
}
