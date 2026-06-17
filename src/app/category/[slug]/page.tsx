import Link from 'next/link'
import { loadMeta, loadItemsByCategory, type PromptListItem } from '@/lib/staticData'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const meta = await loadMeta()
  const cat = meta.categories.find(c => c.slug === slug)
  return {
    title: cat ? `${cat.name_zh} - Prompt Hub` : '分类 - Prompt Hub',
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10) || 1

  const meta = await loadMeta()
  const cat = meta.categories.find(c => c.slug === slug)
  const { items, total } = await loadItemsByCategory(slug, currentPage)
  const totalPages = Math.ceil(total / 20)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {cat?.name_zh || slug}
          </h1>
          <p className="text-gray-500">共 {total} 条提示词</p>
        </div>

        {/* 子分类（如果有） */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/category/${slug}`}
            className="px-4 py-2 rounded-full text-sm bg-blue-600 text-white"
          >
            全部
          </Link>
          {/* TODO: 显示二级分类 */}
        </div>

        {/* 结果列表 */}
        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📂</div>
            <p>该分类暂无数据，正在爬取中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map(item => (
              <Link
                key={item.slug}
                href={`/prompt/${item.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">
                  🖼️
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
                    {item.title_zh || item.title_en}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>👁️ {item.view_count}</span>
                    <span>❤️ {item.like_count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 分页 */}
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
      </div>
    </main>
  )
}
