'use client'

import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { getCategoryConfig } from '@/lib/categories'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <span className="text-5xl mb-4">🔍</span>
        <p className="text-lg">Template not found</p>
        <Link href="/" className="mt-4 text-purple-400 hover:text-purple-300 underline">Back to Home</Link>
      </div>
    )
  }

  const catConfig = getCategoryConfig(template.category)

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-purple-400 text-sm mb-6 transition-colors">
          ← Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Category badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${catConfig.gradient} text-white`}>
            {catConfig.emoji} {catConfig.label}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{template.title}</h1>
          <p className="text-zinc-400 text-lg mb-8">{template.description}</p>

          {/* Cover */}
          {template.cover && !imgError && (
            <div className="relative rounded-xl overflow-hidden mb-10 border border-zinc-800 max-h-96">
              <img
                src={template.cover}
                alt={template.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {template.styles.map(s => (
              <span key={s} className="px-3 py-1 rounded-md text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20">{s}</span>
            ))}
            {template.scenes.map(s => (
              <span key={s} className="px-3 py-1 rounded-md text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{s}</span>
            ))}
            {template.tags.map(s => (
              <span key={s} className="px-3 py-1 rounded-md text-xs bg-zinc-800 text-zinc-400 border border-zinc-700">{s}</span>
            ))}
          </div>

          {/* When to Use */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-green-400">💡</span> When to Use
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <p className="text-zinc-300 leading-relaxed">{template.useWhen}</p>
            </div>
          </section>

          {/* Guidance */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-blue-400">📋</span> Prompt Guidance
            </h2>
            <div className="space-y-3">
              {template.guidance.map((g, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-3">
                  <span className="text-blue-400 font-bold text-sm mt-0.5 shrink-0">{i + 1}.</span>
                  <p className="text-zinc-300 leading-relaxed">{g}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pitfalls */}
          {template.pitfalls.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-amber-400">⚠️</span> Common Pitfalls
              </h2>
              <div className="space-y-3">
                {template.pitfalls.map((p, i) => (
                  <div key={i} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                    <span className="text-amber-400 shrink-0 mt-0.5">⚠</span>
                    <p className="text-zinc-300 leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Navigation: other templates */}
          <section className="mt-16 pt-8 border-t border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">More Templates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allTemplates.filter(t => t.templateId !== template.templateId).slice(0, 8).map(t => {
                const cfg = getCategoryConfig(t.category)
                return (
                  <Link
                    key={t.id}
                    href={`/template?id=${encodeURIComponent(t.templateId)}`}
                    className="block p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-all group"
                  >
                    <span className="text-xs text-zinc-500 block mb-1">{cfg.emoji} {cfg.label}</span>
                    <span className="text-sm text-zinc-200 group-hover:text-purple-300 transition-colors line-clamp-2">{t.title}</span>
                  </Link>
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
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    }>
      <TemplateContent />
    </Suspense>
  )
}
