'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4',
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function BentoCard({
  title,
  description,
  icon,
  className,
  children,
  onClick,
}: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm cursor-pointer',
        className
      )}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {icon && (
        <div className="relative z-10 mb-4 text-purple-400">{icon}</div>
      )}
      <h3 className="relative z-10 text-lg font-semibold text-zinc-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="relative z-10 text-sm text-zinc-400">{description}</p>
      )}
      {children}
    </motion.div>
  )
}
