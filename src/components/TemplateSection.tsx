'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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

  if (loading || templates.length === 0) return null

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Blueprint Templates
          </span>
        </h2>
        <p className="text-zinc-400">Prompt recipes with guidance and proven patterns</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((t, idx) => {
          const cfg = getCategoryConfig(t.category)
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
            >
              <Link
                href={`/template?id=${encodeURIComponent(t.templateId)}`}
                className="block group p-5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-purple-500/40 transition-all duration-300 hover:bg-zinc-900"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs bg-gradient-to-r ${cfg.gradient} text-white`}>
                    {cfg.emoji}
                  </span>
                  <span className="text-xs text-zinc-500">{cfg.label}</span>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-1">
                  {t.title}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{t.description}</p>
                {t.styles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {t.styles.slice(0, 3).map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/template?id=ui-screenshot-system"
          className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          View all templates <span className="text-lg leading-none">→</span>
        </Link>
      </div>
    </section>
  )
}
