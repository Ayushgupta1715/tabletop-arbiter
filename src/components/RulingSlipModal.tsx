'use client'

import React, { useState } from 'react'
import {
  DisputedScenarioRecord,
  SEED_RULES,
  SEED_ERRATAS,
} from '@/sanity/lib/seedData'
import { CitationChip } from './CitationChip'
import { Scale, X, Printer, Copy, Check } from 'lucide-react'

interface RulingSlipModalProps {
  isOpen: boolean
  onClose: () => void
  dispute: DisputedScenarioRecord | null
}

export function RulingSlipModal({
  isOpen,
  onClose,
  dispute,
}: RulingSlipModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !dispute) return null

  const rule = SEED_RULES.find((r) => r.id === dispute.governingRuleId)
  const errata = SEED_ERRATAS.find((e) => e.id === dispute.governingErrataId)

  const handleCopy = () => {
    const text = `===================================================
TABLETOP ARBITER — OFFICIAL TOURNAMENT RULING SLIP
===================================================
Game: ${dispute.gameName}
Case: ${dispute.title}
Timestamp: ${new Date().toISOString()}

VERDICT:
${dispute.groundedArbiterRuling}

BASE RULE CITATION:
- Section: ${rule?.sectionCode || 'CR'} (${rule?.ruleTitle})
- Edition: ${rule?.originalRulebookEdition || 'Core Rules'}
- Text: "${rule?.officialRawText}"

OVERRIDING TOURNAMENT ERRATA:
- Directive: ${errata?.title}
- Patch Version: ${errata?.patchVersion}
- Authority: ${errata?.governingAuthority}
- Effective Date: ${errata?.effectiveDate}

CRYPTOGRAPHIC PROVENANCE:
- Record ID: ${dispute.id}
- Verification Hash: ${dispute.provenanceHash}
===================================================`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="plaque-3d-active relative w-full max-w-2xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-[var(--parchment)] shadow-2xl">
        
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

        {/* Certificate Header Banner */}
        <div className="text-center space-y-2 border-b border-[var(--border)] pb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-b from-[#e5ba55] to-[#8a6f34] p-[1px] shadow-[0_4px_12px_rgba(0,0,0,0.6)] mb-1">
            <div className="w-full h-full rounded-[11px] bg-[var(--felt-1)] flex items-center justify-center text-[var(--brass-light)]">
              <Scale className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--parchment-bright)] tracking-tight">
            Official Tabletop Tournament Ruling Slip
          </h2>
          <div className="flex items-center justify-center gap-2 eyebrow-label text-[var(--brass-light)]">
            <span className="seal-upheld-3d px-2.5 py-0.5 rounded text-[10px] uppercase font-bold">Sanity Context MCP Certified</span>
            <span>·</span>
            <span className="font-mono text-xs">Provenance Verified</span>
          </div>
        </div>

        {/* Dispute Details */}
        <div className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="plaque-3d p-3.5 rounded-xl">
              <span className="eyebrow-label">Target Ruleset</span>
              <p className="font-bold text-[var(--parchment-bright)] text-sm mt-0.5">{dispute.gameName}</p>
            </div>
            <div className="plaque-3d p-3.5 rounded-xl">
              <span className="eyebrow-label">Competitive Tier</span>
              <p className="font-mono text-[var(--brass-light)] font-bold text-sm mt-0.5">{dispute.stakesLevel.toUpperCase()}</p>
            </div>
          </div>

          {/* Official Verdict Box */}
          <div className="plaque-3d-active p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-[var(--brass-light)] font-bold">Authoritative Arbiter Ruling</span>
              {rule && <CitationChip code={rule.sectionCode} />}
            </div>
            <p className="text-sm text-[var(--parchment-bright)] font-serif leading-relaxed font-medium">
              {dispute.groundedArbiterRuling}
            </p>
          </div>

          {/* Citations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="plaque-3d p-4 rounded-xl space-y-1">
              <span className="eyebrow-label">Base Printed Rule</span>
              <p className="font-mono text-[var(--parchment-bright)] font-semibold">{rule?.sectionCode}: {rule?.ruleTitle}</p>
              <p className="font-mono text-[11px] text-[var(--muted)] line-clamp-2">
                &ldquo;{rule?.officialRawText}&rdquo;
              </p>
            </div>

            <div className="plaque-3d p-4 rounded-xl space-y-1">
              <span className="eyebrow-label text-[var(--brass-light)] font-bold">Enforced Tournament Errata</span>
              <p className="font-mono text-[var(--brass-light)] font-semibold">{errata?.patchVersion}</p>
              <p className="text-[11px] text-[var(--muted)] line-clamp-2">
                Authority: {errata?.governingAuthority} ({errata?.effectiveDate})
              </p>
            </div>
          </div>

          {/* Verification Bar */}
          <div className="plaque-3d p-3 rounded-xl font-mono text-[11px] text-[var(--muted)] flex items-center justify-between">
            <span className="truncate mr-2 text-[var(--muted)]">Hash: {dispute.provenanceHash}</span>
            <span className="seal-upheld-3d px-2 py-0.5 rounded text-[10px] font-bold">AUTHENTIC</span>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
          <button
            onClick={handleCopy}
            className="btn-3d-surface flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--brass)]" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="btn-3d-brass flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ruling Slip</span>
          </button>
        </div>

      </div>
    </div>
  )
}
