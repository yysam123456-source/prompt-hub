import { NextResponse } from 'next/server'

interface PromptItem {
  id: string
  slug: string
  title: { zh: string; en?: string }
  prompt: string
  negativePrompt?: string
  source: string
  category: string
  tags: string[]
  coverUrl?: string
  likes: number
  views: number
}

// 从D1数据库获取prompt列表
async function getPromptsFromDB(
  page = 1,
  limit = 20,
  search = '',
  category = ''
): Promise<{ items: PromptItem[]; total: number }> {
  try {
    // @ts-ignore - Cloudflare D1 binding
    const db = process.env.DB || (globalThis as any).__db

    if (!db) {
      // 开发模式：回退到静态JSON数据
      return getStaticFallback(page, limit)
    }

    let whereClause = 'WHERE 1=1'
    const params: any[] = []

    if (search) {
      whereClause += ' AND (title LIKE ? OR prompt LIKE ? OR tags LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (category && category !== 'all') {
      whereClause += ' AND category = ?'
      params.push(category)
    }

    // 获取总数
    const countResult = await db.prepare(`SELECT COUNT(*) as count FROM prompts ${whereClause}`).bind(...params).first()
    const total = countResult ? (countResult as any).count : 0

    // 获取分页数据
    const offset = (page - 1) * limit
    const items = await db.prepare(
      `SELECT * FROM prompts ${whereClause} ORDER BY likes DESC LIMIT ? OFFSET ?`
    ).bind(...params, limit, offset).all()

    return {
      items: (items.results || []).map((row: any) => ({
        id: row.id,
        slug: row.slug,
        title: JSON.parse(row.title || '{}'),
        prompt: row.prompt,
        negativePrompt: row.negative_prompt,
        source: row.source,
        category: row.category,
        tags: JSON.parse(row.tags || '[]'),
        coverUrl: row.cover_url,
        likes: row.likes,
        views: row.views,
      })),
      total,
    }
  } catch (error) {
    console.error('DB error:', error)
    return getStaticFallback(page, limit)
  }
}

// 静态数据回退（开发用）
function getStaticFallback(page = 1, limit = 20): { items: PromptItem[]; total: number } {
  try {
    const fs = require('fs')
    const path = require('path')
    const dataPath = path.join(process.cwd(), '..', 'prompts_all.json')

    if (!fs.existsSync(dataPath)) {
      return { items: [], total: 0 }
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    const start = (page - 1) * limit
    const end = start + limit

    return {
      items: data.slice(start, end),
      total: data.length,
    }
  } catch {
    return { items: [], total: 0 }
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)

  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
  const search = url.searchParams.get('search') || ''
  const category = url.searchParams.get('category') || ''

  const result = await getPromptsFromDB(page, limit, search, category)

  return NextResponse.json(result)
}
