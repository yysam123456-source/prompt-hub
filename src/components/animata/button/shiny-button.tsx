'use client'

import { cn } from '@/lib/utils'
import { motion, type MotionProps } from 'framer-motion'
import type { ButtonHTMLAttributes } from 'react'

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  href?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export default function ShinyButton({
  children,
  onClick,
  className = '',
  href,
  type,
}: ShinyButtonProps) {
  const buttonContent = (
    <motion.button
      type={type || 'button'}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative overflow-hidden rounded-xl px-8 py-4 font-semibold text-white',
        'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600',
        'shadow-lg shadow-purple-500/25',
        'transition-all duration-300',
        className
      )}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )

  if (href) {
    return (
      <a href={href} className="inline-block">
        {buttonContent}
      </a>
    )
  }

  return buttonContent
}
