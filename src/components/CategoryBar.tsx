'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Match actual category slugs from prompts.sorry.ink API
const CATEGORY_CONFIG: Record<string, { label: string; gradient: string; emoji: string }> = {
  'other':              { label: 'Other',           gradient: 'from-zinc-600/90 to-zinc-800/90',     emoji: '📦' },
  'graphic_design':     { label: 'Graphic Design',   gradient: 'from-blue-600/90 to-indigo-900/90',    emoji: '✏️' },
  'anime_game':         { label: 'Anime & Game',    gradient: 'from-pink-600/90 to-rose-900/90',      emoji: '🎮' },
  'photography':        { label: 'Photography',     gradient: 'from-amber-600/90 to-orange-900/90',   emoji: '📷' },
  'branding_visual':    { label: 'Branding',        gradient: 'from-violet-600/90 to-purple-900/90',  emoji: '🎨' },
  'character':          { label: 'Character',        gradient: 'from-rose-600/90 to-red-900/90',      emoji: '👤' },
  'illustration':       { label: 'Illustration',    gradient: 'from-teal-600/90 to-cyan-900/90',     emoji: '🖌️' },
  'ecommerce':          { label: 'E-commerce',      gradient: 'from-green-600/90 to-emerald-900/90',  emoji: '🛒' },
  'tech_scifi':         { label: 'Sci-Fi & Tech',    gradient: 'from-cyan-600/90 to-blue-900/90',     emoji: '🚀' },
  'novel_story':        { label: 'Novel & Story',    gradient: 'from-fuchsia-600/90 to-pink-900/90',   emoji: '📖' },
  'architecture_interior': { label: 'Architecture',    gradient: 'from-stone-600/90 to-warmGray-900/90', emoji: '🏛️' },
  'landscape_scene':    { label: 'Landscape',       gradient: 'from-emerald-600/90 to-green-900/90',  emoji: '🏔️' },
  'food':               { label: 'Food & Drink',    gradient: 'from-red-600/90 to-orange-900/90',     emoji: '🍜' },
  'cultural_products':  { label: 'Cultural',        gradient: 'from-yellow-600/90 to-amber-900/90',  emoji: '🎁' },
  'creative_play':      { label: 'Creative Play',    gradient: 'from-lime-600/90 to-yellow-900/90',   emoji: '💡' },
  'product_design':     { label: 'Product Design',   gradient: 'from-slate-600/90 to-gray-900/90',    emoji: '📱' },
}

export interface CategoryWithImage {
  slug: string
  name: string
  count?: number
  imageUrl?: string
}

function CategoryCard({ cat, idx }: { cat: CategoryWithImage; idx: number }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const config = CATEGORY_CONFIG[cat.slug] || {
    label: cat.name || cat.slug,
    gradient: 'from-zinc-700/90 to-zinc-900/90',
    emoji: '💡',
  }
  const href = `/category?slug=${encodeURIComponent(cat.slug)}`
  const hasRealImage = !!cat.imageUrl && !imgFailed

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (idx % 6) * 0.07 }}
      whileHover={{ y: -8, scale: 1.03 }}
    >
      <Link
        href={href}
        className="group relative block rounded-2xl border border-zinc-800/80 overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/15 animated-border"
        style={{ aspectRatio: '1 / 1' }}
      >
        <div className={`relative w-full h-full bg-zinc-900`}>
          {/* Shimmer loading */}
          {cat.imageUrl && !imgFailed && !imgLoaded && (
            <div className="absolute inset-0 image-loading-shimmer z-10" />
          )}

          {/* Real image */}
          {cat.imageUrl && !imgFailed && (
            <img
              src={cat.imageUrl}
              alt={`${config.label} category`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgFailed(true)}
            />
          )}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-300" />

          {/* Fallback - gradient bg with emoji when no image or failed */}
          {(!cat.imageUrl || imgFailed) && (
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
              <span className="text-5xl opacity-60 drop-shadow-lg">{config.emoji}</span>
            </div>
          )}

          {/* Hover glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col justify-end h-full p-4">
            <h3 className="font-semibold text-white text-sm drop-shadow-lg transition-colors group-hover:text-purple-200">
              {config.label || cat.name}
            </h3>

            {'count' in cat && cat.count !== undefined && (
              <p className="text-xs text-white/70 mt-1 drop-shadow transition-colors group-hover:text-white/80">
                {cat.count} prompts
              </p>
            )}
          </div>

          {/* Bottom accent line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function CategoryBar({ categories, categoryImages }: {
  categories?: any[]
  categoryImages?: Record<string, string>
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const cats: CategoryWithImage[] = (categories || []).map((cat: any) => {
    const slug = typeof cat === 'string' ? cat : (cat.slug || '')
    return {
      slug,
      name: cat.name || cat.label || (typeof cat === 'string' ? cat : cat.slug || ''),
      count: cat.count,
      // 优先使用传入的封面图映射
      imageUrl: categoryImages?.[slug] || cat.imageUrl,
    }
  })

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {cats.map((cat: CategoryWithImage, idx: number) => (
        <CategoryCard key={cat.slug} cat={cat} idx={idx} />
      ))}
    </div>
  )
}
