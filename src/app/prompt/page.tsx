'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

function PromptDetailContent() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')
  const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    async function load() {
      try {
        const res = await fetch(`/data/details/${slug}.json`)
        if (res.ok) {
          const data = await res.json()
          setDetail(data)
        }
      } catch (e) {
        console.error('Failed to load detail', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (!slug) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">未指定提示词</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-zinc-400 mb-4">未找到该提示词</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300">返回首页</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* 导航 */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
          </Link>
          <Link href="/search" className="ml-4 text-sm text-zinc-400 hover:text-purple-400">
            ← 返回搜索
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl mb-4">
            {detail.title_zh || detail.title_en}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-8">
            {detail.category_name_zh && (
              <span className="flex items-center gap-1">
                📂 {detail.category_name_zh}
              </span>
            )}
            {detail.view_count !== undefined && (
              <span className="flex items-center gap-1">👁️ {detail.view_count}</span>
            )}
            {detail.like_count !== undefined && (
              <span className="flex items-center gap-1">❤️ {detail.like_count}</span>
            )}
          </div>
        </motion.div>

        {/* 图片 */}
        {detail.primary_image?.remoteUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 overflow-hidden rounded-2xl border border-zinc-800"
          >
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={detail.primary_image.remoteUrl}
              alt={detail.title_zh || detail.title_en}
              className="w-full"
            />
          </motion.div>
        )}

        {/* 标签 */}
        {detail.tags && detail.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10 flex flex-wrap gap-2"
          >
            {detail.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-purple-500/50 hover:text-purple-300"
              >
                {tag}
              </Link>
            ))}
          </motion.div>
        )}

        {/* 提示词文本 */}
        {detail.prompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10"
          >
            <h2 className="mb-4 text-xl font-semibold text-zinc-100">提示词内容</h2>
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300 font-mono">
                {detail.prompt}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(detail.prompt)}
                className="absolute right-4 top-4 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-purple-500/50 hover:text-purple-300"
              >
                📋 复制
              </button>
            </div>
          </motion.div>
        )}

        {/* 来源链接 */}
        {detail.sourceUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href={detail.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-3 text-sm text-purple-400 transition-colors hover:border-purple-500/50"
            >
              查看来源 →
            </a>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function PromptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    }>
      <PromptDetailContent />
    </Suspense>
  )
}
