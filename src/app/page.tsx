'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import CategoryBar from '@/components/CategoryBar'
import PromptGrid from '@/components/PromptGrid'

export default function HomePage() {
  const [latest, setLatest] = useState<any[]>([])
  const [hottest, setHottest] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res1 = await fetch('/data/lists/latest-1.json')
        const latestData = await res1.json()
        setLatest(latestData)

        const res2 = await fetch('/data/lists/hottest-1.json')
        const hottestData = await res2.json()
        setHottest(hottestData)
      } catch (e) {
        console.error('Failed to load home data', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
              placeholder="搜索提示词..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">搜索</button>
          </form>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero 区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">探索 3.2万+ AI 绘画提示词</h1>
          <p className="text-lg text-gray-500 mb-8">免费使用，支持中英文搜索</p>
          <form action="/search" method="GET" className="max-w-2xl mx-auto flex gap-2">
            <input
              name="q"
              type="text"
              placeholder="输入关键词搜索..."
              className="flex-1 px-6 py-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button type="submit" className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 shadow-sm">搜索</button>
          </form>
        </div>

        {/* 热门分类 */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📂 热门分类</h2>
          <CategoryBar />
        </section>

        {/* 最新提示词 */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🆕 最新提示词</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <PromptGrid items={latest} />
          )}
        </section>

        {/* 热门提示词 */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🔥 热门提示词</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <PromptGrid items={hottest} />
          )}
        </section>
      </div>
    </main>
  )
}
