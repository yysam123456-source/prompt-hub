import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPrompt } from '@/lib/api'

interface PromptDetailPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const prompt = await getPrompt(params.slug)
  
  if (!prompt) {
    return { title: '提示词不存在' }
  }
  
  return {
    title: `${prompt.title_zh || prompt.title_en} - Prompt Hub`,
    description: prompt.prompt_zh?.slice(0, 160) || prompt.prompt_en?.slice(0, 160),
  }
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const prompt = await getPrompt(params.slug)
  
  if (!prompt) {
    notFound()
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 面包屑 */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500">
          <a href="/" className="hover:text-craftisle">首页</a>
          <span className="mx-2">/</span>
          <span>{prompt.category}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{prompt.title_zh || prompt.title_en}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：图片 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={prompt.image_url || 'https://via.placeholder.com/800x600'}
                alt={prompt.title_zh || prompt.title_en}
                className="w-full h-auto"
              />
              
              {/* 图片缩略图 */}
              {prompt.images && prompt.images.length > 1 && (
                <div className="p-4 flex gap-2">
                  {prompt.images.map((img: any, i: number) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={img.alt || `图片${i + 1}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：详情 */}
          <div className="space-y-6">
            {/* 标题和统计 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-4">
                {prompt.title_zh || prompt.title_en}
              </h1>
              
              <div className="flex items-center gap-6 text-gray-600">
                <button className="flex items-center gap-1 hover:text-red-500">
                  ❤️ {prompt.like_count || 0}
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500">
                  ⭐ {prompt.favorite_count || 0}
                </button>
                <span className="flex items-center gap-1">
                  👁️ {prompt.view_count || 0}
                </span>
              </div>
            </div>

            {/* Prompt文本 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">提示词</h2>
              
              {prompt.prompt_zh && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">中文</h3>
                  <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
                    {prompt.prompt_zh}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(prompt.prompt_zh)}
                    className="mt-2 text-sm text-craftisle hover:underline"
                  >
                    📋 复制
                  </button>
                </div>
              )}
              
              {prompt.prompt_en && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">English</h3>
                  <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
                    {prompt.prompt_en}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(prompt.prompt_en)}
                    className="mt-2 text-sm text-craftisle hover:underline"
                  >
                    📋 复制
                  </button>
                </div>
              )}
            </div>

            {/* 负面提示词 */}
            {(prompt.negative_prompt_zh || prompt.negative_prompt_en) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">负面提示词</h2>
                
                {prompt.negative_prompt_zh && (
                  <div className="mb-4">
                    <div className="bg-red-50 p-4 rounded whitespace-pre-wrap text-sm">
                      {prompt.negative_prompt_zh}
                    </div>
                  </div>
                )}
                
                {prompt.negative_prompt_en && (
                  <div className="mb-4">
                    <div className="bg-red-50 p-4 rounded whitespace-pre-wrap text-sm">
                      {prompt.negative_prompt_en}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 标签 */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">标签</h2>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-craftisle-light text-craftisle rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 来源 */}
            {(prompt.source_site || prompt.source_url) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">来源</h2>
                {prompt.source_site && (
                  <p className="text-sm text-gray-600">站点：{prompt.source_site}</p>
                )}
                {prompt.source_url && (
                  <a
                    href={prompt.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-craftisle hover:underline"
                  >
                    查看原始页面 →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
