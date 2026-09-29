'use client'

import React, { useState } from 'react'
import {
  SEED_RULES,
  SEED_ERRATAS,
  SEED_DISPUTES,
  RuleErrataRecord,
} from '@/sanity/lib/seedData'
import {
  X,
  Layers,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  ExternalLink,
  GitFork,
  Search,
  CheckCircle2,
} from 'lucide-react'

interface ContradictionMatrixModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectScenario?: (disputeId: string) => void
}

export function ContradictionMatrixModal({
  isOpen,
  onClose,
  onSelectScenario,
}: ContradictionMatrixModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeClassification, setActiveClassification] = useState<string>('all')

  if (!isOpen) return null

  const filteredErrata = SEED_ERRATAS.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.patchVersion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.officialRulingText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass =
      activeClassification === 'all' || e.errataClassification === activeClassification
    return matchesSearch && matchesClass
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col plaque-3d-active rounded-2xl border border-[var(--brass-dim)] shadow-[0_0_40px_rgba(224,172,66,0.2),0_25px_50px_-12px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Brass corner brackets */}
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-[var(--felt-0)]/90">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--brass-light)]" />
              <h2 className="text-xl font-serif font-bold text-[var(--parchment-bright)]">
                Tournament Contradiction & Errata Matrix
              </h2>
            </div>
            <p className="text-xs text-[var(--muted)] font-sans">
              Side-by-side reconciliation of printed base rules vs authoritative tournament overrides dereferenced via Sanity GROQ.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--parchment-bright)] hover:bg-[var(--felt-1)] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-[var(--border)] bg-[var(--felt-1)]/60 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          
          {/* Classification Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[var(--muted)] text-[11px] mr-1">Classification:</span>
            {['all', 'keyword_interaction', 'complete_override', 'timing_priority'].map((cls) => (
              <button
                key={cls}
                onClick={() => setActiveClassification(cls)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer capitalize ${
                  activeClassification === cls
                    ? 'bg-[var(--brass)] text-[var(--felt-0)] font-bold shadow-xs'
                    : 'bg-[var(--felt-0)] text-[var(--muted)] hover:text-[var(--parchment)] border border-[var(--border)]'
                }`}
              >
                {cls.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter rules & overrides..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[var(--felt-0)] border border-[var(--border)] text-[var(--parchment)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--brass)]"
            />
          </div>

        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {filteredErrata.map((errata) => {
            const baseRule = SEED_RULES.find((r) => errata.supersedesRuleIds.includes(r.id))
            const matchingDispute = SEED_DISPUTES.find((d) => d.governingErrataId === errata.id)

            return (
              <div
                key={errata.id}
                className="plaque-3d p-5 rounded-xl border border-[var(--border)] space-y-4 hover:border-[var(--brass-dim)] transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--brass-light)]">
                        {errata.gameName}
                      </span>
                      <span className="text-[var(--border)] font-mono">•</span>
                      <span className="font-mono text-xs text-[var(--muted)]">
                        {errata.patchVersion}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider bg-[rgba(224,172,66,0.12)] border border-[var(--brass-dim)] text-[var(--brass-light)]">
                        {errata.errataClassification.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[var(--parchment-bright)]">
                      {errata.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--muted)] font-mono self-start sm:self-auto shrink-0">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[var(--brass-dim)]" />
                      <span>{errata.effectiveDate}</span>
                    </span>
                    <span className="text-[#34D399] font-sans text-[11px] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{errata.governingAuthority}</span>
                    </span>
                  </div>
                </div>

                {/* Side-by-side Contradiction: Base Rule vs Active Errata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left: Printed Base Rule */}
                  <div className="p-4 rounded-xl bg-[var(--felt-0)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-bold text-[var(--muted)] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[var(--muted)]" />
                        <span>Base Printed Rule ({baseRule?.sectionCode || 'CR Core'})</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.3)] text-[#F87171]">
                        OVERRULED BY ERRATA
                      </span>
                    </div>
                    <p className="text-xs text-[var(--parchment)] font-sans leading-relaxed italic bg-[var(--felt-1)]/60 p-3 rounded-lg border border-[var(--border)]">
                      &ldquo;{baseRule?.officialRawText}&rdquo;
                    </p>
                    <p className="text-[11px] text-[var(--muted)] font-sans">
                      <span className="font-semibold text-[var(--parchment)]">Naive Interpretation:</span> {baseRule?.apparentInterpretation}
                    </p>
                  </div>

                  {/* Right: Authoritative Errata Override */}
                  <div className="p-4 rounded-xl bg-[var(--felt-0)] border border-[var(--brass-dim)] shadow-[inset_0_0_18px_rgba(224,172,66,0.06)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-bold text-[var(--brass-light)] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--brass-light)]" />
                        <span>Authoritative Tournament Ruling</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] text-[#34D399]">
                        ACTIVE PRECEDENT
                      </span>
                    </div>
                    <p className="text-xs text-[var(--parchment-bright)] font-sans leading-relaxed bg-[var(--felt-1)] p-3 rounded-lg border border-[var(--border)] font-medium">
                      &ldquo;{errata.officialRulingText}&rdquo;
                    </p>
                    <p className="text-[11px] text-[var(--muted)] font-sans">
                      <span className="font-semibold text-[var(--brass-light)]">Tournament Rationale:</span> {errata.rationale}
                    </p>
                  </div>

                </div>

                {/* Footer Bar: Why Vector RAG Fails & Test Button */}
                <div className="pt-3 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2 flex-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-[var(--superseded)] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[var(--muted)] font-sans">
                      <strong className="text-[var(--superseded)]">Why Vector Embeddings Fail Here:</strong> {errata.whyVectorRAGFails}
                    </p>
                  </div>

                  {matchingDispute && onSelectScenario && (
                    <button
                      onClick={() => {
                        onSelectScenario(matchingDispute.id)
                        onClose()
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-sans font-semibold text-[var(--parchment)] bg-[var(--felt-0)] hover:bg-[var(--felt-2)] border border-[var(--border)] hover:border-[var(--brass-dim)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <GitFork className="w-3.5 h-3.5 text-[var(--brass-light)]" />
                      <span>Test in Live Arbiter</span>
                    </button>
                  )}
                </div>

              </div>
            )
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--felt-0)]/90 flex items-center justify-between text-xs text-[var(--muted)] font-sans">
          <span>Dereferencing query: <code className="font-mono text-[var(--brass-light)]">*[_type == &quot;ruleErrata&quot; &amp;&amp; references($ruleId)]</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-sans font-medium text-[var(--parchment)] bg-[var(--felt-1)] hover:bg-[var(--felt-2)] border border-[var(--border)] cursor-pointer"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  )
}
