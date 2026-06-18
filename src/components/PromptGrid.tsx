'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PromptGrid({ items, hideChinese }: { items: any[], hideChinese?: boolean }) {
  // Filter Chinese content if hideChinese is true
  const filteredItems = hideChinese
    ? (items || []).filter((item: any) => {
        const title = item.title?.en || item.title_en || ''
        // Must have English title, and title should not contain Chinese characters
        if (!title) return false
        return !/[\u4e00-\u9fff]/.test(title)
      })
    : (items || [])

  if (!filteredItems || filteredItems.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <div className="text-5xl mb-4">📭</div>
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {filteredItems.map((item: any, idx: number) => (
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
            {/* Image area */}
            <div className="aspect-square overflow-hidden bg-zinc-800 flex items-center justify-center">
              {item.primaryImage?.remoteUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.primaryImage.remoteUrl}
                  alt={item.title?.en || item.title_en || 'Prompt thumbnail'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e: any) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              {/* Fallback when no image or image fails to load */}
              <div className={`text-zinc-700 text-4xl ${item.primaryImage?.remoteUrl ? 'hidden' : 'flex'} h-full w-full items-center justify-center`}>
                🖼️
              </div>
            </div>
            {/* Info area */}
            <div className="p-3">
              <h3 className="font-medium text-sm text-zinc-200 line-clamp-2 group-hover:text-purple-400 transition-colors">
                {item.title?.en || item.title_en || item.title?.zh || item.title_zh || 'Untitled'}
              </h3>
              <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1.5">
                <span className="flex items-center gap-1">👁️ {item.viewCount ?? item.view_count ?? 0}</span>
                <span className="flex items-center gap-1">❤️ {item.likeCount ?? item.like_count ?? 0}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
