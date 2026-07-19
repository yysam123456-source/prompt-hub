'use client'

import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { getCategoryConfig } from '@/lib/categories'
import { ShimmerText, TiltNeonCard } from '@/components/animata/effects/v2'

interface Template {
  id: string
  templateId: string
  anchor: string
  title: string
  description: string
  category: string
  cover: string
  styles: string[]
  scenes: string[]
  tags: string[]
  useWhen: string
  guidance: string[]
  pitfalls: string[]
  exampleCases: number[]
}

function AnimateOnView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function LoadingView() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
    </div>
  )
}

function NotFoundView() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
      <span className="text-5xl mb-4">🔍</span>
      <p className="text-lg">Template not found</p>
      <Link href="/" className="mt-4 text-purple-400 hover:text-purple-300 underline transition-colors">Back to Home</Link>
    </div>
  )
}

function TemplateContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('id') || ''
  const [template, setTemplate] = useState<Template | null>(null)
  const [allTemplates, setAllTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/templates.json')
        const data: Template[] = await res.json()
        setAllTemplates(data)
        const found = data.find((t: Template) => t.templateId === templateId) || data[0]
        setTemplate(found)
      } catch { /* ignore */ }
      setLoading(false)
    }
    load()
  }, [templateId])

  if (loading) return <LoadingView />
  if (!template) return <NotFoundView />

  const catConfig = getCategoryConfig(template.category)

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Decorative grid — matches HowToUse section */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Navigation — matches search page nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100 hidden sm:block">Prompt Hub</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-purple-400 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header badge — matches HowToUse badge pattern */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${catConfig.gradient} text-white`}>
              {catConfig.emoji} {catConfig.label}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs font-semibold text-purple-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500" />
              </span>
              Blueprint
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-zinc-100 sm:text-4xl mb-4">
            <ShimmerText className="text-3xl font-black sm:text-4xl">{template.title}</ShimmerText>
          </h1>
          <p className="text-base text-zinc-400 mb-10 max-w-2xl leading-relaxed">{template.description}</p>

          {/* Cover image — matches PromptCard image style */}
          {template.cover && !imgError && (
            <div className="relative rounded-2xl overflow-hidden mb-12 border border-zinc-800/80 shadow-2xl">
              <div className="aspect-video overflow-hidden bg-zinc-900">
                <img
                  src={template.cover}
                  alt={template.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Style/Scene/Tag chips */}
          <div className="flex flex-wrap gap-2 mb-12">
            {template.styles.map(s => (
              <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {s}
              </span>
            ))}
            {template.scenes.map(s => (
              <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {s}
              </span>
            ))}
            {template.tags.filter(t => !template.styles.includes(t) && !template.scenes.includes(t)).map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                {t}
              </span>
            ))}
          </div>

          {/* When to Use — card pattern from HowToUse steps */}
          <AnimateOnView delay={0.1}>
            <TiltNeonCard className="group relative rounded-3xl border border-zinc-800/40 bg-zinc-900/50 p-8 backdrop-blur-sm mb-12 hover:border-green-500/30 transition-all duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 rounded-full bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-zinc-100 mb-2">When to Use</h2>
                  <p className="text-sm text-zinc-300 leading-relaxed">{template.useWhen}</p>
                </div>
              </div>
            </TiltNeonCard>
          </AnimateOnView>

          {/* Guidance — numbered list matching HowToUse step cards */}
          {template.guidance.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-600" />
                <h2 className="text-2xl font-bold text-zinc-100">Prompt Guidance</h2>
                <span className="text-xs text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded-full">{template.guidance.length} tips</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {template.guidance.map((g, i) => (
                  <AnimateOnView key={i} delay={i * 0.05}>
                    <TiltNeonCard className="group relative rounded-2xl border border-zinc-800/40 bg-zinc-900/50 p-5 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500">
                      <div className="flex gap-4">
                        <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-sm font-black">
                          {i + 1}
                        </span>
                        <p className="text-sm text-zinc-300 leading-relaxed pt-0.5">{g}</p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </TiltNeonCard>
                  </AnimateOnView>
                ))}
              </div>
            </section>
          )}

          {/* Pitfalls — similar pattern with warning colors */}
          {template.pitfalls.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-amber-500 to-amber-600" />
                <h2 className="text-2xl font-bold text-zinc-100">Common Pitfalls</h2>
                <span className="text-xs text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded-full">{template.pitfalls.length} warnings</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {template.pitfalls.map((p, i) => (
                  <AnimateOnView key={i} delay={i * 0.05}>
                    <TiltNeonCard className="group relative rounded-2xl border border-zinc-800/40 bg-zinc-900/50 p-5 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-500">
                      <div className="flex gap-4">
                        <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 text-sm font-black">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                        </span>
                        <p className="text-sm text-zinc-300 leading-relaxed pt-0.5">{p}</p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </TiltNeonCard>
                  </AnimateOnView>
                ))}
              </div>
            </section>
          )}

          {/* Example cases — cards linking to prompts */}
          {template.exampleCases.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-pink-500 to-pink-600" />
                <h2 className="text-2xl font-bold text-zinc-100">Example Cases</h2>
                <span className="text-xs text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded-full">{template.exampleCases.length} examples</span>
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                Browse these gallery cases to see how this template applies in practice.
              </p>
              <div className="flex flex-wrap gap-2">
                {template.exampleCases.map(caseId => (
                  <Link
                    key={caseId}
                    href={`/category?cat=${template.category}`}
                    className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800/60 border border-zinc-700/60 text-zinc-400 hover:border-purple-500/40 hover:text-purple-300 transition-all"
                  >
                    Case #{caseId}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Divider */}
          <div className="my-16 border-t border-zinc-800/60" />

          {/* More Templates — matching PromptListSection pattern */}
          <section>
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-bold text-zinc-100">
                <ShimmerText className="text-2xl font-bold">More Templates</ShimmerText>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allTemplates.filter(t => t.templateId !== template.templateId).slice(0, 4).map((t, i) => {
                const cfg = getCategoryConfig(t.category)
                return (
                  <AnimateOnView key={t.id} delay={i * 0.06}>
                    <Link
                      href={`/template?id=${encodeURIComponent(t.templateId)}`}
                      className="group block p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/40 hover:border-purple-500/40 transition-all duration-300 hover:bg-zinc-900/80"
                    >
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mb-2 bg-gradient-to-r ${cfg.gradient} text-white`}>
                        {cfg.emoji} {cfg.label}
                      </span>
                      <span className="text-sm text-zinc-300 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug block">
                        {t.title}
                      </span>
                    </Link>
                  </AnimateOnView>
                )
              })}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  )
}

export default function TemplatePage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <TemplateContent />
    </Suspense>
  )
}
