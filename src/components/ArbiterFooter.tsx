'use client'

import React from 'react'
import Link from 'next/link'
import {
  Scale,
  Sparkles,
  ExternalLink,
  Database,
  Terminal,
  ShieldCheck,
  Heart,
} from 'lucide-react'

export function ArbiterFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070b14] text-slate-400 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white font-serif tracking-tight">
                TableTop<span className="text-amber-400">Arbiter</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An autonomous tournament rules arbiter powered by Sanity&apos;s Structured Content Lake and Model Context Protocol (MCP). Eliminating LLM hallucinations on competitive board game and TCG errata.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Built for the DEV x Sanity Challenge (Path One)</span>
            </div>
          </div>

          {/* Col 2: Sanity Architecture */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-200">
              Sanity Architecture
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/studio"
                  target="_blank"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <Database className="w-3 h-3 text-amber-500" />
                  <span>Sanity Studio (/studio)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/api/sanity/mcp"
                  target="_blank"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <Terminal className="w-3 h-3 text-amber-500" />
                  <span>MCP Endpoint (/api/sanity/mcp)</span>
                </Link>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-[11px]">
                  Engine: GROQ Dereferencing
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Games Supported */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-200">
              Tournament Circuits
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Magic: The Gathering (CR 2024)</li>
              <li>• Warhammer 40k (10th Ed Dataslates)</li>
              <li>• Catan World Championship Regs</li>
              <li>• Gloomhaven Comprehensive FAQ</li>
              <li>• Dungeons & Dragons 2024 Revised</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 TableTop Arbiter — Open source under MIT License.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Grounding truth with</span>
            <span className="text-amber-400 font-semibold">Sanity.io</span>
            <span>&</span>
            <span className="text-amber-400 font-semibold">DEV Community</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
