'use client'

import React, { useState } from 'react'
import {
  DisputedScenarioRecord,
  SEED_DISPUTES,
  SEED_GAMES,
  SEED_RULES,
  SEED_ERRATAS,
} from '@/sanity/lib/seedData'
import {
  Swords,
  Shield,
  Dice5,
  Skull,
  Scroll,
  Scale,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  FileText,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'

interface DisputeArenaProps {
  onSelectDisputeForRuling: (dispute: DisputedScenarioRecord) => void
}

export function DisputeArena({ onSelectDisputeForRuling }: DisputeArenaProps) {
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(SEED_DISPUTES[0].id)

  const activeDispute =
    SEED_DISPUTES.find((d) => d.id === selectedDisputeId) || SEED_DISPUTES[0]

  const activeRule = SEED_RULES.find((r) => r.id === activeDispute.governingRuleId)
  const activeErrata = SEED_ERRATAS.find((e) => e.id === activeDispute.governingErrataId)

  const getGameIcon = (gameId: string) => {
    switch (gameId) {
      case 'game-mtg':
        return <Swords className="w-4 h-4 text-amber-400" />
      case 'game-wh40k':
        return <Shield className="w-4 h-4 text-cyan-400" />
      case 'game-catan':
        return <Dice5 className="w-4 h-4 text-amber-500" />
      case 'game-gloomhaven':
        return <Skull className="w-4 h-4 text-purple-400" />
      case 'game-dnd':
        return <Scroll className="w-4 h-4 text-red-400" />
      default:
        return <Scale className="w-4 h-4 text-amber-400" />
    }
  }

  const getStakesBadge = (stakes: DisputedScenarioRecord['stakesLevel']) => {
    switch (stakes) {
      case 'finals':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-red-400" />
            <span>Pro Tour / Finals</span>
          </span>
        )
      case 'regional':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Regional Qualifier</span>
          </span>
        )
      case 'casual_dispute':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Dice5 className="w-3 h-3 text-amber-400" />
            <span>Game Night Argument</span>
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <span>Tournament Dispute Benchmark Arena</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select a high-stakes rule dispute to see how naive vector LLMs hallucinate vs how Sanity Grounding delivers instant table truth.
          </p>
        </div>

        <button
          onClick={() => onSelectDisputeForRuling(activeDispute)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md self-start sm:self-auto"
        >
          <Scale className="w-4 h-4 text-slate-950" />
          <span>Issue Table Ruling Slip</span>
        </button>
      </div>

      {/* Selector Pill Tabs for 5 Games */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {SEED_DISPUTES.map((dispute) => {
          const isSelected = dispute.id === selectedDisputeId
          return (
            <button
              key={dispute.id}
              onClick={() => setSelectedDisputeId(dispute.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-900/20'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  {getGameIcon(dispute.gameId)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  Case #{dispute.id.split('-')[1].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-white line-clamp-1">{dispute.gameName}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight mt-0.5">
                  {dispute.title}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Main Dispute Resolution Card */}
      <div className="rounded-3xl border border-slate-800 bg-[#0e1320] p-6 sm:p-8 space-y-8 shadow-xl">
        
        {/* Title & Metadata Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/10 border border-amber-500/30">
                {getGameIcon(activeDispute.gameId)}
              </span>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {activeDispute.gameName}
              </span>
              {getStakesBadge(activeDispute.stakesLevel)}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {activeDispute.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectDisputeForRuling(activeDispute)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Ruling Slip</span>
            </button>
          </div>
        </div>

        {/* The Incident Scenario Description */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Tabletop Incident Description</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {activeDispute.scenarioDescription}
          </p>

          {/* Player Arguments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Player A Argument:
              </span>
              <p className="text-xs text-slate-300 leading-normal italic">
                &ldquo;{activeDispute.playerAClaim}&rdquo;
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Player B Argument:
              </span>
              <p className="text-xs text-slate-300 leading-normal italic">
                &ldquo;{activeDispute.playerBClaim}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Contrast Breakdown: Vector RAG vs Sanity Grounded Arbiter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Naive Vector RAG Failure */}
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-400">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Naive Vector RAG / Generic LLM</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/10 text-red-300 border border-red-500/20">
                HALLUCINATION
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-red-900/30 text-xs sm:text-sm text-red-200 leading-relaxed font-mono">
              {activeDispute.naiveLLMAnswer}
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <strong className="text-red-300 font-semibold">Root Cause of Failure:</strong>
              <p className="leading-relaxed">
                {activeErrata?.whyVectorRAGFails ||
                  'Vector embeddings cannot enforce hierarchical superseding logic without relational schema dereferencing.'}
              </p>
            </div>
          </div>

          {/* Right: Sanity Structured Content Grounded Verdict */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sanity TableTop Arbiter (MCP Grounded)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                AUTHORITATIVE VERDICT
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-900/30 text-xs sm:text-sm text-emerald-200 leading-relaxed font-sans font-medium">
              {activeDispute.groundedArbiterRuling}
            </div>

            {/* Citations Footer */}
            <div className="pt-2 border-t border-emerald-900/40 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-slate-400 font-mono">
                  Base Rule:{' '}
                  <code className="text-amber-300 font-bold">
                    {activeRule?.sectionCode || 'CR General'}
                  </code>
                </span>
                <span className="text-slate-400 font-mono">
                  Errata Patch:{' '}
                  <code className="text-emerald-300 font-bold">
                    {activeErrata?.patchVersion || 'Active Override'}
                  </code>
                </span>
              </div>

              {activeErrata?.sourceUrl && (
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span>Source:</span>
                  <a
                    href={activeErrata.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 truncate"
                  >
                    <span>{activeErrata.sourceDocumentLabel}</span>
                    <ExternalLink className="w-3 h-3 inline shrink-0" />
                  </a>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Relational Graph Visualization Drawer */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sanity Relational Traversal Graph</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">GROQ Dereferencing: &quot;-&gt;&quot;</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-xs">
            
            {/* Node 1: Base Rule */}
            <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
              <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Base Rulebook</div>
              <div className="font-bold text-white">{activeRule?.ruleTitle}</div>
              <div className="text-[11px] text-slate-400 font-mono">{activeRule?.sectionCode}</div>
              <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] bg-red-500/10 text-red-400 border border-red-500/20">
                Superseded by Errata
              </span>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center justify-center text-slate-500">
              <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">supersedesRules[]</div>
              <ArrowRight className="w-5 h-5 text-amber-400 rotate-90 md:rotate-0" />
            </div>

            {/* Node 2: Overriding Errata */}
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-1">
              <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Tournament Errata</div>
              <div className="font-bold text-emerald-300">{activeErrata?.title}</div>
              <div className="text-[11px] text-slate-400 font-mono">{activeErrata?.patchVersion}</div>
              <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                ENFORCED ON TABLE
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
