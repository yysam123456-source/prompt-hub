export const runtime = 'edge'

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import CategoryBar from '@/components/CategoryBar'
import PromptGrid from '@/components/PromptGrid'

interface Props {
  searchParams: { q?: string; category?: string }
}

export default function SearchPage({ searchParams }: Props) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const query = searchParams.q || ''
  const category = searchParams.category || ''

  useEffect(() => {
    async function search() {
      try {
        const res = await fetch('/data/search-index.json')
        const index = await res.json()
        const q = query.toLowerCase().trim()
        const filtered = (index.docs || []).filter((doc: any) => {
          if (category && doc.c !== category) return false
          if (q && !doc.t.toLowerCase().includes(q)) return false
          return true
        })
        // 加载详情
        const items = await Promise.all(
          filtered.slice(0, 100).map(async (doc: any) => {
            try {
              const res = await fetch(`/data/details/${doc.id}.json`)
              if (!res.ok) return null
              return await res.json()
            } catch {
              return null
            }
          })
        )
        setResults(items.filter(Boolean))
      } catch (e) {
        console.error('Search failed', e)
      } finally {
        setLoading(false)
      }
    }
    if (query || category) {
      search()
    } else {
      setLoading(false)
    }
  }, [query, category])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-blue-600 shrink-0">Prompt Hub</Link>
          <form action="/search" method="GET" className="flex gap-2 flex-1 max-w-2xl">
            <input
              name="q"
              type="text"
              defaultValue={query}
              placeholder="搜索提示词..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">搜索</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {query ? `搜索结果：${query}` : '全部提示词'}
          </h1>
          <p className="text-gray-500 mt-1">共找到 {results.length} 条结果</p>
        </div>

        <CategoryBar currentCategory={category} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <PromptGrid items={results} />
        )}
      </div>
    </main>
  )
}
