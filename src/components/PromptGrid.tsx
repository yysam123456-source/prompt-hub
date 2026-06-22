'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

// Category visual config with English display names
const CATEGORY_CONFIG: Record<string, { gradient: string; emoji: string; label: string }> = {
  'article-covers':  { gradient: 'from-blue-500/80 to-indigo-600/80', emoji: '📖', label: 'Article Covers' },
  'profile-avatar':  { gradient: 'from-rose-500/80 to-pink-600/80', emoji: '👤', label: 'Avatar' },
  'social-media-post': { gradient: 'from-cyan-500/80 to-blue-600/80', emoji: '📱', label: 'Social Media' },
  'infographic':     { gradient: 'from-emerald-500/80 to-teal-600/80', emoji: '📊', label: 'Infographic' },
  'youtube-thumbnail': { gradient: 'from-red-500/80 to-rose-600/80', emoji: '🎬', label: 'Thumbnail' },
  'comic':           { gradient: 'from-orange-500/80 to-amber-600/80', emoji: '📚', label: 'Comic' },
  'poster':          { gradient: 'from-purple-500/80 to-violet-600/80', emoji: '🎨', label: 'Poster' },
  'app-web-design':  { gradient: 'from-sky-500/80 to-blue-600/80', emoji: '💻', label: 'UI Design' },
  'anime_game':      { gradient: 'from-pink-500/80 to-rose-600/80', emoji: '🎮', label: 'Anime & Game' },
  'character':       { gradient: 'from-fuchsia-500/80 to-pink-600/80', emoji: '👤', label: 'Character' },
  'product-photography': { gradient: 'from-amber-500/80 to-yellow-600/80', emoji: '📷', label: 'Product' },
  'fashion':         { gradient: 'from-pink-500/80 to-fuchsia-600/80', emoji: '👗', label: 'Fashion' },
  'architecture':    { gradient: 'from-stone-500/80 to-zinc-600/80', emoji: '🏛️', label: 'Architecture' },
  'food-drink':      { gradient: 'from-red-500/80 to-orange-600/80', emoji: '🍜', label: 'Food & Drink' },
  'nature-landscape':{ gradient: 'from-green-500/80 to-emerald-600/80', emoji: '🌿', label: 'Landscape' },
  'abstract-geometric': { gradient: 'from-violet-500/80 to-purple-600/80', emoji: '🔷', label: 'Abstract' },
  'vintage-retro':   { gradient: 'from-yellow-500/80 to-amber-600/80', emoji: '📻', label: 'Vintage' },
  // Legacy slug mappings (for data that uses old-style categories)
  'portrait':        { gradient: 'from-rose-500/80 to-pink-600/80', emoji: '👤', label: 'Portrait' },
  'landscape':       { gradient: 'from-emerald-500/80 to-teal-600/80', emoji: '🏔️', label: 'Landscape' },
  'fantasy':         { gradient: 'from-violet-500/80 to-purple-600/80', emoji: '🐉', label: 'Fantasy' },
  'sci-fi':          { gradient: 'from-blue-500/80 to-cyan-600/80', emoji: '🚀', label: 'Sci-Fi' },
  'anime':           { gradient: 'from-pink-500/80 to-rose-600/80', emoji: '🎌', label: 'Anime' },
  'abstract':        { gradient: 'from-amber-500/80 to-orange-600/80', emoji: '🎨', label: 'Abstract' },
  'animal':          { gradient: 'from-lime-500/80 to-green-600/80', emoji: '🦁', label: 'Animal' },
  'food':            { gradient: 'from-red-500/80 to-amber-600/80', emoji: '🍜', label: 'Food' },
  'horror':          { gradient: 'from-gray-700/90 to-gray-900/90', emoji: '👻', label: 'Horror' },
  'cyberpunk':       { gradient: 'from-yellow-500/80 to-amber-600/80', emoji: '🌆', label: 'Cyberpunk' },
  'photography':     { gradient: 'from-teal-500/80 to-cyan-600/80', emoji: '📷', label: 'Photography' },
  'graphic-design':  { gradient: 'from-indigo-500/80 to-blue-600/80', emoji: '✒️', label: 'Graphic Design' },
  'novel_story':     { gradient: 'from-purple-500/80 to-indigo-600/80', emoji: '📖', label: 'Novel Story' },
  'other':           { gradient: 'from-zinc-600/80 to-zinc-800/80', emoji: '💡', label: 'Other' },
}

const DEFAULT_CONFIG = { gradient: 'from-zinc-600/80 to-zinc-800/80', emoji: '💡', label: 'Other' }

function getConfig(category: string) {
  return CATEGORY_CONFIG[category] || DEFAULT_CONFIG
}

export default function PromptGrid({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-lg">No prompts found</p>
        <p className="text-sm text-zinc-600 mt-2">Try a different search or category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item: any, idx: number) => (
        <PromptCard key={item.slug} item={item} index={idx} />
      ))}
    </div>
  )
}


function PromptCard({ item, index }: { item: any; index: number }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const title = item.title || item.titleEn || 'Untitled'
  const category = item.category || 'other'
  const config = getConfig(category)
  const imageUrl = item.imageUrl || item.primaryImage?.remoteUrl || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 12) * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
        <Link
          href={`/prompt?slug=${item.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/15 animated-border"
      >
        {/* Image area */}
        <div className={`relative aspect-square overflow-hidden bg-zinc-900`}>
          {/* Shimmer loading skeleton - shows while image is loading */}
          {imageUrl && !imgFailed && !imgLoaded && (
            <div className="absolute inset-0 image-loading-shimmer z-10" />
          )}

          {/* Real image */}
          {imageUrl && !imgFailed ? (
            <img
              src={imageUrl}
              alt={item.primaryImage?.altText || title}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgFailed(true)}
            />
          ) : null}

          {/* Fallback when no image or image failed */}
          {(imgFailed || !imageUrl) && (
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} flex flex-col items-center justify-center`}>
              <span className="text-5xl opacity-50 drop-shadow-lg">{config.emoji}</span>
              <span className="text-[10px] text-zinc-400 mt-1 opacity-60">No image</span>
            </div>
          )}

          {/* Gradient overlay at bottom for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

          {/* View count badge */}
          <div className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] text-zinc-300 font-medium flex items-center gap-1 transition-opacity group-hover:opacity-90">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
            {formatCount(item.viewCount ?? item.view_count ?? 0)}
          </div>

          {/* Like badge */}
          <div className="absolute top-2 left-2 rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[10px] text-red-400 font-medium flex items-center gap-1">
            ❤️ {formatCount(item.likeCount ?? item.like_count ?? 0)}
          </div>

          {/* Category label */}
          <div className="absolute bottom-2 left-2 rounded-md bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] text-zinc-300 transition-colors group-hover:bg-purple-600/30 group-hover:text-purple-200">
            {config.label}
          </div>

          {/* Hover overlay glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        </div>

        {/* Info area below image */}
        <div className="p-2.5 sm:p-3 transition-colors duration-200 group-hover:bg-purple-500/[0.03]">
          <h3 className="font-medium text-xs sm:text-sm text-zinc-200 line-clamp-2 group-hover:text-purple-400 transition-colors leading-snug min-h-[2.5rem]">
            {title}
          </h3>
        </div>
      </Link>
    </motion.div>
  )
}


function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
