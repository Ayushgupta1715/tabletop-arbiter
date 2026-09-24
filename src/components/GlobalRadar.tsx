'use client'

import React, { useState } from 'react'
import {
  Radar,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Globe2,
  TrendingUp,
  Filter,
  ArrowUpRight,
  Radio,
  Clock
} from 'lucide-react'

interface ThreatIncident {
  id: string
  title: string
  region: string
  modality: 'video' | 'audio' | 'image' | 'text'
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED'
  viralVelocity: string
  targetVector: string
  timeAgo: string
  debunkSummary: string
}

const LIVE_THREATS: ThreatIncident[] = [
  {
    id: 'th-1',
    title: 'Fabricated Audio Tape of European Central Bank President on Liquidity Rationing',
    region: 'Frankfurt / Global Markets',
    modality: 'audio',
    severity: 'CRITICAL',
    viralVelocity: '94k shares/hour',
    targetVector: 'Financial Panic / Short Selling',
    timeAgo: '18m ago',
    debunkSummary: '16kHz spectral cutoff and glottal pulse absence identifies zero-shot neural voice cloning.'
  },
  {
    id: 'th-2',
    title: 'Synthetic Video Showing Explosion Near Major International Airport',
    region: 'Middle East',
    modality: 'video',
    severity: 'CRITICAL',
    viralVelocity: '120k views/hour',
    targetVector: 'Aviation Panic / State Media Spoofing',
    timeAgo: '42m ago',
    debunkSummary: 'Photometric analysis proves footage spliced from 2021 fireworks depot accident with simulated missile contrail overlay.'
  },
  {
    id: 'th-3',
    title: 'Viral Midjourney v6 Photo of Flood in Downtown Tokyo Metro Station',
    region: 'East Asia',
    modality: 'image',
    severity: 'HIGH',
    viralVelocity: '45k shares/hour',
    targetVector: 'Weather Alarmism / Public Panic',
    timeAgo: '1h ago',
    debunkSummary: 'ELA differential error delta shows +34dB on water reflections and pseudo-Japanese signage runes.'
  },
  {
    id: 'th-4',
    title: 'WhatsApp Viral Forward Claiming Ban on Common Household Painkiller',
    region: 'South Asia / UK',
    modality: 'text',
    severity: 'ELEVATED',
    viralVelocity: '30k forwards/hour',
    targetVector: 'Health Misinformation / Chain Forward',
    timeAgo: '2h ago',
    debunkSummary: 'Zero regulatory notices on FDA or MHRA databases; uses standard urgency baiting templates.'
  },
  {
    id: 'th-5',
    title: 'Deepfake Video of Candidate Conceding Election 2 Days Early',
    region: 'North America',
    modality: 'video',
    severity: 'CRITICAL',
    viralVelocity: '210k impressions/hour',
    targetVector: 'Voter Suppression / Disenfranchisement',
    timeAgo: '3h ago',
    debunkSummary: 'Lip-sync phoneme mismatch with 400ms phase lag; facial mask boundaries jitter on head rotation.'
  }
]

export function GlobalRadar({ onSelectThreat }: { onSelectThreat?: (title: string, modality: string) => void }) {
  const [filterModality, setFilterModality] = useState<string>('all')

  const filtered = LIVE_THREATS.filter(t => filterModality === 'all' || t.modality === filterModality)

  return (
    <div className="space-y-6">
      
      {/* Top Threat Radar Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-[#070b14] border-2 border-rose-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.15)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400">
              <Radio className="w-4 h-4 animate-pulse text-rose-400" />
              <span>Global Disinformation Sentinel Radar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Real-Time Synthetic Threat Index
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Monitoring coordinated disinformation campaigns, viral voice clone financial attacks, and election deepfake vectors across global telecommunication networks.
            </p>
          </div>

          {/* Radar Metrics Counters */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-black/70 border border-rose-500/30 text-center">
              <div className="text-2xl font-black text-rose-400">5 Active</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">High-Alert Campaigns</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/70 border border-cyan-500/30 text-center">
              <div className="text-2xl font-black text-cyan-300">99.4%</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Automated Takedown Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Alerts Filter:
          </span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            {['all', 'video', 'audio', 'image', 'text'].map((m) => (
              <button
                key={m}
                onClick={() => setFilterModality(m)}
                className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition-all ${
                  filterModality === m
                    ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Sync Interval: 30s
        </div>
      </div>

      {/* Threat Incident Cards */}
      <div className="space-y-3">
        {filtered.map((threat) => (
          <div
            key={threat.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  threat.severity === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {threat.severity}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 text-[10px] font-bold uppercase">
                  {threat.modality}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-slate-500" />
                  <span>{threat.region}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{threat.timeAgo}</span>
                <span>·</span>
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {threat.viralVelocity}
                </span>
              </div>
            </div>

            <div className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              {threat.title}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-cyan-400">Forensic Debunk:</strong> {threat.debunkSummary}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">
                Target Vector: <strong className="text-slate-300">{threat.targetVector}</strong>
              </span>
              {onSelectThreat && (
                <button
                  onClick={() => onSelectThreat(threat.title, threat.modality)}
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <span>Load Into Forensic Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
