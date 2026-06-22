'use client'

import { useEffect, useRef } from 'react'

/**
 * Unified Monochrome Flow Background — SINGLE purple tone, no patchy colors
 * 
 * Only for Hero section. Other sections stay clean.
 */
export function FlowMesh({
  className = '',
  intensity = 1,
}: {
  className?: string
  intensity?: number // 0.3 ~ 1.5
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    let w = 0, h = 0
    const time = { value: 0 }

    // MONOCHROME purple palette only — no cyan, pink, crimson mess
    const nodes = Array.from({ length: 5 }, (_, i) => ({
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 0.22 + Math.random() * 0.18,
      // All purple/violet shades — unified tone
      hue: 260 + (Math.random() - 0.5) * 30, // 245-275 (purple range)
      sat: 70 + Math.random() * 20,           // 70-90%
      light: 55 + Math.random() * 15,         // 55-70%
      phase: (i / 5) * Math.PI * 2,
    }))

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      nodes.forEach((n, i) => {
        const angle = (i / nodes.length) * Math.PI * 2 + Math.random() * 0.5
        n.x = w * (0.5 + Math.cos(angle) * 0.25)
        n.y = h * (0.5 + Math.sin(angle) * 0.25)
      })
    }

    function draw() {
      time.value += 0.006
      const t = time.value
      const mult = intensity

      // Clear with transparent — let page background show through
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]

        // Slow organic drift
        n.x += n.vx + Math.sin(t * 0.4 + n.phase) * 0.6
        n.y += n.vy + Math.cos(t * 0.3 + n.phase * 1.3) * 0.4

        // Bounce soft
        const margin = w * 0.12
        if (n.x < -margin) n.vx = Math.abs(n.vx) * 0.7
        if (n.x > w + margin) n.vx = -Math.abs(n.vx) * 0.7
        if (n.y < -margin) n.vy = Math.abs(n.vy) * 0.7
        if (n.y > h + margin) n.vy = -Math.abs(n.vy) * 0.7

        // Breathing radius
        const pulseR = n.radius * (1 + Math.sin(t * 0.6 + n.phase) * 0.12)
        const maxR = Math.max(w, h) * pulseR

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, maxR)
        // HSL to RGBA for smooth purple gradients
        const alpha0 = 0.28 * mult
        const alpha1 = 0.14 * mult
        const alpha2 = 0.04 * mult
        grad.addColorStop(0, `hsla(${n.hue}, ${n.sat}%, ${n.light}%, ${alpha0})`)
        grad.addColorStop(0.3, `hsla(${n.hue}, ${n.sat}%, ${n.light - 8}%, ${alpha1})`)
        grad.addColorStop(0.6, `hsla(${n.hue}, ${n.sat - 10}%, ${n.light - 15}%, ${alpha2})`)
        grad.addColorStop(1, `hsla(${n.hue}, ${n.sat}%, ${n.light}%, 0)`)

        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      ctx.globalCompositeOperation = 'source-over'

      // Subtle floating particles — purple dots only
      for (let p = 0; p < 20; p++) {
        const seed = p * 9973 + 7919
        const px = ((seed * 0.618033988749895) % 1) * w + Math.sin(t * 0.3 + seed) * 35
        const py = ((seed * 0.75) % 1) * h + Math.cos(t * 0.25 + seed * 0.7) * 25
        const size = 1 + (seed % 2)
        const twinkle = 0.25 + Math.sin(t * 1.5 + seed * 0.5) * 0.2

        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${twinkle * mult})`
        ctx.fill()
      }

      // Single slow-moving light beam — purple tinted
      const beamX = ((t * 35) % (w + 500)) - 250
      const beamGrad = ctx.createLinearGradient(beamX, 0, beamX + 250, h)
      beamGrad.addColorStop(0, 'rgba(139,92,246,0)')
      beamGrad.addColorStop(0.5, `rgba(139,92,246,${0.05 * mult})`)
      beamGrad.addColorStop(1, 'rgba(139,92,246,0)')
      ctx.fillStyle = beamGrad
      ctx.fillRect(0, 0, w, h)

      animId = requestAnimationFrame(draw)
    }

    function onResize() { resize() }
    resize()
    window.addEventListener('resize', onResize)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
