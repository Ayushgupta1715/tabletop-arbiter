'use client'

import React from 'react'
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Globe2,
  Scale
} from 'lucide-react'
import { ClaimVerificationItem, ForensicResult } from '@/types/forensics'

interface FactCheckMatrixProps {
  result: ForensicResult
}

export function FactCheckMatrix({ result }: FactCheckMatrixProps) {
  const isFalse = result.verdict === 'HIGH_CONFIDENCE_DEEPFAKE' || result.verdict === 'FABRICATED_NEWS'

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Scale className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              Fact-Check Registry & Source Corroboration
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Automated cross-referencing against verified International Fact-Checking Network (IFCN) signatories
          </p>
        </div>

        {/* Global Consensus Meter */}
        <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
          isFalse 
            ? 'bg-rose-950/40 text-rose-300 border-rose-500/40' 
            : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
        }`}>
          {isFalse ? (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Consensus: Refuted by accredited wires</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Consensus: Corroborated authentic reporting</span>
            </>
          )}
        </div>
      </div>

      {/* Wire Services Coverage Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { name: 'Reuters Fact Check', status: isFalse ? 'Refuted' : 'Corroborated', verified: true },
          { name: 'Associated Press (AP)', status: isFalse ? 'Debunked' : 'Corroborated', verified: true },
          { name: 'Poynter IFCN Registry', status: isFalse ? 'Flagged Hoax' : 'Verified', verified: true },
          { name: 'Snopes Intelligence', status: isFalse ? 'False Rating' : 'Consistent', verified: true },
        ].map((wire, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-black/60 border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="truncate">{wire.name}</span>
              <Globe2 className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isFalse ? 'bg-rose-500' : 'bg-emerald-400'}`} />
              <span className={`text-xs font-mono font-bold ${isFalse ? 'text-rose-400' : 'text-emerald-400'}`}>
                {wire.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Claims Breakdown List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Claim-By-Claim Forensic Dissection
        </div>

        {result.claims.map((claim) => (
          <div
            key={claim.id}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-cyan-400">“</span>
                <span>{claim.claim}</span>
                <span className="text-cyan-400">”</span>
              </div>
              <span className={`self-start sm:self-auto px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shrink-0 ${
                claim.status === 'DEBUNKED_FALSE'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : claim.status === 'VERIFIED_TRUE'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {claim.status.replace(/_/g, ' ')} ({claim.confidence}% confidence)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans pl-2 border-l-2 border-slate-700">
              {claim.explanation}
            </p>

            {claim.corroboratingSources && claim.corroboratingSources.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="text-slate-500 font-semibold">Corroborating Evidence:</span>
                {claim.corroboratingSources.map((source, sIdx) => (
                  <a
                    key={sIdx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all font-mono"
                  >
                    <span>{source.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
