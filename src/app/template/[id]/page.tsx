/**
 * 模板详情页 —— 服务端渲染 + 静态路径。
 *
 * 背景：此前模板详情只有 /template?id=xxx 一种形式，且页面是 'use client'
 * + useSearchParams —— 服务端不输出任何内容、URL 带查询参数不可索引，
 * 导致全部模板页在 Google 侧零曝光。
 * 本页改为静态路径 /template/<templateId>/，构建时预渲染为纯 HTML：
 * 服务端输出完整正文、canonical、结构化数据，并给出同分类模板内链。
 *
 * 旧的 /template?id=xxx 页面保留作为交互入口，但不再进 sitemap，
 * 站内链接统一改为指向本页。
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import fs from 'node:fs'
import path from 'node:path'
import { getCategoryConfig } from '@/lib/categories'

const SITE = 'https://imgprompt.craftisle.com'
const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'templates.json')

// 纯静态导出（next.config: output: 'export'）：所有模板页在构建期生成
export const dynamicParams = false

interface Template {
  id: string
  templateId: string
  anchor: string
  title: string
  description: string
  category: string
  cover: string
  styles: string[]
  scenes: string[]
  tags: string[]
  useWhen: string
  guidance: string[]
  pitfalls: string[]
  exampleCases: number[]
}

let _cache: Template[] | null = null

function getAllTemplates(): Template[] {
  if (_cache) return _cache
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    _cache = (Array.isArray(raw) ? raw : raw.templates || []) as Template[]
  } catch (e) {
    console.warn('[template-detail] failed to read templates.json', e)
    _cache = []
  }
  return _cache
}

const slugOf = (t: Template): string => t.templateId || t.id

function findTemplate(id: string): Template | null {
  return getAllTemplates().find((t) => slugOf(t) === id) || null
}

/** 同分类优先的模板内链：让每个模板页都有稳定的入站/出站内部链接 */
function relatedTemplates(current: Template, limit = 6): Template[] {
  const all = getAllTemplates().filter((t) => slugOf(t) !== slugOf(current))
  const sameCat = all.filter((t) => t.category === current.category)
  const rest = all.filter((t) => t.category !== current.category)
  return [...sameCat, ...rest].slice(0, limit)
}

export function generateStaticParams() {
  return getAllTemplates()
    .map((t) => ({ id: slugOf(t) }))
    .filter((p) => Boolean(p.id))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const t = findTemplate(id)
  if (!t) return { title: 'Template Not Found' }

  const cat = getCategoryConfig(t.category)
  const title = `${t.title} — AI Image Prompt Template`
  const description =
    `${t.description} Copy-ready ${cat.label} prompt template with step-by-step guidance, styles and common pitfalls for Midjourney, DALL·E, Stable Diffusion and GPT Image. Free, no signup.`.slice(
      0,
      158
    )

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/template/${encodeURIComponent(id)}/` },
    openGraph: {
      title,
      description,
      type: 'article',
      ...(t.cover ? { images: [t.cover] } : {}),
    },
  }
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const t = findTemplate(id)
  if (!t) notFound()

  const cat = getCategoryConfig(t.category)
  const related = relatedTemplates(t)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: t.title,
    description: t.description,
    url: `${SITE}/template/${encodeURIComponent(id)}/`,
    ...(t.cover ? { image: t.cover } : {}),
    keywords: [...(t.styles || []), ...(t.scenes || []), ...(t.tags || [])].join(', '),
    isPartOf: { '@type': 'WebSite', name: 'Prompt Hub', url: SITE },
    about: { '@type': 'Thing', name: `${cat.label} image prompts` },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Templates', item: `${SITE}/template/` },
      {
        '@type': 'ListItem',
        position: 3,
        name: t.title,
        item: `${SITE}/template/${encodeURIComponent(id)}/`,
      },
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

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 面包屑 */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/template/" className="hover:text-zinc-300">
            Templates
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-400">{t.title}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-300">{t.description}</p>

        {/* 分类归属 */}
        <p className="mt-4 text-sm text-zinc-500">
          Category:{' '}
          <Link
            href={`/category/${t.category}/`}
            className="text-purple-300 underline underline-offset-2 hover:no-underline"
          >
            {cat.label} image prompts
          </Link>
        </p>

        {t.cover && (
          <img
            src={t.cover}
            alt={`${t.title} — example result generated from this prompt template`}
            className="mt-8 w-full rounded-2xl border border-zinc-800/60"
            loading="lazy"
          />
        )}

        {/* Style / Scene / Tag chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {(t.styles || []).map((s) => (
            <span
              key={s}
              className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300"
            >
              {s}
            </span>
          ))}
          {(t.scenes || []).map((s) => (
            <span
              key={s}
              className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300"
            >
              {s}
            </span>
          ))}
          {(t.tags || [])
            .filter((x) => !(t.styles || []).includes(x) && !(t.scenes || []).includes(x))
            .map((x) => (
              <span
                key={x}
                className="rounded-full border border-zinc-700/60 bg-zinc-800/80 px-3 py-1 text-xs text-zinc-400"
              >
                {x}
              </span>
            ))}
        </div>

        {/* When to Use */}
        {t.useWhen && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-zinc-100">When to Use</h2>
            <p className="mt-3 leading-relaxed text-zinc-300">{t.useWhen}</p>
          </section>
        )}

        {/* Guidance */}
        {t.guidance?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-zinc-100">Prompt Guidance</h2>
            <ol className="mt-4 space-y-3">
              {t.guidance.map((g, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-2xl border border-zinc-800/40 bg-zinc-900/50 p-5"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-black text-blue-400">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-zinc-300">{g}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Pitfalls */}
        {t.pitfalls?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-zinc-100">Common Pitfalls</h2>
            <ul className="mt-4 space-y-3">
              {t.pitfalls.map((p, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-zinc-800/40 bg-zinc-900/50 p-5 text-sm leading-relaxed text-zinc-300"
                >
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 同分类模板内链 */}
        {related.length > 0 && (
          <nav aria-label="Related templates" className="mt-14 border-t border-zinc-800/60 pt-8">
            <h2 className="text-lg font-semibold text-zinc-200">Related prompt templates</h2>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
              {related.map((r) => (
                <li key={slugOf(r)}>
                  <Link
                    href={`/template/${encodeURIComponent(slugOf(r))}/`}
                    className="text-purple-300 underline underline-offset-2 hover:no-underline"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* 返回入口 */}
        <nav aria-label="Browse" className="mt-10 text-sm">
          <Link href="/template/" className="text-zinc-400 underline underline-offset-2">
            Browse all prompt templates
          </Link>
          <span className="mx-3 text-zinc-700">·</span>
          <Link href="/" className="text-zinc-400 underline underline-offset-2">
            Prompt Hub home
          </Link>
        </nav>
      </div>
    </main>
  )
}
