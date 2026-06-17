/**
 * 静态数据加载层
 * 服务端：直接读文件（fs）
 * 客户端：fetch JSON
 */

import { promises as fs } from 'fs'
import { join } from 'path'

export interface PromptListItem {
  slug: string
  title_zh: string
  title_en: string
  category_slug: string
  category_name_zh: string
  tags: string[]
  primary_image: { remoteUrl?: string; r2Key?: string }
  view_count: number
  like_count: number
  created_at: string
}

export interface MetaData {
  total: number
  categories: { slug: string; name_zh: string; count: number }[]
  tags: { slug: string; name_zh: string; count: number }[]
  updated_at: string
}

export interface SearchIndexDoc {
  id: string
  t: string
  c: string
  tags: string[]
}

export interface SearchIndex {
  version: string
  docs: SearchIndexDoc[]
}

const DATA_DIR = join(process.cwd(), 'public', 'data')

/** 服务端：直接读文件 */
async function readJson<T>(relativePath: string): Promise<T> {
  const fullPath = join(DATA_DIR, relativePath)
  const raw = await fs.readFile(fullPath, 'utf-8')
  return JSON.parse(raw) as T
}

/** 客户端：fetch */
async function fetchJson<T>(relativePath: string): Promise<T> {
  const res = await fetch(`/data/${relativePath}`)
  if (!res.ok) throw new Error(`Failed to fetch /data/${relativePath}`)
  return res.json() as Promise<T>
}

// 自动判断环境
const load = typeof window === 'undefined' ? readJson : fetchJson

/** 加载元数据 */
export async function loadMeta(): Promise<MetaData> {
  return load<MetaData>('meta.json')
}

/** 加载列表分片 */
export async function loadListChunk(
  page: number,
  sort: 'latest' | 'hottest' = 'latest'
): Promise<PromptListItem[]> {
  try {
    return await load<PromptListItem[]>(`lists/${sort}-${page}.json`)
  } catch {
    return []
  }
}

/** 加载搜索索引 */
export async function loadSearchIndex(): Promise<SearchIndex> {
  return load<SearchIndex>('search-index.json')
}

/** 前端搜索（基于索引过滤） */
export async function searchPrompts(
  query: string,
  category?: string,
): Promise<{ slug: string; title_zh: string; title_en: string }[]> {
  const index = await loadSearchIndex()
  const q = query.toLowerCase().trim()
  if (!q && !category) return []

  const results = index.docs.filter(doc => {
    if (category && doc.c !== category) return false
    if (q && !doc.t.toLowerCase().includes(q)) return false
    return true
  })

  return results.map(d => {
    const parts = d.t.split('\n')
    return { slug: d.id, title_zh: parts[0] || '', title_en: parts[1] || '' }
  })
}

/** 按分类加载列表 */
export async function loadItemsByCategory(
  categorySlug: string,
  page: number = 1,
): Promise<{ items: PromptListItem[]; total: number }> {
  const allItems: PromptListItem[] = []
  for (let p = 1; p <= 50; p++) {
    const chunk = await loadListChunk(p, 'latest')
    if (chunk.length === 0) break
    allItems.push(...chunk)
  }
  const filtered = allItems.filter(item => item.category_slug === categorySlug)
  const total = filtered.length
  const startIdx = (page - 1) * 20
  const items = filtered.slice(startIdx, startIdx + 20)
  return { items, total }
}

/** 加载详情 */
export async function loadDetail(slug: string): Promise<any> {
  try {
    return await load<any>(`details/${slug}.json`)
  } catch {
    return null
  }
}
