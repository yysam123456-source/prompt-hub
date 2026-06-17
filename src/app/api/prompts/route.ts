import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '24')
  
  // 模拟数据
  const prompts = [
    {
      slug: 'demo-001',
      title_zh: '日系动漫角色',
      title_en: 'Anime Character',
      prompt_zh: '一个美丽的动漫女孩...',
      prompt_en: 'A beautiful anime girl...',
      category: '动漫游戏',
      image_url: 'https://via.placeholder.com/400x300',
      view_count: 1234,
      like_count: 89,
      favorite_count: 45,
    },
  ]
  
  const start = (page - 1) * limit
  const end = start + limit
  const items = prompts.slice(start, end)
  
  return NextResponse.json({
    items,
    total: prompts.length,
    page,
    pageSize: limit,
    hasMore: end < prompts.length,
  })
}
