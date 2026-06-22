'use client'

import { useEffect, useRef } from 'react'

// ===== Aurora Flow Background =====
// 高可见度极光流动效果 — 多层渐变 + 噪点 + 光束扫过
export function FlowMesh({
  className = '',
  variant = 'full', // full | subtle | medium | warm
}: {
  className?: string
  variant?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let animId: number
    let w = 0, h = 0
    const time = { value: 0 }

    // Color palettes per variant
    const palettes = {
      full: [
        [138, 43, 226],    // blue-violet
        [0, 191, 255],     // deep sky blue
        [220, 20, 60],     // crimson
        [75, 0, 130],      // indigo
        [255, 20, 147],    // deep pink
      ],
      subtle: [
        [88, 28, 135],     // purple-900
        [30, 64, 175],     // blue-800
        [126, 34, 206],    // violet-700
      ],
      medium: [
        [124, 58, 237],    // violet-600
        [6, 182, 212],     // cyan-500
        [236, 72, 153],    // pink-500
        [99, 102, 241],    // indigo-500
      ],
      warm: [
        [168, 85, 247],    // purple-500
        [236, 72, 153],    // pink-500
        [245, 158, 11],    // amber-500
      ],
    }
    const colors = palettes[variant as keyof typeof palettes] || palettes.full

    // Blobs with position and movement
    const blobs = colors.map((c, i) => ({
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 0.25 + Math.random() * 0.2,
      color: c,
      phase: (i / colors.length) * Math.PI * 2,
    }))

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Init positions spread across canvas
      blobs.forEach((b, i) => {
        const angle = (i / blobs.length) * Math.PI * 2 + Math.random() * 0.5
        const dist = 0.2 + Math.random() * 0.3
        b.x = w * (0.5 + Math.cos(angle) * dist)
        b.y = h * (0.5 + Math.sin(angle) * dist)
      })
    }

    function draw() {
      time.value += 0.008
      const t = time.value

      // Dark base fill
      ctx.fillStyle = '#090916'
      ctx.fillRect(0, 0, w, h)

      // Draw each blob as a large soft radial gradient
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i]

        // Organic floating motion
        b.x += b.vx + Math.sin(t * 0.5 + b.phase) * 0.8
        b.y += b.vy + Math.cos(t * 0.35 + b.phase * 1.5) * 0.6

        // Soft bounce at edges
        const margin = w * 0.15
        if (b.x < -margin) b.vx = Math.abs(b.vx) * 0.8
        if (b.x > w + margin) b.vx = -Math.abs(b.vx) * 0.8
        if (b.y < -margin) b.vy = Math.abs(b.vy) * 0.8
        if (b.y > h + margin) b.vy = -Math.abs(b.vy) * 0.8

        // Pulsing radius
        const pulseR = b.radius * (1 + Math.sin(t * 0.8 + b.phase) * 0.15)
        const maxR = Math.max(w, h) * pulseR

        // Create radial gradient — HIGH visibility
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, maxR)
        const [cr, cg, cb] = b.color

        // Much stronger alpha for visibility!
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},0.35)`)
        grad.addColorStop(0.25, `rgba(${cr},${cg},${cb},0.18)`)
        grad.addColorStop(0.55, `rgba(${cr},${cg},${cb},0.06)`)
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)

        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      ctx.globalCompositeOperation = 'source-over'

      // Animated light beam sweeping across
      const beamX = ((t * 50) % (w + 400)) - 200
      const beamGrad = ctx.createLinearGradient(beamX, 0, beamX + 200, h)
      beamGrad.addColorStop(0, 'rgba(139,92,246,0)')
      beamGrad.addColorStop(0.5, 'rgba(139,92,246,0.04)')
      beamGrad.addColorStop(1, 'rgba(139,92,246,0)')
      ctx.fillStyle = beamGrad
      ctx.fillRect(0, 0, w, h)

      // Floating particles (bright dots)
      const particleCount = variant === 'full' ? 30 : variant === 'medium' ? 18 : 10
      for (let p = 0; p < particleCount; p++) {
        const seed = p * 9973 + 7919
        const px = ((seed * 0.618033988749895) % 1) * w + Math.sin(t * 0.4 + seed) * 40
        const py = ((seed * 0.75) % 1) * h + Math.cos(t * 0.3 + seed * 0.7) * 30
        const pSize = 1 + (seed % 3)
        const pAlpha = 0.3 + Math.sin(t * 2 + seed) * 0.25
        const pc = colors[p % colors.length]
        
        ctx.beginPath()
        ctx.arc(px, py, pSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${pc[0]},${pc[1]},${pc[2]},${pAlpha})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    function onResize() {
      resize()
    }

    resize()
    window.addEventListener('resize', onResize)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
