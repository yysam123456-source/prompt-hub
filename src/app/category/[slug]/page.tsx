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

function getPromptsForCategory(slug: string, limit = 48): any[] {
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    const items = Array.isArray(raw) ? raw : raw.prompts || []
    return items.filter((p: any) => (p.category || 'other') === slug).slice(0, limit)
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
  const prompts = getPromptsForCategory(slug, 48)

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
      numberOfItems: prompts.length,
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
          <Link href="/category" className="text-sm text-zinc-400 hover:text-purple-300 transition-colors">
            Categories
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-purple-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/category" className="hover:text-purple-300 transition-colors">Categories</Link>
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
            {prompts.length} {label} prompts to explore
          </h2>
          {prompts.length > 0 ? (
            <PromptGrid items={prompts} />
          ) : (
            <p className="text-zinc-500">No prompts indexed for this category yet.</p>
          )}
          <div className="mt-8">
            <Link
              href="/category"
              className="inline-block rounded-xl border border-zinc-700 bg-zinc-900/60 px-6 py-3 text-sm text-zinc-300 transition-all hover:border-purple-500/50 hover:text-purple-300"
            >
              Browse all categories →
            </Link>
          </div>
        </section>

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
