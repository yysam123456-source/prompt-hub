import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadDetail } from '@/lib/staticData'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<any> {
  const { slug } = await params
  const prompt = await loadDetail(slug)
  if (!prompt) return {}
  const title = prompt.title?.zh || prompt.title?.en || 'Prompt Hub'
  return {
    title: `${title} - Prompt Hub`,
    description: prompt.notes?.zh || prompt.notes?.en || '',
  }
}

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params
  const prompt = await loadDetail(slug)

  if (!prompt) notFound()

  const promptText = prompt.prompt_text || {}
  const negativeText = prompt.negative_prompt || {}
  const notes = prompt.notes || {}
  const images = prompt.images || []
  const primaryImage = prompt.primary_image

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-blue-600">Prompt Hub</Link>
          <div className="flex-1" />
          <form action="/search" method="GET" className="flex gap-2 max-w-md flex-1">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 面包屑 */}
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">首页</Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${prompt.category?.slug}`} className="hover:text-blue-600">
            {prompt.category?.name?.zh || prompt.category?.name?.en || '分类'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{prompt.title?.zh || prompt.title?.en}</span>
        </div>

        {/* 主图 */}
        {(primaryImage?.remoteUrl || images.length > 0) && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImage?.remoteUrl || images[0]?.remoteUrl || ''}
              alt={prompt.title?.zh || prompt.title?.en || ''}
              className="w-full max-h-[500px] object-contain bg-gray-50"
            />
          </div>
        )}

        {/* 标题和标签 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {prompt.title?.zh || prompt.title?.en}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            {prompt.category?.name?.zh || prompt.category?.name?.en}
          </span>
          {(prompt.tags || []).map((tag: any) => (
            <span key={tag.slug} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {tag.name?.zh || tag.name?.en}
            </span>
          ))}
        </div>

        {/* 统计数据 */}
        <div className="flex gap-6 mb-8 text-sm text-gray-500">
          <span>👁️ {prompt.viewCount || 0}</span>
          <span>❤️ {prompt.likeCount || 0}</span>
          <span>📤 {prompt.sendCount || 0}</span>
          <span>⭐ {prompt.favoriteCount || 0}</span>
        </div>

        {/* 提示词文本 */}
        {(promptText.zh || promptText.en) && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">💬 提示词</h2>
            {promptText.en && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">English</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(promptText.en)}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    复制
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                  {promptText.en}
                </pre>
              </div>
            )}
            {promptText.zh && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">中文说明</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(promptText.zh)}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    复制
                  </button>
                </div>
                <pre className="bg-blue-50 text-blue-900 p-4 rounded-xl text-sm overflow-x-auto whitespace-pre-wrap">
                  {promptText.zh}
                </pre>
              </div>
            )}
          </section>
        )}

        {/* 负面提示词 */}
        {(negativeText.zh || negativeText.en) && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🚫 负面提示词</h2>
            {(negativeText.en || negativeText.zh) && (
              <pre className="bg-red-50 text-red-900 p-4 rounded-xl text-sm overflow-x-auto whitespace-pre-wrap">
                {negativeText.en || negativeText.zh}
              </pre>
            )}
          </section>
        )}

        {/* 使用说明 */}
        {(notes.zh || notes.en) && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 使用说明</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-900">
              {notes.zh || notes.en}
            </div>
          </section>
        )}

        {/* 来源 */}
        {prompt.source_site && (
          <div className="text-sm text-gray-400 mt-8 pt-8 border-t border-gray-100">
            来源：{prompt.source_site}
          </div>
        )}
      </div>
    </main>
  )
}
