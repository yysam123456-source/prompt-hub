'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PromptGrid from '@/components/PromptGrid'
import CategoryBar from '@/components/CategoryBar'

function CategoryContent() {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const slug = searchParams.get('slug')
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [categoryName, setCategoryName] = useState('')

  const currentPage = parseInt(searchParams.get('page') || '1', 10) || 1
  const pageSize = 20

  useEffect(() => {
    async function load() {
      try {
        // Get category list from API (for category name)
        if (slug) {
          const catRes = await fetch('/api/categories')
          const catData = await catRes.json()
          const cat = (catData || []).find((c: any) => c.slug === slug)
          if (cat) setCategoryName(cat.name_en || cat.name_zh)
        }

        // Use API proxy for server-side filtering + pagination
        const url = new URL('/api/prompts', window.location.origin)
        if (slug) url.searchParams.set('category', slug)
        url.searchParams.set('page', String(currentPage))
        url.searchParams.set('pageSize', String(pageSize))
        
        const res = await fetch(url.toString())
        const data = await res.json()
        const fetchedItems = data.items || []
        setItems(fetchedItems)
        setTotal(data.total || fetchedItems.length)
      } catch (e) {
        console.error('Failed to load category data', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, currentPage])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Navigation bar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
          </Link>
          <form action="/search" method="GET" className="flex gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                name="q"
                type="text"
                placeholder="Search..."
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
        {/* Category navigation */}
        <CategoryBar currentCategory={slug || undefined} hideChinese />

        <div className="mb-12 mt-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            {categoryName || 'All Categories'}
          </h1>
          <p className="text-zinc-400">{total} prompts</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <PromptGrid items={items} hideChinese />

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/category?slug=${slug}&page=${currentPage - 1}`}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-purple-500/50 hover:text-purple-300"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-500">
                  Page {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={`/category?slug=${slug}&page=${currentPage + 1}`}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-purple-500/50 hover:text-purple-300"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function CategoryPage() {
  return <CategoryContent />
}
