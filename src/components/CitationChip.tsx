'use client'

import React, { useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'

interface CitationChipProps {
  code: string
  label?: string
  className?: string
  onClick?: () => void
}

export function CitationChip({ code, label, className = '', onClick }: CitationChipProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(label ? `${code}: ${label}` : code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <span
      onClick={onClick}
      className={`citation-chip group inline-flex items-center gap-1.5 cursor-pointer transition-all hover:bg-[rgba(224,172,66,0.18)] hover:border-[var(--brass)] active:scale-95 ${className}`}
      title={onClick ? `Click to inspect full text for ${code}` : code}
    >
      <span className="font-mono">{code}</span>
      {label && <span className="font-sans font-normal text-[var(--muted)] text-[11px]">· {label}</span>}
      
      <button
        onClick={handleCopy}
        className="opacity-60 group-hover:opacity-100 hover:text-[var(--brass-light)] transition-opacity p-0.5"
        title="Copy citation code"
        aria-label="Copy citation"
      >
        {copied ? (
          <Check className="w-3 h-3 text-[#34D399]" />
        ) : (
          <Copy className="w-3 h-3 text-[var(--brass-dim)] hover:text-[var(--brass-light)]" />
        )}
      </button>
    </span>
  )
}
