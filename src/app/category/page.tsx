'use client'

import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import PromptGrid from '@/components/PromptGrid'
import { useSearchParams } from 'next/navigation'

function CategoryContent() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('cat') || 'all'
  const sortBy = searchParams.get('sort') || 'latest'
  const [allPrompts, setAllPrompts] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(24)

  // Load all prompts on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/prompts.json')
        const data = await res.json()
        // 兼容两种数据格式：数组 或 { meta, categories, prompts }
        const items = Array.isArray(data) ? data : (data.prompts || [])
        setAllPrompts(items)

        // 提取分类
        const catMap = new Map()
        items.forEach((item: any) => {
          const cat = item.category || 'other'
          if (!catMap.has(cat)) {
            catMap.set(cat, {
              slug: cat,
              label: item.categoryZh || cat.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            })
          }
        })
        setCategories(Array.from(catMap.values()))
      } catch (e) {
        console.error('Failed to load prompts', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Filter and sort
  useEffect(() => {
    let filtered = [...allPrompts]

    // 分类筛选
    if (categorySlug !== 'all') {
      filtered = filtered.filter((item: any) =>
        (item.category || '').toLowerCase() === categorySlug.toLowerCase()
      )
    }

    // 排序
    if (sortBy === 'trending') {
      filtered.sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
    } else if (sortBy === 'most_liked') {
      filtered.sort((a: any, b: any) => (b.likeCount || 0) - (a.likeCount || 0))
    } else {
      // latest
      filtered.sort((a: any, b: any) => {
        const aTime = a.approvedAt ? new Date(a.approvedAt).getTime() : 0
        const bTime = b.approvedAt ? new Date(b.approvedAt).getTime() : 0
        return bTime - aTime
      })
    }

    setResults(filtered)
    setDisplayCount(24)
  }, [allPrompts, categorySlug, sortBy])

  const displayedResults = results.slice(0, displayCount)
  const hasMore = displayCount < results.length

  return (
    <main className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100 hidden sm:block">Prompt Hub</span>
          </Link>
          <div className="h-5 w-px bg-zinc-800" />
          <span className="text-sm text-zinc-400">Categories</span>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">Browse by Category</h1>
          <p className="mt-2 text-zinc-400">
            {loading ? 'Loading...' : `${results.length} prompt(s) found`}
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/category"
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              categorySlug === 'all'
                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
            }`}
          >
            All ({allPrompts.length})
          </Link>
          {categories.map((cat: any) => {
            const count = allPrompts.filter((p: any) => p.category === cat.slug).length
            return (
              <Link
                key={cat.slug}
                href={`/category?cat=${cat.slug}`}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  categorySlug === cat.slug
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
                }`}
              >
                {cat.label || cat.slug} ({count})
              </Link>
            )
          })}
        </div>

        {/* Sort tabs */}
        <div className="mb-10 flex gap-2">
          {[
            { key: 'latest', label: 'Latest' },
            { key: 'trending', label: 'Trending' },
            { key: 'most_liked', label: 'Most Liked' },
          ].map(tab => (
            <Link
              key={tab.key}
              href={`/category?cat=${categorySlug}&sort=${tab.key}`}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                sortBy === tab.key
                  ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">📭</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-300">No prompts found</h3>
            <p className="text-zinc-500">Try selecting a different category</p>
          </div>
        ) : (
          <>
            <PromptGrid items={displayedResults} />
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setDisplayCount(prev => Math.min(prev + 24, results.length))}
                  className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-6 py-3 text-sm text-zinc-400 transition-all hover:border-purple-500/50 hover:text-purple-300"
                >
                  Load More ({results.length - displayCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Loading...</div>}>
      <CategoryContent />
    </Suspense>
  )
}
