'use client'

import React, { useRef, useState, useCallback } from 'react'

interface ThreeDTiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number // degrees, default 8
  glareOpacity?: number // max glare opacity, default 0.18
}

export function ThreeDTiltCard({
  children,
  className = '',
  maxTilt = 8,
  glareOpacity = 0.18,
}: ThreeDTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      const tiltX = (y - 0.5) * -maxTilt
      const tiltY = (x - 0.5) * maxTilt

      setTilt({ x: tiltX, y: tiltY })
      setGlare({ x: x * 100, y: y * 100, opacity: glareOpacity })
    },
    [maxTilt, glareOpacity]
  )

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }

  // Dynamic shadow offset shifting opposite to tilt direction
  const shadowX = -tilt.y * 2.5
  const shadowY = tilt.x * 2.5 + 26
  const shadowSpread = isHovered ? '50px -10px' : '36px -12px'

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
      }}
      className={`relative ${className}`}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(14px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          boxShadow: `${shadowX}px ${shadowY}px ${shadowSpread} rgba(0, 0, 0, ${isHovered ? 0.9 : 0.75})`,
          transition: isHovered ? 'transform 0.08s ease-out, box-shadow 0.1s ease-out' : 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative rounded-xl"
      >
        {children}

        {/* Dynamic Specular Brass Glare Layer */}
        <div
          style={{
            background: `radial-gradient(circle 400px at ${glare.x}% ${glare.y}%, rgba(253, 232, 167, ${glare.opacity}) 0%, rgba(224, 172, 66, ${glare.opacity * 0.4}) 35%, transparent 75%)`,
            pointerEvents: 'none',
          }}
          className="absolute inset-0 rounded-xl transition-opacity duration-200"
        />
      </div>
    </div>
  )
}
