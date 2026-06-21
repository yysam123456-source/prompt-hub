'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Category visual config - gradients as fallback when real image fails
const CATEGORY_CONFIG: Record<string, { name: string; gradient: string; fallbackEmoji: string }> = {
  'portrait':     { name: 'Portrait',     gradient: 'from-rose-600/90 to-pink-900/90',   fallbackEmoji: '👤' },
  'landscape':    { name: 'Landscape',    gradient: 'from-emerald-600/90 to-teal-900/90',  fallbackEmoji: '🏔️' },
  'fantasy':      { name: 'Fantasy',      gradient: 'from-violet-600/90 to-purple-900/90', fallbackEmoji: '🐉' },
  'sci-fi':       { name: 'Sci-Fi',       gradient: 'from-blue-600/90 to-cyan-900/90',     fallbackEmoji: '🚀' },
  'anime':        { name: 'Anime',        gradient: 'from-pink-600/90 to-rose-900/90',     fallbackEmoji: '🎌' },
  'abstract':     { name: 'Abstract',     gradient: 'from-amber-600/90 to-orange-900/90',  fallbackEmoji: '🎨' },
  'architecture': { name: 'Architecture', gradient: 'from-stone-600/90 to-zinc-900/90',    fallbackEmoji: '🏛️' },
  'animal':       { name: 'Animal',       gradient: 'from-lime-600/90 to-green-900/90',    fallbackEmoji: '🦁' },
  'food':         { name: 'Food',         gradient: 'from-red-600/90 to-amber-900/90',     fallbackEmoji: '🍜' },
  'fashion':      { name: 'Fashion',      gradient: 'from-fuchsia-600/90 to-pink-900/90',  fallbackEmoji: '👗' },
  'horror':       { name: 'Horror',       gradient: 'from-gray-800/95 to-black/95',        fallbackEmoji: '👻' },
  'cyberpunk':    { name: 'Cyberpunk',    gradient: 'from-yellow-600/90 to-amber-900/90',   fallbackEmoji: '🌆' },
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
    name: cat.slug,
    gradient: 'from-zinc-700/90 to-zinc-900/90',
    fallbackEmoji: '💡',
  }
  const href = `/category?slug=${cat.slug}`
  const hasRealImage = !!cat.imageUrl && !imgFailed

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
    >
      <Link
        href={href}
        className="group block rounded-2xl border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
        style={{ aspectRatio: '1 / 1' }}
      >
        <div className={`relative w-full h-full bg-zinc-900`}>
          {/* Shimmer loading - only shows while image is loading */}
          {cat.imageUrl && !imgFailed && !imgLoaded && (
            <div className="absolute inset-0 image-loading-shimmer z-10" />
          )}

          {/* Real image with error handling */}
          {cat.imageUrl && !imgFailed && (
            <img
              src={cat.imageUrl}
              alt={`${config.name} category`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgFailed(true)}
            />
          )}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

          {/* Fallback when no image or image failed - show gradient bg */}
          {(!cat.imageUrl || imgFailed) && (
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
              <span className="text-5xl opacity-50 drop-shadow-lg">{config.fallbackEmoji}</span>
            </div>
          )}

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col justify-end h-full p-4">
            <h3 className="font-semibold text-white text-sm drop-shadow-lg">
              {cat.name || config.name}
            </h3>

            {'count' in cat && cat.count !== undefined && (
              <p className="text-xs text-white/70 mt-1 drop-shadow">
                {cat.count} prompts
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function CategoryBar({ categories }: { categories?: any[] }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const cats: CategoryWithImage[] = (categories || []).map((cat: any) => ({
    slug: cat.slug || cat,
    name: cat.name || cat,
    count: cat.count,
    imageUrl: cat.imageUrl,
  }))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {cats.map((cat: CategoryWithImage, idx: number) => (
        <CategoryCard key={cat.slug} cat={cat} idx={idx} />
      ))}
    </div>
  )
}
