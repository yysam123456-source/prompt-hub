import Link from 'next/link'
import type { Prompt } from '@/lib/types'

interface PromptListProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function PromptList({ searchParams }: PromptListProps) {
  const page = Number(searchParams?.page) || 1
  const category = searchParams?.category as string || ''
  const search = searchParams?.q as string || ''
  
  // 从API获取数据（暂时用模拟数据）
  const data = await getPrompts({ page, limit: 24, category, search })
  
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          提示词列表
          {category && <span className="text-lg font-normal text-gray-600 ml-2">→ {category}</span>}
        </h2>
        <p className="text-sm text-gray-500">
          共 {data.total} 条
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.items.map((prompt: Prompt) => (
          <Link
            key={prompt.slug}
            href={`/prompt/${prompt.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={prompt.image_url || 'https://via.placeholder.com/400x300'}
                  alt={prompt.title_zh || prompt.title_en || '提示词示例'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm font-medium">
                    {prompt.category}
                  </p>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {prompt.title_zh || prompt.title_en}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {prompt.prompt_zh || prompt.prompt_en}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>👁️ {prompt.view_count || 0}</span>
                  <span>❤️ {prompt.like_count || 0}</span>
                  <span>⭐ {prompt.favorite_count || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 分页 */}
      {data.hasMore && (
        <div className="flex justify-center mt-12 gap-2">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}${category ? `&category=${category}` : ''}${search ? `&q=${search}` : ''}`}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-craftisle hover:text-white transition-colors"
            >
              上一页
            </Link>
          )}
          <span className="px-4 py-2">
            {page} / {Math.ceil(data.total / 24)}
          </span>
          {data.hasMore && (
            <Link
              href={`/?page=${page + 1}${category ? `&category=${category}` : ''}${search ? `&q=${search}` : ''}`}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-craftisle hover:text-white transition-colors"
            >
              下一页
            </Link>
          )}
        </div>
      )}
    </section>
  )
}

async function getPrompts(params: {
  page?: number
  limit?: number
  category?: string
  search?: string
}) {
  // 暂时返回模拟数据
  // 后续连接D1后，改为从API获取
  return {
    items: [
      {
        slug: 'liblib-demo-001',
        title_zh: '日系动漫角色',
        title_en: 'Anime Character',
        prompt_zh: '一个美丽的动漫女孩，蓝色长发，大眼睛...',
        prompt_en: 'A beautiful anime girl, blue long hair...',
        category: '动漫游戏',
        image_url: 'https://via.placeholder.com/400x300',
        view_count: 1234,
        like_count: 89,
        favorite_count: 45,
      },
      // 更多模拟数据...
    ],
    total: 100,
    page: params.page || 1,
    pageSize: params.limit || 24,
    hasMore: true,
  }
}
