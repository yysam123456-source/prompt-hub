/**
 * 提示词详情页 —— 服务端渲染 + 静态路径。
 *
 * 背景：此前唯一形式是 /prompt?slug=xxx，页面为 'use client' + useSearchParams，
 * 服务端不输出正文、URL 带查询参数不可索引，导致 5000+ 提示词页全部零曝光。
 * 本页改为 /prompt/<slug>/，构建期预渲染为纯 HTML，输出完整提示词正文、
 * canonical、结构化数据与同分类内链。
 *
 * 旧的 /prompt?slug=xxx 页面保留作为交互入口，但不再进 sitemap。
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import fs from 'node:fs'
import path from 'node:path'
import { getCategoryConfig } from '@/lib/categories'

const SITE = 'https://imgprompt.craftisle.com'
const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'prompts.json')

// 纯静态导出：5000+ 详情页在构建期全部生成
export const dynamicParams = false

interface Prompt {
  id: string
  slug: string
  title: string
  titleEn?: string
  category?: string
  categoryZh?: string
  tags?: string[]
  prompt?: string
  promptZh?: string
  negativePrompt?: string
  imageUrl?: string
  images?: string[]
  contributor?: string
  approvedAt?: string
}

let _all: Prompt[] | null = null
let _bySlug: Map<string, Prompt> | null = null
let _byCategory: Map<string, Prompt[]> | null = null

function getAllPrompts(): Prompt[] {
  if (_all) return _all
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    const items = (Array.isArray(raw) ? raw : raw.prompts || raw.items || []) as Prompt[]
    // 只保留已审核且有 slug 的条目（与旧有的 approved 过滤保持一致）
    _all = items.filter((p) => Boolean(p?.slug) && Boolean(p?.approvedAt))
  } catch (e) {
    console.warn('[prompt-detail] failed to read prompts.json', e)
    _all = []
  }
  return _all
}

function getSlugIndex(): Map<string, Prompt> {
  if (_bySlug) return _bySlug
  const m = new Map<string, Prompt>()
  for (const p of getAllPrompts()) m.set(p.slug, p)
  _bySlug = m
  return m
}

function getCategoryIndex(): Map<string, Prompt[]> {
  if (_byCategory) return _byCategory
  const m = new Map<string, Prompt[]>()
  for (const p of getAllPrompts()) {
    const c = p.category || 'other'
    const arr = m.get(c)
    if (arr) arr.push(p)
    else m.set(c, [p])
  }
  _byCategory = m
  return m
}

/**
 * params.slug 是否已被 Next 解码在不同版本/场景下不一致，
 * 且 slug 含中文，decodeURIComponent 对非法 % 序列会抛错。
 * 两种形式都尝试，避免 5000+ 页面全部 404。
 */
function safeDecode(v: string): string {
  try {
    return decodeURIComponent(v)
  } catch {
    return v
  }
}

function findPrompt(slug: string): Prompt | undefined {
  const idx = getSlugIndex()
  return idx.get(slug) || idx.get(safeDecode(slug))
}

function relatedPrompts(current: Prompt, limit = 8): Prompt[] {
  const sameCat = getCategoryIndex().get(current.category || 'other') || []
  return sameCat.filter((p) => p.slug !== current.slug).slice(0, limit)
}

export function generateStaticParams() {
  return getAllPrompts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = findPrompt(slug)
  if (!p) return { title: 'Prompt Not Found' }

  const cat = getCategoryConfig(p.category || 'other')
  const title = `${p.title} — ${cat.label} AI Image Prompt`
  const body = (p.prompt || '').replace(/\s+/g, ' ').trim()
  const description = (
    body
      ? `${body.slice(0, 120)}${body.length > 120 ? '…' : ''} Copy this free ${cat.label} prompt for Midjourney, DALL·E, Stable Diffusion and GPT Image.`
      : `Copy this free ${cat.label} AI image prompt for Midjourney, DALL·E, Stable Diffusion and GPT Image. Includes the full prompt text and related ${cat.label.toLowerCase()} prompt ideas.`
  ).slice(0, 158)

  const canonical = `${SITE}/prompt/${encodeURIComponent(p.slug)}/`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'article',
      ...(p.imageUrl ? { images: [p.imageUrl] } : {}),
    },
  }
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const p = findPrompt(slug)
  if (!p) notFound()

  const cat = getCategoryConfig(p.category || 'other')
  const related = relatedPrompts(p)
  const canonical = `${SITE}/prompt/${encodeURIComponent(p.slug)}/`
  const images = (p.images?.length ? p.images : p.imageUrl ? [p.imageUrl] : []).slice(0, 6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    headline: p.title,
    url: canonical,
    ...(p.imageUrl ? { image: p.imageUrl } : {}),
    ...(p.approvedAt ? { datePublished: p.approvedAt } : {}),
    ...(p.contributor ? { author: { '@type': 'Person', name: p.contributor } } : {}),
    keywords: (p.tags || []).join(', '),
    text: p.prompt,
    isPartOf: { '@type': 'WebSite', name: 'Prompt Hub', url: SITE },
    genre: `${cat.label} image prompts`,
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: cat.label,
        item: `${SITE}/category/${p.category || 'other'}/`,
      },
      { '@type': 'ListItem', position: 3, name: p.title, item: canonical },
    ],
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${p.category || 'other'}/`} className="hover:text-zinc-300">
            {cat.label}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-400">{p.title}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{p.title}</h1>

        <p className="mt-4 text-sm text-zinc-500">
          {cat.label} prompt
          {p.contributor ? ` · by ${p.contributor}` : ''}
          {p.approvedAt ? ` · published ${new Date(p.approvedAt).toISOString().slice(0, 10)}` : ''}
        </p>

        {/* 提示词正文 —— 页面主体内容，服务端直接输出 */}
        {p.prompt && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-100">Prompt</h2>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-5 text-sm leading-relaxed text-zinc-200">
              {p.prompt}
            </pre>
          </section>
        )}

        {p.promptZh && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-100">中文版本</h2>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-5 text-sm leading-relaxed text-zinc-200">
              {p.promptZh}
            </pre>
          </section>
        )}

        {p.negativePrompt && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-100">Negative prompt</h2>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-5 text-sm leading-relaxed text-zinc-300">
              {p.negativePrompt}
            </pre>
          </section>
        )}

        {images.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-100">Example output</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${p.title} — example image generated from this prompt`}
                  className="w-full rounded-xl border border-zinc-800/60"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        )}

        {p.tags?.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-zinc-700/60 bg-zinc-800/80 px-3 py-1 text-xs text-zinc-400"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* 如何使用：为薄内容页提供必要的上下文说明 */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-100">How to use this prompt</h2>
          <ol className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-300">
            <li>1. Copy the full prompt text above.</li>
            <li>
              2. Paste it into your image model — Midjourney, DALL·E, Stable Diffusion, or GPT
              Image.
            </li>
            <li>3. Replace the subject, style or lighting words with your own to adapt it.</li>
            <li>4. Adjust aspect ratio and steps in your tool; the prompt itself is tool-neutral.</li>
            <li>5. Iterate on one variable at a time so you can tell which change mattered.</li>
          </ol>
        </section>

        {/* 同分类内链 */}
        {related.length > 0 && (
          <nav aria-label="Related prompts" className="mt-12 border-t border-zinc-800/60 pt-8">
            <h2 className="text-lg font-semibold text-zinc-200">
              More {cat.label} prompt ideas
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/prompt/${encodeURIComponent(r.slug)}/`}
                    className="text-purple-300 underline underline-offset-2 hover:no-underline"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav aria-label="Browse" className="mt-10 text-sm">
          <Link
            href={`/category/${p.category || 'other'}/`}
            className="text-zinc-400 underline underline-offset-2"
          >
            All {cat.label} prompts
          </Link>
          <span className="mx-3 text-zinc-700">·</span>
          <Link href="/" className="text-zinc-400 underline underline-offset-2">
            Prompt Hub home
          </Link>
        </nav>
      </article>
    </main>
  )
}
