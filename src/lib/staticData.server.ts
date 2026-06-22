/**
 * 服务端数据加载 — 通过 fs.readFileSync 读取
 * 只在 Server Component / 构建时使用
 */

import type { PromptsData, PromptCard, PromptDetail, Category, SiteStats, PromptArgument } from './types'

function normalizeData(raw: any): PromptsData {
  if (Array.isArray(raw)) {
    const catMap = new Map<string, Category>()
    raw.forEach((item: any) => {
      if (item.category && !catMap.has(item.category)) {
        catMap.set(item.category, {
          id: item.category,
          slug: item.category,
          label: item.categoryZh || item.category,
          labelEn: item.category,
        })
      }
    })
    return {
      meta: { total: raw.length, source: 'prompts.sorry.ink', updated_at: new Date().toISOString() },
      categories: Array.from(catMap.values()),
      prompts: raw,
    }
  }
  if (raw && raw.prompts && Array.isArray(raw.prompts)) return raw as PromptsData
  return { meta: { total: 0, source: '', updated_at: '' }, categories: [], prompts: [] }
}

const fs = require('fs')
const path = require('path')

function getDataSync(): PromptsData {
  const cwd = process.cwd()
  const candidates = [
    path.join(cwd, 'public', 'data', 'prompts.json'),
    path.join(cwd, 'data', 'prompts.json'),
    path.join(cwd, '.next', 'server', 'public', 'data', 'prompts.json'),
  ]
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return normalizeData(JSON.parse(fs.readFileSync(p, 'utf-8')))
    } catch {}
  }
  console.warn('[staticData-server] prompts.json not found')
  return { meta: { total: 0, source: '', updated_at: '' }, categories: [], prompts: [] }
}

export async function loadPromptsData(): Promise<PromptsData> { return getDataSync() }

export async function loadStats(): Promise<SiteStats> {
  const data = getDataSync()
  const contributors = new Set(data.prompts.map(p => p.contributor).filter(Boolean))
  return { totalPrompts: data.meta.total, totalCategories: data.categories.length, totalContributors: contributors.size }
}

export async function loadCategories(): Promise<Category[]> { return getDataSync().categories }

export async function loadPromptList(options?: {
  page?: number; pageSize?: number; sort?: 'latest' | 'trending' | 'most_liked'; category?: string
}): Promise<{ items: PromptCard[]; total: number }> {
  const data = getDataSync()
  let items = [...data.prompts]
  if (options?.category && options.category !== 'all') items = items.filter(p => p.category === options.category)
  if (options?.sort === 'trending') items.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
  else if (options?.sort === 'most_liked') items.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
  else if (options?.sort === 'latest') items.sort((a, b) => (new Date(b.approvedAt || 0).getTime() - new Date(a.approvedAt || 0).getTime()))
  const total = items.length
  const page = options?.page || 1
  const pageSize = options?.pageSize || 24
  return { items: items.slice((page - 1) * pageSize, page * pageSize) as PromptCard[], total }
}

export async function loadPromptDetail(slug: string): Promise<PromptDetail | null> {
  const data = getDataSync()
  const item = data.prompts.find(p => p.slug === slug)
  if (!item) return null
  return { ...item, arguments: parseArguments(item.prompt || '') }
}

export async function loadRelated(slug: string, category: string, limit = 8): Promise<PromptCard[]> {
  try {
    return getDataSync().prompts.filter(p => p && p.slug !== slug && p.category === category).slice(0, limit) as PromptCard[]
  } catch { return [] }
}

export async function loadTrending(limit = 8): Promise<PromptCard[]> {
  const { items } = await loadPromptList({ sort: 'trending', pageSize: limit })
  return items
}

export async function loadLatest(limit = 8): Promise<PromptCard[]> {
  const { items } = await loadPromptList({ sort: 'latest', pageSize: limit })
  return items
}

export function parseArguments(prompt: string): PromptArgument[] {
  if (!prompt) return []
  const regex = /\{argument\s+name=["']([^"']+)["']\s+default=["']([^"']*)["']\}/g
  const args: PromptArgument[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(prompt)) !== null) args.push({ name: match[1], defaultValue: match[2] })
  return args
}

export function replaceArguments(prompt: string, values: Record<string, string>): string {
  if (!prompt) return ''
  return prompt.replace(/\{argument\s+name=["']([^"']+)["']\s+default=["']([^"']*)["']\}/g, (_, name) => values[name] ?? '')
}
