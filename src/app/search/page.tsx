import Link from 'next/link'
import { Suspense } from 'react'
import { searchPrompts, loadMeta, type MetaData } from '@/lib/staticData'

interface Props {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams
  return {
    title: q ? `搜索：${q} - Prompt Hub` : '搜索 - Prompt Hub',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const query = params.q || ''
  const category = params.category || ''
  const results = query ? await searchPrompts(query, category || undefined) : []

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
        {/* 搜索结果统计 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {query ? `搜索结果：${query}` : '全部提示词'}
          </h1>
          <p className="text-gray-500 mt-1">共找到 {results.length} 条结果</p>
        </div>

        {/* 筛选栏 */}
        <Suspense fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse" />}>
          <FilterBar currentCategory={category} />
        </Suspense>

        {/* 结果列表 */}
        {results.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {query ? (
              <>
                <div className="text-5xl mb-4">🔍</div>
                <p>未找到与「{query}」相关的结果</p>
                <p className="text-sm mt-2">试试其他关键词</p>
              </>
            ) : (
              <p>请输入搜索关键词</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map(item => (
              <Link
                key={item.slug}
                href={`/prompt/${item.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">
                  🖼️
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-800 line-clamp-2">
                    {item.title_zh || item.title_en}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

async function FilterBar({ currentCategory }: { currentCategory: string }) {
  const meta: MetaData = await loadMeta()
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href="/search"
        className={`px-4 py-2 rounded-full text-sm transition ${
          !currentCategory ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        全部
      </Link>
      {meta.categories.map(cat => (
        <Link
          key={cat.slug}
          href={`/search?category=${cat.slug}`}
          className={`px-4 py-2 rounded-full text-sm transition ${
            currentCategory === cat.slug ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {cat.name_zh} ({cat.count})
        </Link>
      ))}
    </div>
  )
}
