'use client'

import React, { useState, useMemo } from 'react'
import { GameRecord } from '@/sanity/lib/seedData'
import { BookMarked, Swords, Shield, Dice5, Skull, Scroll, ChevronRight, Search, X } from 'lucide-react'

interface GameSwitcherRailProps {
  games: GameRecord[]
  selectedGameId: string
  onSelectGame: (gameId: string) => void
}

export function GameSwitcherRail({
  games,
  selectedGameId,
  onSelectGame,
}: GameSwitcherRailProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const getGameIcon = (slug: string) => {
    switch (slug) {
      case 'magic-the-gathering':
        return <Swords className="w-3.5 h-3.5" />
      case 'warhammer-40000':
        return <Shield className="w-3.5 h-3.5" />
      case 'catan':
        return <Dice5 className="w-3.5 h-3.5" />
      case 'gloomhaven':
        return <Skull className="w-3.5 h-3.5" />
      case 'dungeons-and-dragons':
        return <Scroll className="w-3.5 h-3.5" />
      default:
        return <BookMarked className="w-3.5 h-3.5" />
    }
  }

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return games
    const q = searchQuery.toLowerCase()
    return games.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.tournamentCircuit.toLowerCase().includes(q)
    )
  }, [games, searchQuery])

  return (
    <nav className="space-y-3">
      
      {/* Header with Title and Search Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1">
          <span className="eyebrow-label text-[var(--brass-light)] font-bold">Rules Libraries</span>
          <span className="font-mono text-[10px] text-[var(--muted)]">
            {filteredGames.length} / {games.length} Circuits
          </span>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules library..."
            className="w-full bg-[var(--felt-1)] border border-[var(--border)] focus:border-[var(--brass-dim)] focus:outline-none focus:ring-1 focus:ring-[var(--brass)] rounded-lg pl-8 pr-7 py-1.5 text-xs font-sans text-[var(--parchment)] placeholder-[var(--muted)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--parchment-bright)]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Desktop: Vertical Docket Stack; Mobile: Horizontal Scroll Tab Strip */}
      <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2.5 pb-2 lg:pb-0 scrollbar-none">
        {filteredGames.map((game, index) => {
          const isSelected = game.id === selectedGameId

          return (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`p-3.5 rounded-xl text-left transition-all duration-200 shrink-0 lg:shrink w-64 lg:w-full cursor-pointer relative group overflow-hidden border border-[var(--border)] ${
                isSelected
                  ? 'plaque-3d-active text-[var(--parchment-bright)] opacity-100 scale-[1.01]'
                  : 'plaque-3d text-[var(--muted)] opacity-75 hover:opacity-100 hover:scale-[1.01] hover:border-[var(--brass-dim)]'
              }`}
            >
              {/* Active 3D metallic gold spine clasp */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#fde8a7] via-[#e0ac42] to-[#9a7628] shadow-[0_0_8px_rgba(224,172,66,0.6)]" />
              )}

              {/* Header: Number & Category */}
              <div className="flex items-center justify-between gap-2 text-[10px] text-[var(--muted)]">
                <span className="flex items-center gap-1.5 font-mono">
                  <span className="text-[var(--brass-light)]">{getGameIcon(game.slug)}</span>
                  <span className="font-semibold">LIB-0{index + 1}</span>
                </span>
                <span className="tracking-wider uppercase text-[9px] font-sans px-1.5 py-0.5 rounded bg-[var(--felt-0)] border border-[var(--border)]">
                  {game.category}
                </span>
              </div>

              {/* Game Title */}
              <div className="mt-2 flex items-center justify-between gap-1">
                <span className="font-serif text-[15px] font-bold leading-tight line-clamp-1 text-[var(--parchment)] group-hover:text-white transition-colors">
                  {game.title}
                </span>
                {isSelected ? (
                  <span className="w-2 h-2 rounded-full bg-[var(--brass)] shadow-[0_0_6px_#fde8a7] shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--border)] group-hover:text-[var(--brass-light)] transition-colors shrink-0" />
                )}
              </div>

              {/* Current Official Edition */}
              <div
                className="mt-1 font-sans text-xs text-[var(--muted)] line-clamp-1"
                title={game.currentEdition}
              >
                {game.currentEdition}
              </div>

              {/* Tournament Circuit Stamp with full tooltip */}
              <div
                className="mt-2.5 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-sans"
                title={`Official Circuit: ${game.tournamentCircuit}`}
              >
                <span className="text-[var(--muted)] truncate max-w-[170px]">
                  {game.tournamentCircuit.split('&')[0].trim()}
                </span>
                <span className="text-[var(--brass-light)] font-mono text-[10px] font-bold shrink-0 bg-[rgba(224,172,66,0.1)] px-1.5 py-0.5 rounded border border-[var(--brass-dim)]">
                  1 Errata Active
                </span>
              </div>
            </button>
          )
        })}

        {filteredGames.length === 0 && (
          <div className="p-4 text-center text-xs text-[var(--muted)] font-sans border border-dashed border-[var(--border)] rounded-xl">
            No rules libraries match &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>

    </nav>
  )
}
