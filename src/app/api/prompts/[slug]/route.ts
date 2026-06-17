import { NextResponse } from 'next/server'

// 从D1数据库获取单条prompt详情
async function getPromptBySlug(slug: string) {
  try {
    // @ts-ignore - Cloudflare D1 binding
    const db = process.env.DB || (globalThis as any).__db

    if (!db) {
      // 开发模式：回退到静态JSON
      return getStaticFallback(slug)
    }

    const row = await db.prepare('SELECT * FROM prompts WHERE slug = ?').bind(slug).first()

    if (!row) {
      return null
    }

    return {
      id: row.id,
      slug: row.slug,
      title: JSON.parse(row.title || '{}'),
      prompt: row.prompt,
      negativePrompt: row.negative_prompt,
      source: row.source,
      category: row.category,
      tags: JSON.parse(row.tags || '[]'),
      coverUrl: row.cover_url,
      model: row.model,
      params: JSON.parse(row.params || '{}'),
      author: row.author,
      likes: row.likes,
      views: row.views,
      createdAt: row.created_at,
    }
  } catch (error) {
    console.error('DB error:', error)
    return getStaticFallback(slug)
  }
}

// 静态数据回退
function getStaticFallback(slug: string) {
  try {
    const fs = require('fs')
    const dataPath = require('path').join(process.cwd(), '..', 'prompts_all.json')

    if (!fs.existsSync(dataPath)) {
      return null
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    return data.find((p: any) => p.slug === slug) || null
  } catch {
    return null
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const prompt = await getPromptBySlug(slug)

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
  }

  return NextResponse.json(prompt)
}
