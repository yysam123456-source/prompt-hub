'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

// Gradients for placeholder cards when no image is available
const CATEGORY_COLORS: Record<string, string> = {
  'stable-diffusion': 'from-violet-600 to-indigo-700',
  'midjourney': 'from-emerald-600 to-teal-700',
  'dall-e': 'from-orange-600 to-amber-700',
  'leonardo': 'from-sky-600 to-blue-700',
  'firefly': 'from-rose-600 to-pink-700',
  'generative': 'from-fuchsia-600 to-purple-700',
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || 'from-zinc-700 to-zinc-900'
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'stable-diffusion': '🎨',
    'midjourney': '🌌',
    'dall-e': '🖼️',
    'leonardo': '✨',
    'firefly': '🔥',
    'generative': '🤖',
  }
  return emojis[category] || '💡'
}

export default function PromptGrid({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <div className="text-5xl mb-4">📭</div>
        <p>No prompts found. Try a different search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item: any, idx: number) => {
        const title = item.title?.en || item.title || 'Untitled'
        const category = item.category || 'other'
        const colorClass = getCategoryColor(category)
        const emoji = getCategoryEmoji(category)

        return (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (idx % 5) * 0.08 }}
          >
            <Link
              href={`/prompt?slug=${item.slug}`}
              className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
            >
              {/* Image / Placeholder area */}
              <div className={`aspect-square overflow-hidden bg-gradient-to-br ${colorClass} flex items-center justify-center relative`}>
                {/* Category emoji as visual element */}
                <span className="text-6xl opacity-80">{emoji}</span>
                {/* View count badge */}
                <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-zinc-300 backdrop-blur-sm">
                  👁️ {item.viewCount ?? item.view_count ?? 0}
                </div>
              </div>
              {/* Info area */}
              <div className="p-3">
                <h3 className="font-medium text-sm text-zinc-200 line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1.5">
                  <span className="capitalize">{category}</span>
                  <span>❤️ {item.likeCount ?? item.like_count ?? 0}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
