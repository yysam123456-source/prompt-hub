'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import PromptGrid from '@/components/PromptGrid'

// Client-side search: fetches from /data/prompts.json
export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q || ''
  const [allPrompts, setAllPrompts] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(query)

  // Load all prompts on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/prompts.json')
        const data = await res.json()
        setAllPrompts(data.items || [])
      } catch (e) {
        console.error('Failed to load prompts', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Filter when allPrompts or query changes
  useEffect(() => {
    if (!query) {
      setResults(allPrompts)
      return
    }
    const q = query.toLowerCase()
    const filtered = (allPrompts || []).filter((item: any) => {
      const title = (item.title?.en || item.title || '').toLowerCase()
      const prompt = (item.prompt || '').toLowerCase()
      const category = (item.category || '').toLowerCase()
      const tags = (item.tags || []).join(' ').toLowerCase()
      return title.includes(q) || prompt.includes(q) || category.includes(q) || tags.includes(q)
    })
    setResults(filtered)
  }, [allPrompts, query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.querySelector('input[name="q"]') as HTMLInputElement
    const newQ = input.value.trim()
    if (newQ) {
      window.location.href = `/search?q=${encodeURIComponent(newQ)}`
    }
  }

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
