'use client'

// Client-side "browse everything" panel for the /category/ hub.
//
// This deliberately lives apart from src/app/category/page.tsx so that the page
// itself can stay a Server Component and export real metadata (title, canonical).
// A file marked 'use client' cannot export `metadata`, and the hub previously had
// none at all — it silently inherited the root layout's title.
//
// Category navigation is NOT here: it is server-rendered in the page so that the
// 16 pillar links exist in the static HTML instead of only after hydration.

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PromptGrid from '@/components/PromptGrid'

const SORT_TABS = [
  { key: 'latest', label: 'Latest' },
  { key: 'trending', label: 'Trending' },
  { key: 'most_liked', label: 'Most Liked' },
]

export default function CategoryBrowser() {
  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sort') || 'latest'

  const [allPrompts, setAllPrompts] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(24)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/prompts-light.json')
        const data = await res.json()
        // Compatible with both shapes: a bare array, or { meta, categories, prompts }
        const items = Array.isArray(data) ? data : (data.prompts || [])
        setAllPrompts(items)
      } catch (e) {
        console.error('Failed to load prompts', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const filtered = [...allPrompts]

    if (sortBy === 'trending') {
      filtered.sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
    } else if (sortBy === 'most_liked') {
      filtered.sort((a: any, b: any) => (b.likeCount || 0) - (a.likeCount || 0))
    } else {
      filtered.sort((a: any, b: any) => {
        const aTime = a.approvedAt ? new Date(a.approvedAt).getTime() : 0
        const bTime = b.approvedAt ? new Date(b.approvedAt).getTime() : 0
        return bTime - aTime
      })
    }

    setResults(filtered)
    setDisplayCount(24)
  }, [allPrompts, sortBy])

  const displayedResults = results.slice(0, displayCount)
  const hasMore = displayCount < results.length

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-zinc-200">Browse all prompts</h2>
      <p className="mb-6 text-sm text-zinc-400">
        {loading ? 'Loading…' : `${results.length} prompt(s) available`}
      </p>

      {/* Sort tabs. Sort is a view preference, not a distinct page, so these stay on
          the hub with ?sort= and rely on the hub's canonical to consolidate them. */}
      <div className="mb-10 flex flex-wrap gap-2">
        {SORT_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === 'latest' ? '/category/' : `/category/?sort=${tab.key}`}
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
                onClick={() => setDisplayCount((prev) => Math.min(prev + 24, results.length))}
                className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-6 py-3 text-sm text-zinc-400 transition-all hover:border-purple-500/50 hover:text-purple-300"
              >
                Load More ({results.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
