export const runtime = 'edge'

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import PromptGrid from '@/components/PromptGrid'

interface Props {
  params: { slug: string }
  searchParams: { page?: string }
}

export default function CategoryPage({ params, searchParams }: Props) {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const { slug } = params
  const currentPage = parseInt(searchParams.page || '1', 10) || 1
  const pageSize = 20

  useEffect(() => {
    async function load() {
      try {
        // 加载所有列表数据，过滤出当前分类
        const allItems: any[] = []
        for (let p = 1; p <= 50; p++) {
          const res = await fetch(`/data/lists/latest-${p}.json`)
          if (!res.ok) break
          const chunk = await res.json()
          if (chunk.length === 0) break
          allItems.push(...chunk)
        }
        const filtered = allItems.filter(item => item.category_slug === slug)
        setTotal(filtered.length)
        const startIdx = (currentPage - 1) * pageSize
        setItems(filtered.slice(startIdx, startIdx + pageSize))
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
    <main className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-blue-600 shrink-0">Prompt Hub</Link>
          <form action="/search" method="GET" className="flex gap-2 flex-1 max-w-2xl">
            <input
              name="q"
              type="text"
              placeholder="搜索..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">搜索</button>
          </form>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{slug}</h1>
          <p className="text-gray-500">共 {total} 条提示词</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <PromptGrid items={items} />

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/category/${slug}?page=${currentPage - 1}`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                  >
                    上一页
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-gray-600">
                  第 {currentPage} / {totalPages} 页
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={`/category/${slug}?page=${currentPage + 1}`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                  >
                    下一页
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
