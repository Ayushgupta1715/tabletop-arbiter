'use client'

import React, { useState } from 'react'
import {
  SEED_RULES,
  SEED_ERRATAS,
  SEED_GAMES,
  RuleErrataRecord,
  GameRuleRecord,
} from '@/sanity/lib/seedData'
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Calendar,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react'

export function ErrataMatrix() {
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [expandedErrataId, setExpandedErrataId] = useState<string>(SEED_ERRATAS[0].id)

  const filteredErrata = SEED_ERRATAS.filter((errata) => {
    const matchesGame =
      selectedGameFilter === 'all' || errata.gameId === selectedGameFilter
    const matchesSearch =
      errata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      errata.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      errata.patchVersion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      errata.officialRulingText.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesGame && matchesSearch
  })

  const getClassificationBadge = (
    classification: RuleErrataRecord['errataClassification']
  ) => {
    switch (classification) {
      case 'complete_override':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
            ⚖️ Complete Inversion
          </span>
        )
      case 'timing_priority':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
            ⏱️ Timing & Priority
          </span>
        )
      case 'keyword_interaction':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30">
            🧩 Keyword Edge-Case
          </span>
        )
      case 'restriction':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/30">
            🚫 Restriction
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Official Errata & Rulebook Override Matrix</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Structured Sanity knowledge base modeling printed base rules and their active tournament errata overrides.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Game filter dropdown */}
          <select
            value={selectedGameFilter}
            onChange={(e) => setSelectedGameFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Games ({SEED_GAMES.length})</option>
            {SEED_GAMES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search errata or rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-44 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Errata List */}
      <div className="space-y-4">
        {filteredErrata.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No errata found matching your search.
          </div>
        ) : (
          filteredErrata.map((errata) => {
            const isExpanded = errata.id === expandedErrataId
            const baseRule = SEED_RULES.find((r) =>
              errata.supersedesRuleIds.includes(r.id)
            )

            return (
              <div
                key={errata.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-[#0f1422] border-amber-500/50 shadow-xl'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header row / clickable accordion */}
                <div
                  onClick={() =>
                    setExpandedErrataId(isExpanded ? '' : errata.id)
                  }
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {errata.gameName}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-mono text-slate-300">
                        {errata.patchVersion}
                      </span>
                      {getClassificationBadge(errata.errataClassification)}
                    </div>
                    <h4 className="text-base font-bold text-white hover:text-amber-300 transition-colors">
                      {errata.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="text-right hidden md:block">
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{errata.effectiveDate}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        {errata.governingAuthority}
                      </div>
                    </div>
                    <div
                      className={`p-1 rounded-lg bg-slate-800 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-90 text-amber-400' : ''
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-6">
                    
                    {/* Side-by-side comparison: Base Rulebook vs Errata Ruling */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      
                      {/* Left: Original Base Rule */}
                      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span>Printed Base Rule: {baseRule?.sectionCode}</span>
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/10 text-red-400 border border-red-500/20">
                            SUPERSEDED
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-slate-900">
                          &ldquo;{baseRule?.officialRawText}&rdquo;
                        </p>
                        <p className="text-[11px] text-slate-400 italic">
                          Apparent Naive Meaning: {baseRule?.apparentInterpretation}
                        </p>
                      </div>

                      {/* Right: Authoritative Errata Override */}
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Enforced Errata: {errata.patchVersion}</span>
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            TOURNAMENT TRUTH
                          </span>
                        </div>
                        <p className="text-xs text-emerald-200 leading-relaxed bg-black/40 p-3 rounded-lg border border-emerald-900/30">
                          &ldquo;{errata.officialRulingText}&rdquo;
                        </p>
                        <p className="text-[11px] text-slate-300">
                          <strong className="text-amber-300">Designer Rationale:</strong>{' '}
                          {errata.rationale}
                        </p>
                      </div>

                    </div>

                    {/* Why Vector Search Fails Box */}
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Why Generic Vector Search / Unstructured RAG Hallucinates:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {errata.whyVectorRAGFails}
                      </p>
                    </div>

                    {/* Provenance Link */}
                    {errata.sourceUrl && (
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span className="font-mono text-[11px]">
                          Official Citation: {errata.sourceDocumentLabel}
                        </span>
                        <a
                          href={errata.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>View Official Tournament Source</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
