'use client'

import { useEffect, useRef, useState } from 'react'

// ===== Neon Glow Text =====
// 多层 text-shadow 霓虹灯效果 + 闪烁动画
export function NeonText({
  children,
  color = 'purple',
  size = 'text-5xl',
  className = '',
}: {
  children: React.ReactNode
  color?: 'purple' | 'cyan' | 'pink' | 'green' | 'rainbow'
  size?: string
  className?: string
}) {
  const colorMap: Record<string, string> = {
    purple: '0 0 7px #a855f7, 0 0 10px #a855f7, 0 0 21px #a855f7, 0 0 42px #7c3aed, 0 0 82px #7c3aed, 0 0 92px #7c3aed',
    cyan: '0 0 7px #06b6d4, 0 0 10px #06b6d4, 0 0 21px #06b6d4, 0 0 42px #0891b2, 0 0 82px #0891b2, 0 0 92px #0891b2',
    pink: '0 0 7px #ec4899, 0 0 10px #ec4899, 0 0 21px #ec4899, 0 0 42px #db2777, 0 0 82px #db2777, 0 0 92px #db2777',
    green: '0 0 7px #10b981, 0 0 10px #10b981, 0 0 21px #10b981, 0 0 42px #059669, 0 0 82px #059669, 0 0 92px #059669',
    rainbow: '0 0 7px #a855f7, 0 0 10px #06b6d4, 0 0 21px #ec4899, 0 0 42px #10b981, 0 0 82px #eab308, 0 0 92px #f97316',
  }

  const gradientMap: Record<string, string> = {
    purple: 'from-purple-400 via-purple-300 to-purple-500',
    cyan: 'from-cyan-400 via-cyan-300 to-cyan-500',
    pink: 'from-pink-400 via-pink-300 to-pink-500',
    green: 'from-emerald-400 via-emerald-300 to-emerald-500',
    rainbow: 'from-purple-400 via-cyan-400 to-pink-400',
  }

  return (
    <span
      className={`inline-block font-bold ${size} ${className} neon-flicker`}
      style={{
        textShadow: colorMap[color],
        color: 'white',
      }}
    >
      <span
        className={`bg-gradient-to-r ${gradientMap[color]} bg-clip-text text-transparent`}
        style={{ textShadow: 'none' }}
      >
        {children}
      </span>
    </span>
  )
}

// ===== Glitch Text =====
// 红蓝通道偏移 + 抖动故障效果
export function GlitchText({
  children,
  className = '',
}: {
  children: string
  className?: string
}) {
  return (
    <span className={`glitch-text relative inline-block ${className}`} data-text={children}>
      {children}
      <style>{`
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .glitch-text::before {
          color: #0ff;
          z-index: -1;
          animation: glitch-before 3s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          color: #f0f;
          z-index: -2;
          animation: glitch-after 2s infinite linear alternate-reverse;
        }
        @keyframes glitch-before {
          0% { clip-path: inset(0 0 85% 0); transform: translate(-3px, -2px); }
          5% { clip-path: inset(15% 0 65% 0); transform: translate(3px, 1px); }
          10% { clip-path: inset(50% 0 20% 0); transform: translate(-2px, 3px); }
          15% { clip-path: inset(0 0 85% 0); transform: translate(0); }
          100% { clip-path: inset(0 0 85% 0); transform: translate(0); }
        }
        @keyframes glitch-after {
          0% { clip-path: inset(85% 0 0 0); transform: translate(3px, 2px); }
          5% { clip-path: inset(20% 0 50% 0); transform: translate(-3px, -1px); }
          10% { clip-path: inset(65% 0 5% 0); transform: translate(2px, -3px); }
          15% { clip-path: inset(85% 0 0 0); transform: translate(0); }
          100% { clip-path: inset(85% 0 0 0); transform: translate(0); }
        }
      `}</style>
    </span>
  )
}

// ===== Typewriter + Delete Loop =====
export function TypewriterLoop({
  texts,
  className = '',
}: {
  texts: string[]
  className?: string
}) {
  const [display, setDisplay] = useState('')
  const [textIdx, setTextIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (texts.length === 0) return
    const current = texts[textIdx % texts.length]
    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => setCharIdx(charIdx + 1), 80)
      return () => clearTimeout(t)
    }
    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), 1500)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => setCharIdx(charIdx - 1), 40)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx === 0) {
      setDeleting(false)
      setTextIdx(textIdx + 1)
    }
  }, [charIdx, deleting, textIdx, texts])

  return (
    <span className={`inline-block ${className}`}>
      {display || texts[0]?.slice(0, charIdx)}
      <span className="typing-cursor ml-0.5 inline-block w-0.5 animate-cursor-blink bg-purple-400" />
      <style>{`
        .typing-cursor { animation: cursor-blink 1s step-end infinite; }
        @keyframes cursor-blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
      `}</style>
    </span>
  )
}

// ===== Particle Canvas Background =====
export function ParticleCanvas({
  className = '',
  particleColor = 'rgba(168,85,247,0.6)',
  lineColor = 'rgba(168,85,247,0.15)',
  particleCount = 60,
}: {
  className?: string
  particleColor?: string
  lineColor?: string
  particleCount?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = []

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      })
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = particleColor
        ctx!.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx!.beginPath()
            ctx!.moveTo(p.x, p.y)
            ctx!.lineTo(q.x, q.y)
            ctx!.strokeStyle = lineColor
            ctx!.lineWidth = 0.5 * (1 - dist / 120)
            ctx!.stroke()
          }
        }
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [particleColor, lineColor, particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}

// ===== Smooth Mesh Gradient Background =====
// Replaces ugly aurora blobs with a seamless flowing gradient
export function MeshGradient({
  className = '',
  intensity = 'medium',
}: {
  className?: string
  intensity?: 'subtle' | 'medium' | 'strong'
}) {
  const opacityMap = { subtle: 0.3, medium: 0.5, strong: 0.7 }
  const op = opacityMap[intensity]

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Layer 1: Large soft purple-cyan gradient — moves slowly */}
      <div
        className="absolute inset-[-30%]"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(99, 102, 241, ${op * 0.4}) 0%,
              transparent 40%,
              rgba(168, 85, 247, ${op * 0.25}) 60%,
              transparent 100%
            )
          `,
          filter: 'blur(60px)',
          transform: 'translate(-5%, -5%)',
          animation: 'mesh-drift-1 20s ease-in-out infinite alternate',
        }}
      />
      {/* Layer 2: Cyan accent — opposite direction */}
      <div
        className="absolute inset-[-30%]"
        style={{
          background: `
            linear-gradient(
              225deg,
              rgba(6, 182, 212, ${op * 0.2}) 0%,
              transparent 35%,
              rgba(236, 72, 153, ${op * 0.15}) 65%,
              transparent 100%
            )
          `,
          filter: 'blur(70px)',
          transform: 'translate(5%, 5%)',
          animation: 'mesh-drift-2 25s ease-in-out infinite alternate-reverse',
        }}
      />
      {/* Layer 3: Center glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 50% at 50% 50%,
              rgba(139, 92, 246, ${op * 0.12}) 0%,
              transparent 70%
            )
          `,
          filter: 'blur(40px)',
          animation: 'mesh-pulse 15s ease-in-out infinite',
        }}
      />
    </div>
  )
}

// ===== Starfield / Noise Texture Background =====
export function Starfield({
  density = 120,
  className = '',
}: {
  density?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const stars: { x: number; y: number; r: number; speed: number; twinkleSpeed: number }[] = []

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
      initStars()
    }

    function initStars() {
      stars.length = 0
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          r: Math.random() * 1.5 + 0.3,
          speed: Math.random() * 0.15 + 0.02,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        })
      }
    }

    let phase = 0
    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      phase += 0.008
      for (const s of stars) {
        // Twinkle using sine wave
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(phase * s.twinkleSpeed * 100 + s.x))
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(200, 200, 255, ${alpha * 0.7})`
        ctx!.fill()
        // Subtle glow on brighter stars
        if (s.r > 1 && alpha > 0.8) {
          ctx!.beginPath()
          ctx!.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(168, 85, 247, ${alpha * 0.15})`
          ctx!.fill()
        }
        // Slow drift
        s.y += s.speed
        if (s.y > canvas!.height + 5) {
          s.y = -5
          s.x = Math.random() * canvas!.width
        }
      }
      animId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}

// ===== 3D Tilt Card with Neon Border =====
export function TiltNeonCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cx = rect.width / 2
      const cy = rect.height / 2
      const rotateX = ((y - cy) / cy) * -8
      const rotateY = ((x - cx) / cx) * 8
      el!.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`
    }
    function handleLeave() {
      el!.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)'
      el!.style.transition = 'transform 0.5s ease'
    }
    function handleEnter() {
      el!.style.transition = 'transform 0.1s ease'
    }
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    el.addEventListener('mouseenter', handleEnter)
    return () => {
      el!.removeEventListener('mousemove', handleMove)
      el!.removeEventListener('mouseleave', handleLeave)
      el!.removeEventListener('mouseenter', handleEnter)
    }
  }, [])

  return (
    <div ref={ref} className={`tilt-neon-card relative rounded-2xl border border-zinc-800/50 bg-zinc-900/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 ${className}`}>
      {/* Neon glow on hover */}
      <div className="absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, #a855f7, #06b6d4, #ec4899, #a855f7)',
          backgroundSize: '300% 300%',
          animation: 'neon-rotate 3s linear infinite',
          zIndex: -1,
          filter: 'blur(8px)',
          opacity: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.6' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0' }}
      />
      {children}
    </div>
  )
}

// ===== Magnetic Button (spring-follow) =====
export function MagneticBtn({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el!.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    }
    function handleLeave() {
      el!.style.transform = 'translate(0, 0)'
      el!.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
    }
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el!.removeEventListener('mousemove', handleMove)
      el!.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`magnetic-btn relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:translate-x-full transition-transform duration-700 ease-in-out" />
    </button>
  )
}

// ===== Counter with ease-out roll =====
export function CounterRoll({
  end,
  duration = 2000,
  suffix = '',
}: {
  end: number
  duration?: number
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          function update(now: number) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(update)
          }
          requestAnimationFrame(update)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// ===== Animated Border Card (for prompt cards) =====
export function GlowCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`glow-card group relative rounded-2xl border border-zinc-800/60 bg-zinc-900/70 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] ${className}`}>
      {/* Top shimmer line on hover */}
      <div className="absolute -top-[1px] left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent transition-all duration-700 ease-out group-hover:w-full" />
      {/* Bottom shimmer line */}
      <div className="absolute -bottom-[1px] right-0 h-[2px] w-0 bg-gradient-to-l from-transparent via-cyan-400 to-transparent transition-all duration-700 ease-out group-hover:w-full" />
      {children}
    </div>
  )
}

// ===== Shimmer Sweep Text (for section headers) =====
export function ShimmerText({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`relative inline-block bg-[length:200%_100%] bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 to-purple-400 animate-text-shimmer ${className}`}
    >
      {children}
    </span>
  )
}
