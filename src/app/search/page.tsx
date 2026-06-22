'use client'

import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import PromptGrid from '@/components/PromptGrid'
import { useSearchParams } from 'next/navigation'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const categorySlug = searchParams.get('cat') || 'all'
  const sortBy = searchParams.get('sort') || 'latest'
  
  const [allPrompts, setAllPrompts] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(query)

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
    if (!query && categorySlug === 'all') {
      setResults(allPrompts)
      return
    }

    let filtered = [...allPrompts]

    // 关键词搜索
    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter((item: any) => {
        const title = (item.title || '').toLowerCase()
        const titleEn = (item.titleEn || '').toLowerCase()
        const prompt = (item.prompt || '').toLowerCase()
        const category = (item.category || '').toLowerCase()
        const tags = (item.tags || []).join(' ').toLowerCase()
        return title.includes(q) || titleEn.includes(q) || prompt.includes(q) || category.includes(q) || tags.includes(q)
      })
    }

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
  }, [allPrompts, query, categorySlug, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.querySelector('input[name="q"]') as HTMLInputElement
    const newQ = input.value.trim()
    if (newQ) {
      const params = new URLSearchParams()
      params.set('q', newQ)
      if (categorySlug !== 'all') params.set('cat', categorySlug)
      if (sortBy !== 'latest') params.set('sort', sortBy)
      window.location.href = `/search?${params.toString()}`
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100 hidden sm:block">Prompt Hub</span>
          </Link>
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                name="q"
                type="text"
                defaultValue={query}
                placeholder="Search prompts..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
              />
            </div>
            <button type="submit" className="rounded-xl bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700">
              Search
            </button>
          </form>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            {query ? `Results for "${query}"` : 'All Prompts'}
          </h1>
          <p className="mt-2 text-zinc-400">
            {loading ? 'Loading...' : `${results.length} prompt(s) found`}
          </p>
        </motion.div>

        {/* Filters */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-zinc-500 mr-2 self-center">Category:</span>
              <Link
                href={`/search?q=${encodeURIComponent(query)}&sort=${sortBy}`}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  categorySlug === 'all'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
                }`}
              >
                All
              </Link>
              {categories.slice(0, 10).map((cat: any) => (
                <Link
                  key={cat.slug}
                  href={`/search?q=${encodeURIComponent(query)}&cat=${cat.slug}&sort=${sortBy}`}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    categorySlug === cat.slug
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
                  }`}
                >
                  {cat.label || cat.slug}
                </Link>
              ))}
            </div>

            {/* Sort tabs */}
            <div className="flex gap-2">
              {[
                { key: 'latest', label: 'Latest' },
                { key: 'trending', label: 'Trending' },
                { key: 'most_liked', label: 'Most Liked' },
              ].map(tab => (
                <Link
                  key={tab.key}
                  href={`/search?q=${encodeURIComponent(query)}&cat=${categorySlug}&sort=${tab.key}`}
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
          </motion.div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-300">No prompts found</h3>
            <p className="text-zinc-500 mb-6">Try different keywords or browse by category</p>
            <Link
              href="/category"
              className="rounded-xl border border-purple-500 bg-purple-500/20 px-6 py-3 text-sm text-purple-300 transition-colors hover:bg-purple-500/30"
            >
              Browse Categories →
            </Link>
          </div>
        ) : (
          <PromptGrid items={results} />
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
