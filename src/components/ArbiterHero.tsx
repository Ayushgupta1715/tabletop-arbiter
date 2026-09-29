'use client'

import React from 'react'
import {
  Scale,
  ShieldAlert,
  Sparkles,
  BookOpen,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

interface ArbiterHeroProps {
  onScrollToArena: () => void
  onOpenMcpInspector: () => void
}

export function ArbiterHero({ onScrollToArena, onOpenMcpInspector }: ArbiterHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-900/40 bg-gradient-to-b from-[#131826] via-[#0d121f] to-[#0a0d17] p-8 md:p-12 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        
        {/* Challenge Track Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>DEV x Sanity Challenge — Path One: Ship an Agent That Queries Real Content</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] font-serif">
          When Tabletop Rules Threaten Friendships,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
            Sanity Delivers Truth.
          </span>
        </h1>

        {/* Subtitle / Core Thesis */}
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
          Generic vector RAG and conversational LLMs regularly hallucinate tabletop rules because they lump 
          together outdated 2014 rulebooks with modern errata. <strong className="text-amber-300">TableTop Arbiter</strong> connects an autonomous tournament copilot to <strong className="text-amber-300">Sanity’s Structured Content Lake</strong> via <strong className="text-amber-300">Model Context Protocol (MCP)</strong> to enforce active tournament overrides with zero hallucination.
        </p>

        {/* Vector RAG vs Sanity MCP Comparison Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Generic Vector RAG (The Failure)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Smears semantic chunks together. Cannot distinguish whether a 2021 printed rule is superseded by a 2024 Balance Dataslate or an official Head Judge FAQ.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sanity Context MCP (The Solution)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deterministic relational graph: <code className="text-emerald-300 font-mono text-[11px]">RuleErrata [supersedes -&gt; GameRule]</code>. Queries traverse exact document IDs to quote active overrides and official provenance.
            </p>
          </div>

        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <button
            onClick={onScrollToArena}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Enter Dispute Arena</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenMcpInspector}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900/80 border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>Inspect Sanity MCP Telemetry</span>
          </button>
        </div>

      </div>
    </section>
  )
}
