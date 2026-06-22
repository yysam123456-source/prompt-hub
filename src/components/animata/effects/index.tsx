'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ======== Aurora Background ========
export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-zinc-950">
      {/* Aurora layers */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
        <div className="aurora aurora-4" />
        <div className="absolute inset-0 bg-zinc-950/40" />
      </div>
      {children}
    </div>
  )
}

// ======== Particle Canvas ========
export function ParticleField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Init particles
    const count = Math.min(80, Math.floor(window.innerWidth / 20))
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 0.5,
      color: ['#a855f7', '#ec4899', '#6366f1', '#06b6d4', '#8b5cf6'][Math.floor(Math.random() * 5)],
      alpha: Math.random() * 0.5 + 0.2,
    }))

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      const particles = particlesRef.current

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0')
        ctx!.fill()

        // Draw lines between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x
          const dy = p.y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx!.beginPath()
            ctx!.moveTo(p.x, p.y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = p.color + Math.floor((0.15 * (1 - dist / 120)) * 255).toString(16).padStart(2, '0')
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      })

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 -z-10 pointer-events-none ${className}`}
      style={{ opacity: 0.6 }}
    />
  )
}

// ======== Morphing Blob SVG ========
export function MorphingBlob({ className = '', color1 = '#a855f7', color2 = '#ec4899' }: { className?: string; color1?: string; color2?: string }) {
  return (
    <div className={`absolute -z-10 pointer-events-none ${className}`}>
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="morphing-blob w-full h-full">
        <defs>
          <linearGradient id="blob-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color2} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path fill="url(#blob-grad)">
          <animate
            attributeName="d"
            dur="20s"
            repeatCount="indefinite"
            values="
              M128.5,237.3 C128.5,300.4 200.7,400 300.7,400 C400.7,400 400.7,300.4 400.7,237.3 C400.7,174.2 400.7,74.6 300.7,74.6 C200.7,74.6 128.5,174.2 128.5,237.3 Z;
              M143.7,220.5 C143.7,283.6 185.5,383 285.5,383 C385.5,383 385.5,283.6 385.5,220.5 C385.5,157.4 385.5,57.8 285.5,57.8 C185.5,57.8 143.7,157.4 143.7,220.5 Z;
              M158.9,203.7 C158.9,266.8 170.3,366.2 270.3,366.2 C370.3,366.2 370.3,266.8 370.3,203.7 C370.3,140.6 370.3,40.2 270.3,40.2 C170.3,40.2 158.9,140.6 158.9,203.7 Z;
              M128.5,237.3 C128.5,300.4 200.7,400 300.7,400 C400.7,400 400.7,300.4 400.7,237.3 C400.7,174.2 400.7,74.6 300.7,74.6 C200.7,74.6 128.5,174.2 128.5,237.3 Z
            "
          />
        </path>
      </svg>
    </div>
  )
}

// ======== 3D Tilt Card ========
export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`,
      transition: 'transform 0.1s ease-out',
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      transition: 'transform 0.5s ease-out',
    })
  }, [])

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Neon border */}
      <div className="tilt-card-neon" />
      {children}
    </div>
  )
}

// ======== Animated Counter ========
export function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const startVal = 0
          function update(now: number) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(startVal + (end - startVal) * eased))
            if (progress < 1) requestAnimationFrame(update)
          }
          requestAnimationFrame(update)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// ======== Magnetic Button ========
export function MagneticButton({ children, className = '', strength = 0.3, ...props }: any) {
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    setPos({ x, y })
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    setPos({ x: 0, y: 0 })
  }, [])

  return (
    <motion.button
      ref={ref}
      className={`magnetic-btn ${className}`}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// ======== Neon Glow Border ========
export function NeonBorder({ children, className = '', color = '#a855f7' }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div
        className="absolute -inset-[1px] rounded-[inherit] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(45deg, ${color}, #ec4899, #6366f1, ${color})`,
          backgroundSize: '400% 400%',
          animation: 'neon-rotate 3s linear infinite',
          filter: `blur(8px)`,
          opacity: 0,
        }}
      />
      <div className="absolute -inset-[1px] rounded-[inherit] z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(45deg, ${color}, #ec4899, #6366f1, ${color})`,
          backgroundSize: '400% 400%',
          animation: 'neon-rotate 3s linear infinite',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ======== Typing Effect ========
export function TypewriterText({ texts, className = '' }: { texts: string[]; className?: string }) {
  const [displayText, setDisplayText] = useState('')
  const [textIdx, setTextIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIdx % texts.length]
    if (!deleting && charIdx < currentText.length) {
      const timeout = setTimeout(() => setCharIdx(c => c + 1), 80)
      return () => clearTimeout(timeout)
    }
    if (!deleting && charIdx === currentText.length) {
      const timeout = setTimeout(() => setDeleting(true), 2000)
      return () => clearTimeout(timeout)
    }
    if (deleting && charIdx > 0) {
      const timeout = setTimeout(() => setCharIdx(c => c - 1), 40)
      return () => clearTimeout(timeout)
    }
    if (deleting && charIdx === 0) {
      setDeleting(false)
      setTextIdx(i => i + 1)
    }
  }, [charIdx, deleting, textIdx, texts])

  return (
    <span className={className}>
      {displayText}<span className="typing-cursor">|</span>
    </span>
  )
}

// ======== Wave Divider ========
export function WaveDivider({ className = '', color = '#18181b' }: { className?: string; color?: string }) {
  return (
    <div className={`relative w-full overflow-hidden leading-none ${className}`}>
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="wave-svg w-full">
        <path>
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,60 C360,120 720,0 1080,60 C1260,90 1380,60 1440,60 L1440,120 L0,120 Z;
              M0,40 C360,100 720,20 1080,80 C1260,100 1380,40 1440,60 L1440,120 L0,120 Z;
              M0,60 C360,0 720,120 1080,60 C1260,30 1380,80 1440,60 L1440,120 L0,120 Z;
              M0,60 C360,120 720,0 1080,60 C1260,90 1380,60 1440,60 L1440,120 L0,120 Z
            "
          />
        </path>
        <path opacity="0.5">
          <animate
            attributeName="d"
            dur="7s"
            repeatCount="indefinite"
            values="
              M0,80 C360,40 720,100 1080,60 C1260,40 1380,80 1440,80 L1440,120 L0,120 Z;
              M0,60 C360,100 720,30 1080,70 C1260,90 1380,50 1440,80 L1440,120 L0,120 Z;
              M0,70 C360,30 720,90 1080,50 C1260,70 1380,90 1440,80 L1440,120 L0,120 Z;
              M0,80 C360,40 720,100 1080,60 C1260,40 1380,80 1440,80 L1440,120 L0,120 Z
            "
          />
        </path>
      </svg>
    </div>
  )
}
