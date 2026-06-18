'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CATEGORY_CONFIG: Record<string, { name: string; emoji: string; gradient: string }> = {
  'portrait':     { name: 'Portrait',     emoji: '👤',  gradient: 'from-rose-600 to-pink-700' },
  'landscape':    { name: 'Landscape',    emoji: '🏔️',  gradient: 'from-emerald-600 to-teal-700' },
  'fantasy':      { name: 'Fantasy',      emoji: '🐉',  gradient: 'from-violet-600 to-purple-700' },
  'sci-fi':       { name: 'Sci-Fi',       emoji: '🚀',  gradient: 'from-blue-600 to-cyan-700' },
  'anime':        { name: 'Anime',        emoji: '🎌',  gradient: 'from-pink-600 to-rose-700' },
  'abstract':     { name: 'Abstract',     emoji: '🎨',  gradient: 'from-amber-600 to-orange-700' },
  'architecture': { name: 'Architecture', emoji: '🏛️',  gradient: 'from-stone-600 to-zinc-700' },
  'animal':       { name: 'Animal',       emoji: '🦁',  gradient: 'from-lime-600 to-green-700' },
  'food':         { name: 'Food',         emoji: '🍜',  gradient: 'from-red-600 to-amber-700' },
  'fashion':      { name: 'Fashion',      emoji: '👗',  gradient: 'from-fuchsia-600 to-pink-700' },
  'horror':       { name: 'Horror',       emoji: '👻',  gradient: 'from-gray-800 to-black' },
  'cyberpunk':    { name: 'Cyberpunk',    emoji: '🌆',  gradient: 'from-yellow-600 to-amber-700' },
}

export default function CategoryBar({ categories }: { categories?: any[] }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const cats = categories || []

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {cats.map((cat: any, idx: number) => {
        const slug = cat.slug || cat
        const config = CATEGORY_CONFIG[slug] || { name: slug, emoji: '💡', gradient: 'from-zinc-700 to-zinc-900' }
        const href = `/category?slug=${slug}`

        return (
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
          >
            <Link
              href={href}
              className={`group block rounded-2xl border border-zinc-800 bg-gradient-to-br ${config.gradient} p-5 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1`}
            >
              {/* Emoji */}
              <div className="text-4xl mb-3 drop-shadow-md">{config.emoji}</div>

              {/* Name */}
              <h3 className="font-semibold text-white group-hover:text-purple-200 transition-colors text-sm">
                {cat.name || config.name}
              </h3>

              {/* Item count if available */}
              {'count' in cat && (
                <p className="text-xs text-white/60 mt-1">{cat.count} prompts</p>
              )}
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
