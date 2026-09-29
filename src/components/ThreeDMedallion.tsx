'use client'

import React, { useRef, useEffect, useState } from 'react'
import { RotateCw, Dices } from 'lucide-react'

interface ThreeDMedallionProps {
  onRollComplete?: (result: number) => void
  label?: string
}

export function ThreeDMedallion({ onRollComplete, label = 'Tournament Adjudication Seal' }: ThreeDMedallionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDragging = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const rot = useRef({ x: 0.35, y: 0.45, z: 0 })
  const vel = useRef({ x: 0.003, y: 0.008 })
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentScore, setCurrentScore] = useState<number>(20)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const dpr = window.devicePixelRatio || 1
    const size = 180
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // 3D Icosahedron (D20) geometry vertices
    const phi = (1 + Math.sqrt(5)) / 2
    const rawVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ]

    // Radius
    const radius = 60
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z)
      return [(x / len) * radius, (y / len) * radius, (z / len) * radius]
    })

    // 20 triangular faces of an icosahedron
    const faces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ]

    const render = () => {
      ctx.clearRect(0, 0, size, size)
      const cx = size / 2
      const cy = size / 2

      // Apply rotation physics
      if (!isDragging.current) {
        rot.current.x += vel.current.x
        rot.current.y += vel.current.y
        if (Math.abs(vel.current.x) > 0.005) vel.current.x *= 0.985
        if (Math.abs(vel.current.y) > 0.005) vel.current.y *= 0.985
      }

      const cosX = Math.cos(rot.current.x)
      const sinX = Math.sin(rot.current.x)
      const cosY = Math.cos(rot.current.y)
      const sinY = Math.sin(rot.current.y)

      // Project vertices to 2D screen
      const projected = vertices.map(([x, y, z]) => {
        // Rotate around Y
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        // Rotate around X
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX
        // Perspective projection
        const fov = 360
        const scale = fov / (fov + z2)
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
        }
      })

      // Calculate face normals and sort by Z (Painter's algorithm)
      const sortedFaces = faces
        .map((faceIndices, faceIdx) => {
          const v0 = projected[faceIndices[0]]
          const v1 = projected[faceIndices[1]]
          const v2 = projected[faceIndices[2]]

          // 2D Cross product for backface culling
          const normalZ = (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x)
          const avgZ = (v0.z + v1.z + v2.z) / 3

          return {
            indices: faceIndices,
            faceIdx,
            normalZ,
            avgZ,
            v0,
            v1,
            v2,
          }
        })
        .filter((f) => f.normalZ < 0) // Front-facing only
        .sort((a, b) => b.avgZ - a.avgZ)

      // Draw each face with metallic polished brass lighting & emerald table bounce
      sortedFaces.forEach(({ v0, v1, v2, faceIdx }) => {
        const abX = v1.x - v0.x
        const abY = v1.y - v0.y
        const acX = v2.x - v0.x
        const acY = v2.y - v0.y
        const nx = abY * -1
        const ny = -abX
        const norm = Math.sqrt(nx * nx + ny * ny) || 1
        
        // Directional lamp light (top-left)
        const dot = Math.max(0.12, Math.min(1.0, (nx / norm) * 0.52 + (ny / norm) * 0.55 + 0.55))
        // 24K Specular metallic glint
        const specular = Math.pow(dot, 8) * 85
        // Ambient emerald felt table bounce on underside faces
        const bounce = Math.max(0, -(ny / norm)) * 32

        // Radiant Ormolu gold with realistic table bounce
        const r = Math.min(255, Math.max(20, Math.floor(226 * dot + specular - bounce * 0.5)))
        const g = Math.min(255, Math.max(30, Math.floor(176 * dot + specular * 0.95 + bounce * 0.9)))
        const b = Math.min(255, Math.max(10, Math.floor(68 * dot + specular * 0.55 + bounce * 0.3)))

        // Draw face polygon
        ctx.beginPath()
        ctx.moveTo(v0.x, v0.y)
        ctx.lineTo(v1.x, v1.y)
        ctx.lineTo(v2.x, v2.y)
        ctx.closePath()

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fill()

        // Edge wireframe highlight - warm golden outline
        ctx.strokeStyle = `rgba(253, 232, 167, ${0.6 * dot + 0.25})`
        ctx.lineWidth = 1.4
        ctx.stroke()

        // Face numbers
        const centroidX = (v0.x + v1.x + v2.x) / 3
        const centroidY = (v0.y + v1.y + v2.y) / 3

        ctx.fillStyle = dot > 0.6 ? '#061109' : '#fffdf7'
        ctx.font = 'bold 11.5px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const num = (faceIdx + 1).toString()
        ctx.fillText(num, centroidX, centroidY)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastMousePos.current.x
    const dy = e.clientY - lastMousePos.current.y
    rot.current.y += dx * 0.015
    rot.current.x -= dy * 0.015
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const [displayScore, setDisplayScore] = useState<number>(20)

  const handleRollDice = () => {
    if (isSpinning) return
    setIsSpinning(true)
    vel.current.x = (Math.random() - 0.5) * 0.55 + 0.35
    vel.current.y = (Math.random() - 0.5) * 0.55 + 0.35

    const finalRoll = Math.floor(Math.random() * 20) + 1

    // Rapid count-up effect during spin
    const counterInterval = setInterval(() => {
      setDisplayScore(Math.floor(Math.random() * 20) + 1)
    }, 60)

    setTimeout(() => {
      clearInterval(counterInterval)
      setDisplayScore(finalRoll)
      setCurrentScore(finalRoll)
      setIsSpinning(false)
      onRollComplete?.(finalRoll)
    }, 1200)
  }

  const getFlavorTier = (score: number) => {
    if (score === 20) return 'Table Flavor: Natural 20 (Ceremonial)'
    if (score >= 15) return 'Table Flavor: High Roll'
    if (score >= 10) return 'Table Flavor: Neutral Roll'
    return 'Table Flavor: Low Roll'
  }

  return (
    <div className="plaque-3d p-4 rounded-xl space-y-3 relative overflow-hidden border border-[var(--border)]">
      {/* Brass corner brackets */}
      <div className="corner-bracket-tl" />
      <div className="corner-bracket-tr" />
      <div className="corner-bracket-bl" />
      <div className="corner-bracket-br" />

      {/* Header with Title and Circuit Stamp */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
        <span className="text-xs font-sans font-bold text-[var(--brass-light)] flex items-center gap-1.5 tracking-wide">
          <Dices className="w-3.5 h-3.5 text-[var(--brass-light)]" />
          <span>Ceremonial Tabletop D20</span>
        </span>
        <span className="font-mono text-[10px] text-[var(--muted)] bg-[var(--felt-0)] px-2 py-0.5 rounded border border-[var(--border)]">
          Flavor Only
        </span>
      </div>

      {/* 3D Sunken Felt Dice Tray with Warm Gold Glow */}
      <div className="dice-tray-3d rounded-xl p-3 flex flex-col items-center relative group overflow-hidden">
        
        {/* Subtle Gold/Green Radial Spotlight behind the die */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(224,172,66,0.18)_0%,rgba(20,50,30,0.6)_55%,transparent_80%)] pointer-events-none" />

        <div
          className="relative cursor-grab active:cursor-grabbing select-none z-10"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            style={{ width: 165, height: 165 }}
            className={`mx-auto block drop-shadow-[0_12px_22px_rgba(0,0,0,0.9)] ${isSpinning ? 'scale-105' : 'scale-100'} transition-transform duration-200`}
            title="Drag to spin 3D D20 tournament die in real-time"
          />

          {/* Dynamic 3D Cast Shadow */}
          <div className="w-28 h-4 bg-black/80 rounded-full blur-[3px] mx-auto -mt-3 pointer-events-none transition-all duration-150" />
        </div>

        {/* Hover Hint */}
        <div className="text-[11px] font-sans text-[var(--muted)] pt-1 flex items-center gap-1 z-10">
          <span>Click & drag to spin 3D table die</span>
        </div>
      </div>

      {/* Ceremonial Atmosphere Banner */}
      <div className="p-2.5 rounded-lg bg-[var(--felt-0)] border border-[var(--border)] flex items-center justify-between text-xs">
        <div className="space-y-0.5 min-w-0">
          <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">
            Ceremonial Roll
          </div>
          <div className="font-sans font-semibold text-[var(--parchment-bright)] truncate text-[11px]">
            {getFlavorTier(displayScore)}
          </div>
        </div>

        <div className="seal-upheld-3d px-2.5 py-1 rounded-md font-mono font-bold text-xs flex items-center gap-1 shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-[var(--felt-0)] opacity-75">D20:</span>
          <span className="text-sm font-black">{displayScore}</span>
        </div>
      </div>

      {/* Explicit Rules Integrity Disclaimer */}
      <p className="text-[10px] text-[var(--muted)] italic font-sans leading-tight px-1">
        * Tabletop Flavor: Official rulings are 100% deterministic & grounded in Sanity CR lineage. Random rolls have zero influence on verdicts.
      </p>

      {/* Outline / Cream Text Action Button */}
      <button
        onClick={handleRollDice}
        disabled={isSpinning}
        className="w-full py-2 px-3 rounded-lg text-xs font-sans font-medium text-[var(--parchment)] bg-[var(--felt-0)]/70 hover:bg-[var(--felt-2)] border border-[var(--border)] hover:border-[var(--brass-dim)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        title="Roll ceremonial table die [R]"
      >
        <RotateCw className={`w-3.5 h-3.5 text-[var(--brass-light)] ${isSpinning ? 'animate-spin' : ''}`} />
        <span>{isSpinning ? 'Rolling Die...' : 'Roll Table Die (Flavor)'}</span>
        <kbd className="hidden sm:inline font-mono text-[10px] text-[var(--muted)] bg-[var(--felt-1)] px-1 rounded border border-[var(--border)]">R</kbd>
      </button>

    </div>
  )
}
