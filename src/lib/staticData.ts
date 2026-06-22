/**
 * 静态数据加载层 — 读取 /data/prompts.json
 * 匹配 gpt-image-2-final.json 格式
 *
 * 策略：
 * - 构建时（Server Component）：用 fs.readFileSync 直接读文件
 * - 运行时（Client Component）：用 fetch() 从 /data/prompts.json 读取
 * - 静态导出：所有数据在构建时加载，运行时不需要再请求
 */

import type { PromptsData, PromptCard, PromptDetail, Category, SiteStats, PromptArgument } from './types'

// 构建时从文件系统读取（Server Component 中调用）
function loadJSONSync(): PromptsData {
  // 只在服务端执行
  if (typeof window !== 'undefined') {
    // 客户端：通过 fetch 加载（由 loadPromptsDataClient 处理）
    return { meta: { total: 0, source: '', updated_at: '' }, categories: [], prompts: [] }
  }

  const fs = require('fs')
  const path = require('path')

  // 尝试多个可能的路径
  const cwd = process.cwd()
  const possiblePaths = [
    path.join(cwd, 'public', 'data', 'prompts.json'),
    path.join(cwd, 'data', 'prompts.json'),
    path.join(cwd, '..', '..', 'public', 'data', 'prompts.json'),
    // Vercel 构建时的路径
    path.join(cwd, '.next', 'server', 'public', 'data', 'prompts.json'),
  ]

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf-8')
      const parsed = JSON.parse(raw)
      
      // 兼容两种数据格式：
      // 1. 数组格式：直接是 prompts 数组
      // 2. 对象格式：{ meta, categories, prompts }
      if (Array.isArray(parsed)) {
        // 从数组中提取分类
        const catMap = new Map()
        parsed.forEach((item: any) => {
          if (item.category) {
            catMap.set(item.category, {
              slug: item.category,
              label: item.categoryZh || item.category,
              labelEn: item.category || item.category,
            })
          }
        })
        
        return {
          meta: { total: parsed.length, source: 'prompts.sorry.ink', updated_at: new Date().toISOString() },
          categories: Array.from(catMap.values()),
          prompts: parsed,
        }
      } else if (parsed.prompts) {
        // 已经是正确格式
        return parsed as PromptsData
      } else {
        console.warn('[staticData] Unknown data format, using empty data')
        return { meta: { total: 0, source: '', updated_at: '' }, categories: [], prompts: [] }
      }
    }
  }

  // 如果文件不存在，返回空数据（构建时不会报错）
  console.warn('[staticData] prompts.json not found, using empty data')
  return { meta: { total: 0, source: '', updated_at: '' }, categories: [], prompts: [] }
}

/** 解析提示词中的参数占位符 {argument name="xxx" default="yyy"} */
export function parseArguments(prompt: string): PromptArgument[] {
  if (!prompt) return []
  const regex = /\{argument\s+name=["']([^"']+)["']\s+default=["']([^"']*)["']\}/g
  const args: PromptArgument[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(prompt)) !== null) {
    args.push({ name: match[1], defaultValue: match[2] })
  }
  return args
}

/** 替换提示词中的参数占位符 */
export function replaceArguments(prompt: string, values: Record<string, string>): string {
  if (!prompt) return ''
  return prompt.replace(
    /\{argument\s+name=["']([^"']+)["']\s+default=["']([^"']*)["']\}/g,
    (_, name) => values[name] ?? ''
  )
}

/** 加载完整数据（Server Component 用） */
export async function loadPromptsData(): Promise<PromptsData> {
  // 在静态导出模式下，始终从文件系统读取
  return loadJSONSync()
}

/** 获取网站统计 */
export async function loadStats(): Promise<SiteStats> {
  const data = loadJSONSync()
  const contributors = new Set(data.prompts.map(p => p.contributor).filter(Boolean))
  return {
    totalPrompts: data.meta.total,
    totalCategories: data.categories.length,
    totalContributors: contributors.size,
  }
}

/** 获取所有分类 */
export async function loadCategories(): Promise<Category[]> {
  const data = loadJSONSync()
  return data.categories
}

/** 获取提示词列表（支持分页+排序+分类筛选） */
export async function loadPromptList(options?: {
  page?: number
  pageSize?: number
  sort?: 'latest' | 'trending' | 'most_liked'
  category?: string
}): Promise<{ items: PromptCard[]; total: number }> {
  const data = loadJSONSync()
  let items = [...data.prompts]

  // 分类筛选
  if (options?.category && options.category !== 'all') {
    items = items.filter(p => p.category === options.category)
  }

  // 排序
  if (options?.sort === 'trending') {
    items.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
  } else if (options?.sort === 'most_liked') {
    items.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
  } else if (options?.sort === 'latest') {
    items.sort((a, b) => {
      const aTime = a.approvedAt ? new Date(a.approvedAt).getTime() : 0
      const bTime = b.approvedAt ? new Date(b.approvedAt).getTime() : 0
      return bTime - aTime
    })
  }

  const total = items.length
  const page = options?.page || 1
  const pageSize = options?.pageSize || 24
  const start = (page - 1) * pageSize
  const paginated = items.slice(start, start + pageSize)

  return { items: paginated as PromptCard[], total }
}

/** 获取提示词详情 */
export async function loadPromptDetail(slug: string): Promise<PromptDetail | null> {
  const data = loadJSONSync()
  const item = data.prompts.find(p => p.slug === slug)
  if (!item) return null
  return {
    ...item,
    arguments: parseArguments(item.prompt || ''),
  }
}

/** 获取相关提示词 */
export async function loadRelated(slug: string, category: string, limit = 8): Promise<PromptCard[]> {
  try {
    const data = loadJSONSync()
    const related = data.prompts
      .filter(p => p && p.slug !== slug && p.category === category)
      .slice(0, limit)
    return related as PromptCard[]
  } catch (e) {
    console.error('[staticData] loadRelated error:', e)
    return []
  }
}

/** 获取热门提示词 */
export async function loadTrending(limit = 8): Promise<PromptCard[]> {
  const { items } = await loadPromptList({ sort: 'trending', pageSize: limit })
  return items
}

/** 获取最新提示词 */
export async function loadLatest(limit = 8): Promise<PromptCard[]> {
  const { items } = await loadPromptList({ sort: 'latest', pageSize: limit })
  return items
}
