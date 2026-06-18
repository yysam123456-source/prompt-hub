'use client'

import { cn } from '@/lib/utils'

interface AnimatedBeamProps {
  className?: string
  beamColor?: string
  beamCount?: number
}

export default function AnimatedBeam({
  className = '',
  beamColor = 'from-purple-500/40 via-pink-500/30 to-transparent',
  beamCount = 6,
}: AnimatedBeamProps) {
  const beams = Array.from({ length: beamCount }, (_, i) => ({
    id: i,
    left: `${10 + (i * 80) / beamCount}%`,
    delay: `${i * 1.2}s`,
    duration: `${6 + Math.random() * 4}s`,
    height: `${60 + Math.random() * 40}%`,
  }))

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {beams.map((beam) => (
        <div
          key={beam.id}
          className={cn(
            'absolute top-0 w-px bg-gradient-to-b',
            beamColor
          )}
          style={{
            left: beam.left,
            height: beam.height,
            animation: `meteor ${beam.duration} linear ${beam.delay} infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  )
}
