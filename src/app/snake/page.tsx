'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Trophy, RotateCcw, Play, Pause, Volume2, VolumeX, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ShieldAlert, Sparkles, Zap } from 'lucide-react'

// Game Constants
const GRID_SIZE = 20
const INITIAL_SPEED = 120 // ms per tick
const SPEED_INCREMENT = 2 // speed up every 5 foods
const POWER_UP_CHANCE = 0.25 // 25% chance when food is eaten

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }
type PowerUpType = 'SPEED' | 'SLOW' | 'DOUBLE' | 'GHOST'

interface PowerUp {
  position: Position
  type: PowerUpType
  duration: number
}

interface Particle {
  x: number
  y: number
  color: string
  size: number
  vx: number
  vy: number
  alpha: number
}

export function SnakeGame() {
  // Canvas & Game State
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  
  // Lazy initial state for highScore to avoid setState inside effect
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('DEVFORGE_SNAKE_HIGH_SCORE')
      if (saved) {
        const val = parseInt(saved, 10)
        if (!isNaN(val)) return val
      }
    } catch {}
    return 0
  })

  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activePowerUp, setActivePowerUp] = useState<PowerUpType | null>(null)
  const [powerUpTimer, setPowerUpTimer] = useState(0)

  // Snake & Board Refs (for high-frequency game loop without re-render lag)
  const snakeRef = useRef<Position[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ])
  const directionRef = useRef<Direction>('UP')
  const nextDirectionRef = useRef<Direction>('UP')
  const foodRef = useRef<Position>({ x: 5, y: 5 })
  const powerUpRef = useRef<PowerUp | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const speedRef = useRef<number>(INITIAL_SPEED)
  const scoreRef = useRef<number>(0)
  const foodEatenRef = useRef<number>(0)
  const isGhostRef = useRef<boolean>(false)
  const activePowerUpTypeRef = useRef<PowerUpType | null>(null)
  const powerUpTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sound effects using Web Audio API
  const playSound = useCallback((type: 'eat' | 'die' | 'powerup' | 'move') => {
    if (!soundEnabled) return
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      const now = ctx.currentTime

      if (type === 'eat') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(300, now)
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1)
        gain.gain.setValueAtTime(0.3, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
        osc.start(now)
        osc.stop(now + 0.15)
      } else if (type === 'powerup') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(400, now)
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25)
        gain.gain.setValueAtTime(0.4, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
      } else if (type === 'die') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(250, now)
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.4)
        gain.gain.setValueAtTime(0.5, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
        osc.start(now)
        osc.stop(now + 0.4)
      }
    } catch {}
  }, [soundEnabled])

  // Spawn food at random empty location
  const spawnFood = useCallback(() => {
    let newFood: Position
    let collision: boolean
    do {
      collision = false
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
      for (const segment of snakeRef.current) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          collision = true
          break
        }
      }
    } while (collision)
    foodRef.current = newFood

    if (!powerUpRef.current && Math.random() < POWER_UP_CHANCE) {
      const types: PowerUpType[] = ['SPEED', 'SLOW', 'DOUBLE', 'GHOST']
      const chosenType = types[Math.floor(Math.random() * types.length)]
      let pPos: Position
      do {
        collision = false
        pPos = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        }
        if (pPos.x === newFood.x && pPos.y === newFood.y) collision = true
        for (const segment of snakeRef.current) {
          if (segment.x === pPos.x && segment.y === pPos.y) {
            collision = true
            break
          }
        }
      } while (collision)

      powerUpRef.current = {
        position: pPos,
        type: chosenType,
        duration: 6000,
      }
    }
  }, [])

  // Create particles on eat/powerup
  const createParticles = (x: number, y: number, color: string, count = 12) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cellSize = canvas.width / GRID_SIZE
    const px = (x + 0.5) * cellSize
    const py = (y + 0.5) * cellSize

    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 4 + 2
      newParticles.push({
        x: px,
        y: py,
        color,
        size: Math.random() * 4 + 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
      })
    }
    particlesRef.current.push(...newParticles)
  }

  // Handle Power-Up Activation
  const applyPowerUp = useCallback((type: PowerUpType) => {
    playSound('powerup')
    setActivePowerUp(type)
    activePowerUpTypeRef.current = type

    if (powerUpTimeoutRef.current) clearTimeout(powerUpTimeoutRef.current)

    if (type === 'GHOST') {
      isGhostRef.current = true
    } else if (type === 'SPEED') {
      speedRef.current = Math.max(50, speedRef.current * 0.7)
    } else if (type === 'SLOW') {
      speedRef.current = speedRef.current * 1.5
    }

    setPowerUpTimer(6)
    const interval = setInterval(() => {
      setPowerUpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    powerUpTimeoutRef.current = setTimeout(() => {
      isGhostRef.current = false
      setActivePowerUp(null)
      activePowerUpTypeRef.current = null
      const baseSpeed = difficulty === 'EASY' ? 150 : difficulty === 'MEDIUM' ? 120 : 90
      speedRef.current = Math.max(50, baseSpeed - Math.floor(foodEatenRef.current / 5) * SPEED_INCREMENT)
    }, 6000)
  }, [difficulty, playSound])

  // Start / Reset Game
  const startGame = useCallback(() => {
    const startSpeed = difficulty === 'EASY' ? 150 : difficulty === 'MEDIUM' ? 120 : 90
    speedRef.current = startSpeed
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]
    directionRef.current = 'UP'
    nextDirectionRef.current = 'UP'
    scoreRef.current = 0
    foodEatenRef.current = 0
    setScore(0)
    setGameOver(false)
    setIsPaused(false)
    setIsPlaying(true)
    isGhostRef.current = false
    setActivePowerUp(null)
    activePowerUpTypeRef.current = null
    powerUpRef.current = null
    particlesRef.current = []
    if (powerUpTimeoutRef.current) clearTimeout(powerUpTimeoutRef.current)
    spawnFood()
  }, [difficulty, spawnFood])

  // Game Loop Tick
  const updateGame = useCallback(() => {
    if (!isPlaying || isPaused || gameOver) return

    directionRef.current = nextDirectionRef.current
    const head = { ...snakeRef.current[0] }

    switch (directionRef.current) {
      case 'UP':
        head.y -= 1
        break
      case 'DOWN':
        head.y += 1
        break
      case 'LEFT':
        head.x -= 1
        break
      case 'RIGHT':
        head.x += 1
        break
    }

    // Wall Collision Check
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      if (isGhostRef.current) {
        if (head.x < 0) head.x = GRID_SIZE - 1
        if (head.x >= GRID_SIZE) head.x = 0
        if (head.y < 0) head.y = GRID_SIZE - 1
        if (head.y >= GRID_SIZE) head.y = 0
      } else {
        playSound('die')
        setGameOver(true)
        setIsPlaying(false)
        return
      }
    }

    // Self Collision Check
    if (!isGhostRef.current) {
      for (const segment of snakeRef.current) {
        if (head.x === segment.x && head.y === segment.y) {
          playSound('die')
          setGameOver(true)
          setIsPlaying(false)
          return
        }
      }
    }

    const newSnake = [head, ...snakeRef.current]

    // Check Food Collision
    const food = foodRef.current
    if (head.x === food.x && head.y === food.y) {
      playSound('eat')
      const multiplier = activePowerUpTypeRef.current === 'DOUBLE' ? 2 : 1
      const points = (difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 20 : 30) * multiplier
      scoreRef.current += points
      setScore(scoreRef.current)

      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current)
        try {
          localStorage.setItem('DEVFORGE_SNAKE_HIGH_SCORE', scoreRef.current.toString())
        } catch {}
      }

      foodEatenRef.current += 1
      createParticles(food.x, food.y, '#10b981', 16)
      spawnFood()

      if (foodEatenRef.current % 5 === 0 && activePowerUpTypeRef.current !== 'SPEED') {
        speedRef.current = Math.max(50, speedRef.current - SPEED_INCREMENT)
      }
    } else {
      newSnake.pop()
    }

    // Check Power-Up Collision
    const powerUp = powerUpRef.current
    if (powerUp && head.x === powerUp.position.x && head.y === powerUp.position.y) {
      applyPowerUp(powerUp.type)
      createParticles(powerUp.position.x, powerUp.position.y, '#3b82f6', 20)
      powerUpRef.current = null
    }

    snakeRef.current = newSnake
  }, [isPlaying, isPaused, gameOver, difficulty, highScore, spawnFood, playSound, applyPowerUp])

  // Main game tick effect
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return
    const interval = setInterval(updateGame, speedRef.current)
    return () => clearInterval(interval)
  }, [isPlaying, isPaused, gameOver, updateGame])

  // Canvas Render Loop & Animation Frame for Smooth Particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const render = () => {
      const width = canvas.width
      const height = canvas.height
      const cellSize = width / GRID_SIZE

      ctx.fillStyle = '#090d16'
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = '#131c2e'
      ctx.lineWidth = 1
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath()
        ctx.moveTo(i * cellSize, 0)
        ctx.lineTo(i * cellSize, height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, i * cellSize)
        ctx.lineTo(width, i * cellSize)
        ctx.stroke()
      }

      const food = foodRef.current
      const pulse = Math.sin(Date.now() / 150) * 2 + 4
      ctx.shadowColor = '#ef4444'
      ctx.shadowBlur = 12
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(
        (food.x + 0.5) * cellSize,
        (food.y + 0.5) * cellSize,
        cellSize * 0.35 + pulse * 0.2,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.shadowBlur = 0

      const powerUp = powerUpRef.current
      if (powerUp) {
        const pColor =
          powerUp.type === 'SPEED'
            ? '#eab308'
            : powerUp.type === 'SLOW'
            ? '#06b6d4'
            : powerUp.type === 'DOUBLE'
            ? '#ec4899'
            : '#8b5cf6'

        ctx.shadowColor = pColor
        ctx.shadowBlur = 15
        ctx.fillStyle = pColor
        ctx.beginPath();
        (ctx as CanvasRenderingContext2D).roundRect(
          powerUp.position.x * cellSize + 2,
          powerUp.position.y * cellSize + 2,
          cellSize - 4,
          cellSize - 4,
          6
        )
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 12px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const symbol =
          powerUp.type === 'SPEED'
            ? '⚡'
            : powerUp.type === 'SLOW'
            ? '❄'
            : powerUp.type === 'DOUBLE'
            ? '2X'
            : '👻'
        ctx.fillText(symbol, (powerUp.position.x + 0.5) * cellSize, (powerUp.position.y + 0.5) * cellSize)
      }

      const snake = snakeRef.current
      snake.forEach((segment, idx) => {
        const isHead = idx === 0

        if (isGhostRef.current) {
          ctx.shadowColor = '#8b5cf6'
          ctx.shadowBlur = 10
          ctx.fillStyle = idx % 2 === 0 ? '#a78bfa' : '#7c3aed'
        } else {
          ctx.shadowColor = isHead ? '#10b981' : '#059669'
          ctx.shadowBlur = isHead ? 10 : 4
          ctx.fillStyle = isHead ? '#34d399' : idx % 2 === 0 ? '#10b981' : '#059669'
        }

        const rx = segment.x * cellSize + 2
        const ry = segment.y * cellSize + 2
        const rSize = cellSize - 4

        ctx.beginPath()
        if (typeof (ctx as CanvasRenderingContext2D).roundRect === 'function') {
          ;(ctx as CanvasRenderingContext2D).roundRect(rx, ry, rSize, rSize, isHead ? 8 : 4)
        } else {
          ctx.rect(rx, ry, rSize, rSize)
        }
        ctx.fill()
        ctx.shadowBlur = 0

        if (isHead) {
          ctx.fillStyle = '#090d16'
          const eyeSize = 3
          let ex1 = 0, ey1 = 0, ex2 = 0, ey2 = 0
          const cx = (segment.x + 0.5) * cellSize
          const cy = (segment.y + 0.5) * cellSize

          switch (directionRef.current) {
            case 'UP':
              ex1 = cx - 4; ey1 = cy - 4
              ex2 = cx + 4; ey2 = cy - 4
              break
            case 'DOWN':
              ex1 = cx - 4; ey1 = cy + 4
              ex2 = cx + 4; ey2 = cy + 4
              break
            case 'LEFT':
              ex1 = cx - 4; ey1 = cy - 4
              ex2 = cx - 4; ey2 = cy + 4
              break
            case 'RIGHT':
              ex1 = cx + 4; ey1 = cy - 4
              ex2 = cx + 4; ey2 = cy + 4
              break
          }

          ctx.beginPath()
          ctx.arc(ex1, ey1, eyeSize, 0, Math.PI * 2)
          ctx.arc(ex2, ey2, eyeSize, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.03

        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentDir = directionRef.current

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') nextDirectionRef.current = 'UP'
          e.preventDefault()
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') nextDirectionRef.current = 'DOWN'
          e.preventDefault()
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') nextDirectionRef.current = 'LEFT'
          e.preventDefault()
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') nextDirectionRef.current = 'RIGHT'
          e.preventDefault()
          break
        case ' ':
          if (!isPlaying && !gameOver) startGame()
          else if (isPlaying) setIsPaused((prev) => !prev)
          e.preventDefault()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, gameOver, startGame])

  const handleDirectionClick = (dir: Direction) => {
    const currentDir = directionRef.current
    if (
      (dir === 'UP' && currentDir !== 'DOWN') ||
      (dir === 'DOWN' && currentDir !== 'UP') ||
      (dir === 'LEFT' && currentDir !== 'RIGHT') ||
      (dir === 'RIGHT' && currentDir !== 'LEFT')
    ) {
      nextDirectionRef.current = dir
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              DEVFORGE SNAKE X
            </h1>
            <p className="text-xs text-slate-400">Next-Gen Arcade Snake Game · Power-Ups & Neon FX</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition hover:bg-slate-800"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start justify-center gap-6">
        
        {/* Left Side: Scorecard & Controls Settings */}
        <div className="w-full md:w-72 flex flex-col gap-4">
          
          {/* Score Card */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Score</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">{score}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">High Score</span>
              </div>
              <span className="text-xl font-bold text-amber-400 font-mono">{highScore}</span>
            </div>
          </div>

          {/* Active Power-Up Banner */}
          {activePowerUp && (
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-cyan-300 uppercase">{activePowerUp} ACTIVE</div>
                  <div className="text-xs text-slate-400">Effect expires in {powerUpTimer}s</div>
                </div>
              </div>
              <span className="text-lg font-black text-cyan-400">{powerUpTimer}s</span>
            </div>
          )}

          {/* Difficulty Selector */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Difficulty Mode</span>
            <div className="grid grid-cols-3 gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
                <button
                  key={diff}
                  disabled={isPlaying}
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    difficulty === diff
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-2">
            {!isPlaying ? (
              <button
                onClick={startGame}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition transform active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                {gameOver ? 'PLAY AGAIN' : 'START GAME'}
              </button>
            ) : (
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition transform active:scale-95"
              >
                {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                {isPaused ? 'RESUME' : 'PAUSE'}
              </button>
            )}

            {isPlaying && (
              <button
                onClick={startGame}
                className="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" /> Restart
              </button>
            )}
          </div>

        </div>

        {/* Center: Canvas Arena */}
        <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col items-center">
          
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="rounded-2xl border border-slate-800 shadow-inner bg-slate-950 block max-w-full h-auto aspect-square"
            />

            {/* Game Over / Pause Overlays */}
            {gameOver && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-4 p-6 animate-fade-in">
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400">
                  <ShieldAlert className="w-10 h-10 animate-bounce" />
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-black text-red-400 tracking-wider">GAME OVER</h2>
                  <p className="text-sm text-slate-300 mt-1">Final Score: <span className="font-bold text-emerald-400 font-mono text-lg">{score}</span></p>
                </div>
                <button
                  onClick={startGame}
                  className="mt-2 py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition transform active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" /> TRY AGAIN
                </button>
              </div>
            )}

            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="text-2xl font-black text-amber-400 tracking-widest uppercase animate-pulse">PAUSED</div>
                <p className="text-xs text-slate-400">Press Space or Resume to continue</p>
              </div>
            )}

            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-black text-emerald-400 tracking-wider">READY TO PLAY?</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">Use Arrow Keys or W/A/S/D to guide the snake. Collect food & power-ups!</p>
                </div>
                <button
                  onClick={startGame}
                  className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition transform active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" /> START GAME
                </button>
              </div>
            )}
          </div>

          {/* On-Screen Touch D-Pad for Mobile / Mouse players */}
          <div className="grid grid-cols-3 gap-2 mt-4 md:hidden w-full max-w-[240px]">
            <div />
            <button
              onClick={() => handleDirectionClick('UP')}
              className="p-4 bg-slate-800 active:bg-emerald-500/30 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 transition"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
            <div />
            <button
              onClick={() => handleDirectionClick('LEFT')}
              className="p-4 bg-slate-800 active:bg-emerald-500/30 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleDirectionClick('DOWN')}
              className="p-4 bg-slate-800 active:bg-emerald-500/30 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 transition"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleDirectionClick('RIGHT')}
              className="p-4 bg-slate-800 active:bg-emerald-500/30 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 transition"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

        </div>

      </main>

      {/* Footer Instructions */}
      <footer className="w-full max-w-4xl text-center text-xs text-slate-500 border-t border-slate-800 pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Controls: Arrow Keys / WASD · Pause: Spacebar</span>
        <span>Built with React 19 & HTML5 Canvas</span>
      </footer>

    </div>
  )
}

export default SnakeGame
