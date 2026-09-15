/**
 * 模板集线器页 —— 服务端渲染 + 静态路径。
 *
 * 背景：本页此前是 'use client' + useSearchParams，读 ?id= 并以 data[0] 兜底，
 * 结果裸路径 /template/ 渲染的是「第一个模板的详情」，与 /template/<first-id>/ 内容重复；
 * 同时 'use client' 文件无法导出 metadata，本页连自己的 title/canonical 都没有，
 * 却挂在 sitemap 的 0.7 权重上，还被 /template/[id]/ 的面包屑当作父级链接指向。
 *
 * 现在改造成真正的集线器：服务端读取 templates.json，静态输出全部 22 个模板的链接，
 * 让每个模板页都有一条来自父级页面的入站内链（此前它们只靠 sitemap 被发现）。
 *
 * 旧的 /template?id=xxx 交互入口一并移除 —— 所有站内链接本来就指向
 * /template/<templateId>/（已核对，无一处使用查询参数形式），该形式只是重复内容。
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'node:fs'
import path from 'node:path'
import { getCategoryConfig } from '@/lib/categories'

const SITE = 'https://imgprompt.craftisle.com'
const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'templates.json')

// 纯静态导出（next.config: output: 'export'）：构建期读盘并预渲染
export const dynamic = 'force-static'

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

function getAllTemplates(): Template[] {
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    return (Array.isArray(raw) ? raw : raw.templates || []) as Template[]
  } catch (e) {
    console.warn('[template-hub] failed to read templates.json', e)
    return []
  }
}

export const metadata: Metadata = {
  title: 'AI Image Prompt Templates & Blueprints',
  description:
    'Reusable AI image prompt templates — poster layouts, infographics, UI screenshots, character sheets and more. Each blueprint ships with guidance, pitfalls and examples.',
  alternates: {
    canonical: `${SITE}/template/`,
  },
  openGraph: {
    title: 'AI Image Prompt Templates & Blueprints | Prompt Hub',
    description:
      'Reusable AI image prompt templates with guidance, pitfalls and worked examples for Midjourney, DALL-E and Stable Diffusion.',
    url: `${SITE}/template/`,
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function TemplateHubPage() {
  const templates = getAllTemplates()

  // 按分类分组，保持 CATEGORY 顺序稳定
  const grouped = new Map<string, Template[]>()
  for (const t of templates) {
    const key = t.category || 'other'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(t)
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Templates', item: `${SITE}/template/` },
    ],
  }

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Image Prompt Templates & Blueprints',
    description:
      'A catalogue of reusable AI image prompt templates, each with structural guidance, common pitfalls and worked examples.',
    url: `${SITE}/template/`,
    hasPart: templates.map((t) => ({
      '@type': 'CreativeWork',
      name: t.title,
      description: t.description,
      url: `${SITE}/template/${encodeURIComponent(t.templateId)}/`,
    })),
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-400">Templates</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          AI Image Prompt Templates
        </h1>
        {/* 服务端渲染的静态正文：此前本页是客户端组件，无 JS 时只有加载动画 */}
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
          Blueprint templates are reusable prompt recipes. Each one bundles the structural
          rules, style guidance, common pitfalls and worked examples for a specific kind of
          image — posters, infographics, UI screenshots, character sheets and more. Open a
          template to read its full guidance, then adapt it to your own subject.
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          {templates.length} templates across {grouped.size} categories. Looking for a
          subject instead of a structure?{' '}
          <Link
            href="/category/"
            className="text-purple-300 underline underline-offset-2 hover:no-underline"
          >
            Browse by category
          </Link>
          .
        </p>

        {[...grouped.entries()].map(([catSlug, items]) => {
          const cfg = getCategoryConfig(catSlug)
          return (
            <section key={catSlug} className="mt-14">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-7 w-1 rounded-full bg-gradient-to-b from-purple-500 to-pink-600" />
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                  <span aria-hidden="true">{cfg.emoji}</span> {cfg.label}
                </h2>
                <span className="rounded-full bg-zinc-800/60 px-2.5 py-0.5 text-xs text-zinc-400">
                  {items.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <Link
                    key={t.templateId}
                    href={`/template/${encodeURIComponent(t.templateId)}/`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50"
                  >
                    {t.cover && (
                      <div className="aspect-video overflow-hidden bg-zinc-900">
                        <img
                          src={t.cover}
                          alt={`${t.title} — example result generated from this prompt template`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-semibold text-zinc-100 transition-colors group-hover:text-purple-200">
                        {t.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
                        {t.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {(t.styles || []).slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-300"
                          >
                            {s}
                          </span>
                        ))}
                        <span className="text-xs text-zinc-600">
                          {t.guidance?.length || 0} tips · {t.pitfalls?.length || 0} pitfalls
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {templates.length === 0 && (
          <p className="mt-14 text-zinc-400">
            Templates are being prepared. Meanwhile you can{' '}
            <Link href="/category/" className="text-purple-300 underline underline-offset-2">
              browse prompts by category
            </Link>
            .
          </p>
        )}
      </div>
    </main>
  )
}
