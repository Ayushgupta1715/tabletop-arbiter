'use client'

import React from 'react'
import {
  FileCheck,
  ShieldCheck,
  ShieldAlert,
  Download,
  Printer,
  X,
  QrCode,
  Lock,
  ExternalLink,
  Award
} from 'lucide-react'
import { ForensicResult } from '@/types/forensics'

interface AuditCertificateModalProps {
  isOpen: boolean
  onClose: () => void
  result: ForensicResult | null
}

export function AuditCertificateModal({
  isOpen,
  onClose,
  result
}: AuditCertificateModalProps) {
  if (!isOpen || !result) return null

  const isDeepfake = result.verdict === 'HIGH_CONFIDENCE_DEEPFAKE' || result.verdict === 'FABRICATED_NEWS'
  const isAuthentic = result.verdict === 'VERIFIED_AUTHENTIC'

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `truthlens-audit-${result.auditCertificate.blockVerificationId}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#090e1b] border-2 border-cyan-500/40 p-6 sm:p-10 shadow-[0_0_60px_rgba(6,182,212,0.3)] text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header Banner */}
        <div className="border-b border-slate-800 pb-6 mb-6 text-center relative">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            Forensic Audit Certificate
          </h2>
          <p className="text-xs text-cyan-400 font-mono tracking-widest mt-1">
            TRUTHLENS CRYPTOGRAPHIC VERIFICATION REGISTRY
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400 font-mono">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>ID: {result.auditCertificate.blockVerificationId}</span>
            <span>·</span>
            <span>{new Date(result.auditCertificate.timestampISO).toUTCString()}</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="space-y-6 text-sm">
          
          {/* Target Title & Modality */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Asset Subject Under Examination
            </span>
            <div className="text-base font-bold text-white flex items-center justify-between gap-2">
              <span className="truncate">{result.title}</span>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {result.modality}
              </span>
            </div>
          </div>

          {/* Official Verdict & Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border ${
              isDeepfake 
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-300' 
                : isAuthentic
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Final Forensic Ruling
              </div>
              <div className="text-lg font-black tracking-tight mt-1 flex items-center gap-1.5">
                {isDeepfake ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
                <span>{result.verdict.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Authenticity Rating
              </div>
              <div className="text-2xl font-black text-cyan-300 mt-0.5">
                {result.authenticityScore}%
                <span className="text-xs font-normal text-slate-400 ml-2">
                  (Confidence: {result.confidenceLevel}%)
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Examiner Finding & Evidence
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {result.executiveSummary}
            </p>
          </div>

          {/* Cryptographic SHA-256 Digest & QR Block */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-white text-black shrink-0">
              <QrCode className="w-12 h-12" />
            </div>
            <div className="min-w-0 flex-1 space-y-1 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Cryptographic SHA-256 Media Digest
              </div>
              <div className="text-[11px] text-cyan-300 break-all select-all font-semibold">
                {result.auditCertificate.hash}
              </div>
              <div className="text-[9px] text-slate-500">
                Engine: {result.auditCertificate.examinerEngine}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-3 print:hidden">
          <p className="text-[11px] text-slate-400">
            Immutable Chain of Custody Record
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
