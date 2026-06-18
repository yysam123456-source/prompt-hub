import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PromptGrid({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <div className="text-5xl mb-4">📂</div>
        <p>暂无数据</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item: any, idx: number) => (
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
            {/* 图片区域 */}
            <div className="aspect-square overflow-hidden bg-zinc-800 flex items-center justify-center">
              {item.primary_image?.remoteUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.primary_image.remoteUrl}
                  alt={item.title_zh || item.title_en}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="text-zinc-700 text-4xl">🖼️</div>
              )}
            </div>
            {/* 信息区域 */}
            <div className="p-3">
              <h3 className="font-medium text-sm text-zinc-200 line-clamp-2 group-hover:text-purple-400 transition-colors">
                {item.title_zh || item.title_en}
              </h3>
              <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1.5">
                <span className="flex items-center gap-1">👁️ {item.view_count || 0}</span>
                <span className="flex items-center gap-1">❤️ {item.like_count || 0}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
