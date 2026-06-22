'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// 匹配实际数据中的 category slug（来自 prompts.sorry.ink API）
const CATEGORY_CONFIG: Record<string, { label: string; gradient: string; emoji: string }> = {
  'other':              { label: '其他',       gradient: 'from-zinc-600/90 to-zinc-800/90',     emoji: '📦' },
  'graphic_design':     { label: '平面设计',   gradient: 'from-blue-600/90 to-indigo-900/90',    emoji: '✏️' },
  'anime_game':         { label: '动漫游戏',   gradient: 'from-pink-600/90 to-rose-900/90',      emoji: '🎮' },
  'photography':        { label: '摄影写真',   gradient: 'from-amber-600/90 to-orange-900/90',   emoji: '📷' },
  'branding_visual':    { label: '品牌视觉',   gradient: 'from-violet-600/90 to-purple-900/90',  emoji: '🎨' },
  'character':          { label: '角色人物',   gradient: 'from-rose-600/90 to-red-900/90',      emoji: '👤' },
  'illustration':       { label: '风格插画',   gradient: 'from-teal-600/90 to-cyan-900/90',     emoji: '🖌️' },
  'ecommerce':          { label: '电商营销',   gradient: 'from-green-600/90 to-emerald-900/90',  emoji: '🛒' },
  'tech_scifi':         { label: '科技科幻',   gradient: 'from-cyan-600/90 to-blue-900/90',     emoji: '🚀' },
  'novel_story':        { label: '小说推文',   gradient: 'from-fuchsia-600/90 to-pink-900/90',   emoji: '📖' },
  'architecture_interior': { label: '建筑室内', gradient: 'from-stone-600/90 to-warmGray-900/90', emoji: '🏛️' },
  'landscape_scene':    { label: '风景场景',   gradient: 'from-emerald-600/90 to-green-900/90',  emoji: '🏔️' },
  'food':               { label: '美食餐饮',   gradient: 'from-red-600/90 to-orange-900/90',     emoji: '🍜' },
  'cultural_products':  { label: '文创周边',   gradient: 'from-yellow-600/90 to-amber-900/90',  emoji: '🎁' },
  'creative_play':      { label: '创意玩法',   gradient: 'from-lime-600/90 to-yellow-900/90',   emoji: '💡' },
  'product_design':     { label: '产品设计',   gradient: 'from-slate-600/90 to-gray-900/90',    emoji: '📱' },
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
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgFailed(true)}
            />
          )}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

          {/* Fallback - gradient bg with emoji when no image or failed */}
          {(!cat.imageUrl || imgFailed) && (
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
              <span className="text-5xl opacity-60 drop-shadow-lg">{config.emoji}</span>
            </div>
          )}

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col justify-end h-full p-4">
            <h3 className="font-semibold text-white text-sm drop-shadow-lg">
              {config.label || cat.name}
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
