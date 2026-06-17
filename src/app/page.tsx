import Link from 'next/link'
import { loadMeta, loadListChunk, type PromptListItem } from '@/lib/staticData'

export const revalidate = 60

export default async function HomePage() {
  const meta = await loadMeta()
  const latest = await loadListChunk(1, 'latest')
  const hottest = await loadListChunk(1, 'hottest')

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Prompt Hub</h1>
        <p className="text-xl mb-8 text-blue-100">探索 {meta.total.toLocaleString()} 条 AI 绘画提示词</p>
        <form action="/search" method="GET" className="max-w-2xl mx-auto flex gap-2">
          <input
            name="q"
            type="text"
            placeholder="搜索提示词（中英文均可）..."
            className="flex-1 px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
          <button type="submit" className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition">
            搜索
          </button>
        </form>
      </section>

      {/* 分类导航 */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">热门分类</h2>
        <div className="flex flex-wrap gap-3">
          {meta.categories.slice(0, 12).map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-5 py-3 bg-white rounded-full shadow-sm hover:shadow-md hover:text-blue-600 transition border border-gray-100"
            >
              {cat.name_zh} <span className="text-gray-400 text-sm">（{cat.count}）</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新提示词 */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🆕 最新提示词</h2>
          <Link href="/search" className="text-blue-600 hover:underline">查看全部 →</Link>
        </div>
        <PromptGrid items={latest} />
      </section>

      {/* 热门提示词 */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800"> 🔥 热门提示词</h2>
          <Link href="/search?sort=hottest" className="text-blue-600 hover:underline">查看全部 →</Link>
        </div>
        <PromptGrid items={hottest} />
      </section>

      {/* 游戏素材专题 */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🎮 游戏素材专题</h2>
          <p className="text-gray-600 mb-6">精选游戏开发相关提示词，支持 Phaser / Three.js</p>
          <Link
            href="/category/game"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            浏览游戏素材 →
          </Link>
        </div>
      </section>
    </main>
  )
}

function PromptGrid({ items }: { items: PromptListItem[] }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-400 text-center py-12">暂无数据，正在爬取中...</p>
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map(item => (
        <Link
          key={item.slug}
          href={`/prompt/${item.slug}`}
          className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100"
        >
          <div className="aspect-square bg-gray-100 overflow-hidden">
            {item.primary_image?.remoteUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.primary_image.remoteUrl}
                alt={item.title_zh || item.title_en}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🖼️</div>
            )}
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
  )
}
