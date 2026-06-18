'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import PromptGrid from '@/components/PromptGrid'

// Client-side category filtering: fetches from /data/prompts.json
export default function CategoryPage({ searchParams }: { searchParams?: { slug?: string } }) {
  const categorySlug = searchParams?.slug || ''
  const [allPrompts, setAllPrompts] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load all prompts on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/prompts.json')
        const data = await res.json()
        const items = data.items || []
        setAllPrompts(items)

        // Extract unique categories
        const catMap = new Map()
        items.forEach((item: any) => {
          const cat = item.category || 'other'
          if (!catMap.has(cat)) {
            catMap.set(cat, {
              slug: cat,
              name: cat.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
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

  // Filter when allPrompts or categorySlug changes
  useEffect(() => {
    if (!categorySlug) {
      setResults(allPrompts)
      return
    }
    const filtered = (allPrompts || []).filter((item: any) =>
      (item.category || '').toLowerCase() === categorySlug.toLowerCase()
    )
    setResults(filtered)
  }, [allPrompts, categorySlug])

  const currentCategory = categories.find((c: any) => c.slug === categorySlug)

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
          </Link>
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
            {currentCategory ? currentCategory.name : 'All Categories'}
          </h1>
          <p className="mt-2 text-zinc-400">
            {loading ? 'Loading...' : `${results.length} prompt(s) in this category`}
          </p>
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 flex flex-wrap gap-2"
        >
          <Link
            href="/category"
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              !categorySlug
                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
            }`}
          >
            All
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.slug}
              href={`/category?slug=${cat.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                categorySlug === cat.slug
                  ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <PromptGrid items={results} />
        )}
      </div>
    </main>
  )
}
