'use client'

import React, { useState } from 'react'
import { X, Copy, Check, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react'
import { GameRuleRecord, RuleErrataRecord } from '@/sanity/lib/seedData'

interface RuleDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  rule: GameRuleRecord | null
  errata: RuleErrataRecord | null
}

export function RuleDetailDrawer({
  isOpen,
  onClose,
  rule,
  errata,
}: RuleDetailDrawerProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !rule) return null

  const handleCopy = () => {
    const text = `[${rule.sectionCode}] ${rule.ruleTitle}\n"${rule.officialRawText}"\n\nEdition: ${rule.originalRulebookEdition}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--felt-1)] border-l border-[var(--brass-dim)] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--brass-light)]" />
                <span className="font-mono text-xs font-bold text-[var(--brass-light)] uppercase tracking-wider">
                  Official Rulebook Clause
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--parchment-bright)] hover:bg-[var(--felt-2)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Section Code */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[rgba(224,172,66,0.12)] border border-[var(--brass-dim)] font-mono text-xs font-bold text-[var(--brass-light)]">
                {rule.sectionCode}
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--parchment-bright)] leading-tight">
                {rule.ruleTitle}
              </h3>
              <p className="text-xs text-[var(--muted)] font-sans">
                Source: {rule.originalRulebookEdition}
              </p>
            </div>

            {/* Official Raw Text (Cotton Vellum Box) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="eyebrow-label">Verbatim Rulebook Language</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[var(--brass-light)] hover:underline text-xs font-sans cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34D399]" />
                      <span className="text-[#34D399]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[var(--felt-0)] border border-[var(--border)] text-sm font-sans text-[var(--parchment)] leading-relaxed shadow-inner">
                &ldquo;{rule.officialRawText}&rdquo;
              </div>
            </div>

            {/* Apparent Interpretation vs Trap */}
            <div className="p-4 rounded-xl bg-[var(--felt-2)] border border-[var(--border)] space-y-1.5 text-xs font-sans">
              <span className="eyebrow-label text-[var(--brass-light)]">Plain Meaning Interpretation</span>
              <p className="text-[var(--parchment)] leading-relaxed">
                {rule.apparentInterpretation}
              </p>
            </div>

            {/* Active Errata Connection */}
            {errata && (
              <div className="p-4 rounded-xl bg-[var(--felt-0)] border border-[var(--superseded)]/40 space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="eyebrow-label text-[var(--superseded)] font-bold">
                    Active Tournament Override
                  </span>
                  <span className="font-mono text-[10px] text-[var(--brass-light)] font-semibold">
                    {errata.patchVersion}
                  </span>
                </div>
                <p className="text-[var(--parchment)] font-serif italic text-xs leading-relaxed">
                  &ldquo;{errata.officialRulingText}&rdquo;
                </p>
                <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--muted)] flex items-center justify-between">
                  <span>Authority: {errata.governingAuthority}</span>
                  {errata.sourceUrl && (
                    <a
                      href={errata.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--brass-light)] hover:underline flex items-center gap-1"
                    >
                      <span>Official FAQ</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Sanity Grounding Guarantee */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.25)] text-xs text-[#34D399] font-sans">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Sanity Content Lake Grounded — 0% Vector Hallucination</span>
            </div>

          </div>

          {/* Close CTA */}
          <div className="pt-6 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg text-xs font-sans text-[var(--parchment)] bg-[var(--felt-0)] hover:bg-[var(--felt-2)] border border-[var(--border)] transition-colors cursor-pointer"
            >
              Close Rulebook Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
