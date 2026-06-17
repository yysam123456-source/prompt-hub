import { NextResponse, NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  
  // 模拟数据
  const prompt = {
    slug,
    title_zh: '示例提示词',
    title_en: 'Example Prompt',
    prompt_zh: '这是一个示例提示词...',
    prompt_en: 'This is an example prompt...',
    category: '动漫游戏',
    image_url: 'https://via.placeholder.com/800x600',
    view_count: 100,
    like_count: 10,
    favorite_count: 5,
  }
  
  return NextResponse.json(prompt)
}
