'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getCategoryConfig } from '@/lib/categories'
import { ShimmerText, GlowCard } from '@/components/animata/effects/v2'

interface Template {
  id: string
  templateId: string
  title: string
  description: string
  category: string
  cover: string
  styles: string[]
  scenes: string[]
  guidance: string[]
  pitfalls: string[]
  useWhen: string
}

function AnimateOnView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function TemplateCard({ template, index }: { template: Template; index: number }) {
  const cfg = getCategoryConfig(template.category)

  return (
    <AnimateOnView delay={index * 0.06}>
      <GlowCard className="h-full rounded-2xl">
        <Link
          href={`/template/${encodeURIComponent(template.templateId)}/`}
          className="group relative block overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/15 animated-border"
        >
          {/* Category gradient badge at top */}
          <div className="absolute top-0 left-3 right-3 h-0.5 rounded-b bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Body */}
          <div className="p-5">
            {/* Category badge row */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-gradient-to-r ${cfg.gradient} text-white`}>
                {cfg.emoji} {cfg.label}
              </span>
              {template.scenes.length > 0 && (
                <span className="text-[10px] text-zinc-600">{template.scenes.slice(0, 2).join(' · ')}</span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-purple-300 transition-colors mb-2 line-clamp-1 leading-snug">
              {template.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
              {template.description}
            </p>

            {/* When to use preview */}
            {template.useWhen && (
              <p className="text-[11px] text-zinc-600 line-clamp-1 italic leading-relaxed border-l-2 border-zinc-800 pl-2">
                {template.useWhen}
              </p>
            )}

            {/* Guidance count indicator */}
            {(template.guidance.length > 0 || template.pitfalls.length > 0) && (
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-800/60">
                {template.guidance.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-blue-400/70">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    {template.guidance.length} tips
                  </span>
                )}
                {template.pitfalls.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400/70">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    {template.pitfalls.length} pitfalls
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Hover overlay glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        </Link>
      </GlowCard>
    </AnimateOnView>
  )
}

function TemplateGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-zinc-900/50 border border-zinc-800/40 h-48 animate-pulse" />
      ))}
    </div>
  )
}

export default function TemplateSection() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/templates.json')
      .then(res => res.json())
      .then(data => {
        setTemplates(data.slice(0, 8))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (!loading && templates.length === 0) return null

  return (
    <section className="relative px-4 py-24">
      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section header — matches PromptListSection pattern */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
              <ShimmerText className="text-3xl font-bold sm:text-4xl">Blueprint Templates</ShimmerText>
            </h2>
            <p className="mt-1.5 text-sm text-zinc-400">Prompt recipes with guidance and proven patterns</p>
          </div>
          <Link
            href="/template/ui-screenshot-system/"
            className="group text-sm text-purple-400 transition-all duration-300 hover:text-purple-300 hover:translate-x-1 inline-block"
          >
            View All →
          </Link>
        </div>

        {/* Cards grid — matches PromptListSection grid */}
        {loading ? (
          <TemplateGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
