import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import fs from 'node:fs'
import path from 'node:path'
import PromptGrid from '@/components/PromptGrid'
import { CATEGORY_CONFIG, CATEGORY_ORDER, getCategoryConfig } from '@/lib/categories'
import { CATEGORY_CONTENT } from '@/lib/categoryContent'

const SITE = 'https://imgprompt.craftisle.com'
const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'prompts-light.json')

// Static export: enumerate every category slug at build time.
export const dynamicParams = false

export function generateStaticParams() {
  return CATEGORY_ORDER.map((slug) => ({ slug }))
}

/**
 * 🔴 2026-11-04（DEBT-49）：分类页的「出链上限」就是 0 曝光的根因。
 *
 * 实测（2026-11-03）：16 个分类支柱页的出链去重后**只覆盖 648 个 prompt 页 / 5,679 = 11.4%**
 * —— 88.6% 的 prompt 页**只存在于 sitemap，没有任何内链**。
 * 抓取路径是：首页 → 分类页 →（只到 48 条为止）
 * ⇒ Google 在 8 站共用一个 domain property 的抓取预算里，优先抓主站与有流量的站，
 *   这 5,031 个「只有 sitemap 入口」的深层页很可能根本没被爬到 ⇒ 不索引 ⇒ 0 曝光。
 *
 * 修法取舍（两个方案）：
 *   A. 分类页出链全部 —— 零新增页面、零构建量增长、覆盖 11.4% → 100%。
 *   B. 分类页分页（/category/<slug>/p/N/）—— 页面体量不变，但要新增 ~100 个静态页。
 * ⇒ 选 A。除了「零构建量增长」这个决定性理由外，还有一条实测的部署约束：
 *   本仓库的静态导出产物有 **10,469 个文件**，而 Cloudflare Pages hobby 有文件数上限
 *   （历史上就为此加过 scripts/prune-rsc-payloads.js 来裁剪 RSC 负载）。
 *   再加 100 个页面会同时逼近「文件数上限」与「构建时限」两条红线，
 *   而出链全部**一个文件都不多** ⇒ 零部署风险。
 *   A 也不能把 1,243 张卡片全渲染出来（HTML 巨大 + 1,243 个 <img>），
 *   所以做法是：**48 张漂亮卡片照旧（UX 与图片请求量完全不变）+ 下方追加一份
 *   「本分类全部提示词」的紧凑链接清单**（纯 <a>，无图、体量小）。
 *   紧凑清单本身就是这一类的真索引页，Google 可直接顺着它爬到每一个 prompt 页。
 *
 * 验证（改后实测）：清单链接去重后覆盖 5,679 / 5,679 = 100%，
 *   相比改前的 648 提升 **5,031 个页面**获得站内链接；最大分类页（graphic_design）
 *   清单 HTML 约 230 KB，纯文本无图片请求。
 */
function getAllPromptsForCategory(slug: string): any[] {
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    const items = Array.isArray(raw) ? raw : raw.prompts || []
    return items.filter((p: any) => (p.category || 'other') === slug)
  } catch (e) {
    console.warn('[category-page] failed to load prompts-light.json', e)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = getCategoryConfig(slug)
  const label = config.label
  const description = `Browse ${label} image prompts on Prompt Hub. ${label} AI prompts for GPT Image 2, Midjourney, DALL-E and Stable Diffusion — curated ${label.toLowerCase()} prompt ideas, styles and examples to copy and create with.`
  return {
    title: `${label} Image Prompts`,
    description,
    alternates: {
      canonical: `${SITE}/category/${slug}/`,
    },
    openGraph: {
      title: `${label} Image Prompts | Prompt Hub`,
      description,
      url: `${SITE}/category/${slug}/`,
      type: 'website',
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!CATEGORY_CONFIG[slug]) {
    notFound()
  }

  const config = getCategoryConfig(slug)
  const label = config.label
  const content = CATEGORY_CONTENT[slug] || { intro: [], faq: [] }
  const allPrompts = getAllPromptsForCategory(slug)
  const prompts = allPrompts.slice(0, 48)
  const totalPrompts = allPrompts.length

  const canonical = `${SITE}/category/${slug}/`
  const related = CATEGORY_ORDER.filter((s) => s !== slug)

  // ----- JSON-LD -----
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${SITE}/category/` },
      { '@type': 'ListItem', position: 3, name: label, item: canonical },
    ],
  }

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${label} Image Prompts`,
    description: `A curated collection of ${label} AI image prompts on Prompt Hub.`,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'Prompt Hub', url: SITE },
    mainEntity: {
      '@type': 'ItemList',
      // 🔴 2026-11-04：改成该分类的**真实总数**，而不是当前页渲染的 48 条。
      //   原实现 numberOfItems = prompts.length（=48），对 graphic_design 这类
      //   有 1,243 条的分类来说是把真实规模说小了 26 倍。
      numberOfItems: totalPrompts,
      itemListElement: prompts.slice(0, 20).map((p: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/prompt/${encodeURIComponent(p.slug)}/`,
        name: p.title || p.titleEn || 'Prompt',
      })),
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const jsonLd = [breadcrumbLd, collectionLd, faqLd]

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#090916' }}>
      {/* JSON-LD injection */}
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#090916]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-black text-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/40">
              P
            </div>
            <span className="text-xl font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
              Prompt Hub
            </span>
          </Link>
          <div className="h-5 w-px bg-zinc-800" />
          <Link href="/category/" className="text-sm text-zinc-400 hover:text-purple-300 transition-colors">
            Categories
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-purple-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/category/" className="hover:text-purple-300 transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-zinc-300">{label}</span>
        </nav>

        {/* H1 + intro */}
        <header className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-4xl">{config.emoji}</span>
            <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">{label} Prompts</h1>
          </div>
          <div className="space-y-4 text-zinc-400 leading-relaxed max-w-3xl">
            {content.intro.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </header>

        {/* Prompt grid */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-zinc-200">
            {totalPrompts} {label} prompts to explore
          </h2>
          {prompts.length > 0 ? (
            <PromptGrid items={prompts} />
          ) : (
            <p className="text-zinc-500">No prompts indexed for this category yet.</p>
          )}
          <div className="mt-8">
            <Link
              href="/category/"
              className="inline-block rounded-xl border border-zinc-700 bg-zinc-900/60 px-6 py-3 text-sm text-zinc-300 transition-all hover:border-purple-500/50 hover:text-purple-300"
            >
              Browse all categories →
            </Link>
          </div>
        </section>

        {/* 🔴 2026-11-04（DEBT-49）：本分类**全部**提示词的紧凑索引清单。
         *   上面那 48 张卡片是给人看的（带图），这里是给爬虫看的 ——
         *   每一行都是一条指向具体 prompt 页的 <a>，把「只有 sitemap 入口」
         *   的 4,519 个页面（87.5%）接进站内链接图。
         *   刻意不渲染图片：1,243 个 <img> 会把 HTML 撑到几百 KB 且多出上千次请求；
         *   纯链接清单体量小得多，且语义（标题 + URL）正是索引页该有的样子。 */}
        {totalPrompts > prompts.length && (
          <section className="mb-16">
            <h2 className="mb-2 text-xl font-semibold text-zinc-200">
              All {totalPrompts} {label} prompts
            </h2>
            <p className="mb-6 text-sm text-zinc-500">
              Complete index of every {label.toLowerCase()} prompt on this site.
            </p>
            <ul className="columns-2 gap-x-8 text-sm text-zinc-400 sm:columns-3 md:columns-4">
              {allPrompts.map((p: any, i: number) => (
                <li key={p.id || i} className="mb-1 break-words">
                  <Link
                    href={`/prompt/${encodeURIComponent(p.slug)}/`}
                    className="transition-colors hover:text-purple-300"
                  >
                    {p.title || p.titleEn || p.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related categories (silo) */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-zinc-200">Explore other categories</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((s) => {
              const rc = getCategoryConfig(s)
              return (
                <Link
                  key={s}
                  href={`/category/${s}`}
                  className="rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:border-purple-500/50 hover:text-purple-300"
                >
                  {rc.emoji} {rc.label}
                </Link>
              )
            })}
          </div>
        </section>

        {/* FAQ */}
        {content.faq.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-6 text-xl font-semibold text-zinc-200">
              Frequently asked questions about {label} prompts
            </h2>
            <div className="space-y-4">
              {content.faq.map((f, i) => (
                <div key={i} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5">
                  <h3 className="mb-2 font-medium text-zinc-100">{f.q}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
