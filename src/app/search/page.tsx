'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PromptGrid from '@/components/PromptGrid'
import { useSearchParams } from 'next/navigation'
import Fuse from 'fuse.js'
import {
  FUSE_OPTIONS,
  getFilteredSuggestions,
  getSearchHistory,
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
  HOT_SEARCHES,
} from '@/lib/search'

interface PromptItem {
  id: string
  title: string
  titleEn?: string
  prompt: string
  category?: string
  tags?: string[]
  viewCount?: number
  likeCount?: number
  approvedAt?: string
  image?: string
  author?: string
}

const SORT_OPTIONS = [
  { key: 'latest', label: 'Latest' },
  { key: 'trending', label: 'Trending' },
  { key: 'most_liked', label: 'Most Liked' },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const initialCat = searchParams.get('cat') || 'all'
  const initialSort = searchParams.get('sort') || 'latest'

  const [allPrompts, setAllPrompts] = useState<PromptItem[]>([])
  const [results, setResults] = useState<PromptItem[]>([])
  const [categories, setCategories] = useState<{ slug: string; label: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialQ)
  const [categorySlug, setCategorySlug] = useState(initialCat)
  const [sortBy, setSortBy] = useState(initialSort)

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<{ text: string; type: 'title' | 'tag' | 'category' }[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggBoxRef = useRef<HTMLDivElement>(null)

  // Fuse index (memoized)
  const fuse = useMemo(() => {
    if (allPrompts.length === 0) return null
    return new Fuse(allPrompts, FUSE_OPTIONS)
  }, [allPrompts])

  // Load data
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/prompts.json')
        const data = await res.json()
        const items: PromptItem[] = Array.isArray(data) ? data : (data.prompts || [])
        setAllPrompts(items)

        // Extract categories
        const catMap = new Map<string, { slug: string; label: string }>()
        items.forEach((item: any) => {
          const cat = item.category || 'other'
          if (!catMap.has(cat)) {
            const label = cat.replace(/-/g, ' ').replace(/w/g, (c: string) => c.toUpperCase())
            catMap.set(cat, { slug: cat, label })
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

  // Search with fuse.js
  useEffect(() => {
    if (allPrompts.length === 0) return

    let filtered: PromptItem[] = [...allPrompts]

    // Apply category filter first
    if (categorySlug !== 'all') {
      filtered = filtered.filter(item => (item.category || '').toLowerCase() === categorySlug.toLowerCase())
    }

    // Apply search
    if (initialQ) {
      if (fuse) {
        const fuseResults = fuse.search(initialQ)
        const fuseIds = new Set(fuseResults.map((r: any) => r.item.id))
        if (categorySlug === 'all') {
          filtered = fuseResults.map((r: any) => r.item)
        } else {
          filtered = filtered.filter(item => fuseIds.has(item.id))
        }
      } else {
        const q = initialQ.toLowerCase()
        filtered = filtered.filter(item => {
          const title = (item.title || '').toLowerCase()
          const titleEn = (item.titleEn || '').toLowerCase()
          const prompt = (item.prompt || '').toLowerCase()
          const category = (item.category || '').toLowerCase()
          const tags = (item.tags || []).join(' ').toLowerCase()
          return title.includes(q) || titleEn.includes(q) || prompt.includes(q) || category.includes(q) || tags.includes(q)
        })
      }
    }

    // Sort
    if (sortBy === 'trending') {
      filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    } else if (sortBy === 'most_liked') {
      filtered.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    } else {
      filtered.sort((a, b) => {
        const aTime = a.approvedAt ? new Date(a.approvedAt).getTime() : 0
        const bTime = b.approvedAt ? new Date(b.approvedAt).getTime() : 0
        return bTime - aTime
      })
    }

    setResults(filtered)
  }, [allPrompts, initialQ, categorySlug, sortBy, fuse])

  // Update URL helper
  const updateUrl = (q: string, cat: string, sort: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (cat !== 'all') params.set('cat', cat)
    if (sort !== 'latest') params.set('sort', sort)
    window.location.href = '/search?' + params.toString()
  }

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const input = inputRef.current
    if (!input) return
    const newQ = input.value.trim()
    if (newQ) {
      addSearchHistory(newQ)
    }
    setSearchQuery(newQ)
    updateUrl(newQ, categorySlug, sortBy)
  }

  // Handle suggestion click
  const handleSuggestionClick = (text: string) => {
    setSearchQuery(text)
    setShowSuggestions(false)
    setShowHistory(false)
    addSearchHistory(text)
    updateUrl(text, categorySlug, sortBy)
  }

  // Handle input change (live suggestions)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (val.length >= 1 && allPrompts.length > 0) {
      const sugg = getFilteredSuggestions(allPrompts, val, 8)
      setSuggestions(sugg)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (searchQuery.length >= 1) {
      const sugg = getFilteredSuggestions(allPrompts, searchQuery, 8)
      setSuggestions(sugg)
      setShowSuggestions(true)
    } else {
      setShowHistory(true)
    }
  }

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggBoxRef.current &&
        !suggBoxRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCategoryChange = (cat: string) => {
    setCategorySlug(cat)
    updateUrl(searchQuery, cat, sortBy)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    updateUrl(searchQuery, categorySlug, sort)
  }

  const history = getSearchHistory()

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

          {/* Search input with autocomplete */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-2xl relative">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                name="q"
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="Search prompts..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                autoComplete="off"
              />

              {/* Suggestions / History dropdown */}
              {(showSuggestions || showHistory) && (
                <div
                  ref={suggBoxRef}
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl z-50 max-h-80 overflow-y-auto"
                >
                  {/* Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-1 text-xs font-medium text-zinc-500 uppercase">Suggestions</div>
                      {suggestions.map((s, i) => (
                        <button
                          key={"sugg-" + i}
                          type="button"
                          onClick={() => handleSuggestionClick(s.text)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                          {s.type === 'title' && <span className="text-purple-400 text-xs font-bold">T</span>}
                          {s.type === 'tag' && <span className="text-blue-400 text-xs font-bold">#</span>}
                          {s.type === 'category' && <span className="text-green-400 text-xs font-bold">C</span>}
                          <span className="truncate">{s.text}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Search history */}
                  {showHistory && history.length > 0 && (
                    <div className="p-2 border-t border-zinc-800">
                      <div className="flex items-center justify-between px-3 py-1">
                        <span className="text-xs font-medium text-zinc-500 uppercase">Recent</span>
                        <button
                          type="button"
                          onClick={() => { clearSearchHistory(); setShowHistory(false); }}
                          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      {history.map((h, i) => (
                        <div key={"hist-" + i} className="flex items-center group">
                          <button
                            type="button"
                            onClick={() => handleSuggestionClick(h)}
                            className="flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
                          >
                            <svg className="h-4 w-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="truncate">{h}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { removeSearchHistory(h); }}
                            className="px-2 py-1 text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hot searches */}
                  {showHistory && history.length === 0 && (
                    <div className="p-2">
                      <div className="px-3 py-1 text-xs font-medium text-zinc-500 uppercase">Trending</div>
                      {HOT_SEARCHES.slice(0, 8).map((term, i) => (
                        <button
                          key={"hot-" + i}
                          type="button"
                          onClick={() => handleSuggestionClick(term)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                          <span className={"text-xs font-bold w-4 " + (i < 3 ? 'text-orange-400' : 'text-zinc-500')}>{i + 1}</span>
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
            {initialQ ? "Results for \"" + initialQ + "\"" : 'All Prompts'}
          </h1>
          <p className="mt-2 text-zinc-400">
            {loading ? 'Loading...' : results.length + ' prompt(s) found'}
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
              <button
                onClick={() => handleCategoryChange('all')}
                className={'rounded-full border px-3 py-1 text-xs transition-colors ' + (
                  categorySlug === 'all'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
                )}
              >
                All
              </button>
              {categories.slice(0, 16).map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={'rounded-full border px-3 py-1 text-xs transition-colors ' + (
                    categorySlug === cat.slug
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
                  )}
                >
                  {cat.label || cat.slug}
                </button>
              ))}
            </div>

            {/* Sort tabs */}
            <div className="flex gap-2">
              {SORT_OPTIONS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleSortChange(tab.key)}
                  className={'rounded-lg border px-4 py-2 text-sm transition-colors ' + (
                    sortBy === tab.key
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
                  )}
                >
                  {tab.label}
                </button>
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
            <div className="flex justify-center gap-3">
              <Link
                href="/category"
                className="rounded-xl border border-purple-500 bg-purple-500/20 px-6 py-3 text-sm text-purple-300 transition-colors hover:bg-purple-500/30"
              >
                Browse Categories →
              </Link>
              {initialQ && (
                <button
                  onClick={() => { setSearchQuery(''); updateUrl('', categorySlug, sortBy) }}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm text-zinc-400 transition-colors hover:border-purple-500/50"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <PromptGrid items={results} highlightQuery={initialQ} />
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
