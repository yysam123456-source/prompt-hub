'use client'

import { useEffect, useRef } from 'react'

// ===== Flowing Gradient Mesh Background =====
// Canvas 绘制，多个颜色节点缓慢漂移，用径向渐变混合
// 效果：丝滑流动的渐变背景，无硬边，无补丁感
export function FlowMesh({
  className = '',
  colors = [
    [168, 85, 247],   // purple
    [6, 182, 212],     // cyan
    [236, 72, 153],    // pink
    [99, 102, 241],    // indigo
    [16, 185, 129],    // emerald
  ],
  speed = 0.3,
}: {
  className?: string
  colors?: number[][]
  speed?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!

    let animId: number
    let w = 0, h = 0

    // Each color node: position + velocity
    const nodes = colors.map((c, i) => ({
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: 0.35 + Math.random() * 0.25,
      color: c,
      phase: Math.random() * Math.PI * 2,
    }))

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas!.clientWidth
      h = canvas!.clientHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Init positions
      nodes.forEach((n, i) => {
        const angle = (i / nodes.length) * Math.PI * 2
        n.x = w / 2 + Math.cos(angle) * w * 0.25
        n.y = h / 2 + Math.sin(angle) * h * 0.25
      })
    }

    function draw(t: number) {
      // Clear with dark base
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, w, h)

      // Draw each node as a radial gradient
      nodes.forEach(n => {
        const tSec = t * 0.001
        n.x += n.vx + Math.sin(tSec * 0.3 + n.phase) * 0.15
        n.y += n.vy + Math.cos(tSec * 0.2 + n.phase) * 0.15

        // Bounce off edges
        const margin = w * 0.1
        if (n.x < -margin) n.vx = Math.abs(n.vx)
        if (n.x > w + margin) n.vx = -Math.abs(n.vx)
        if (n.y < -margin) n.vy = Math.abs(n.vy)
        if (n.y > h + margin) n.vy = -Math.abs(n.vy)

        const radius = Math.min(w, h) * n.r
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius)
        grad.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},0.18)`)
        grad.addColorStop(0.5, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},0.06)`)
        grad.addColorStop(1, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},0)`)

        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      })

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
  }, [colors, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
