import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import CategoryBrowser from '@/components/CategoryBrowser'
import { CATEGORY_ORDER, getCategoryConfig } from '@/lib/categories'

const SITE = 'https://imgprompt.craftisle.com'

// This hub had no metadata at all until now: it was a 'use client' file, files
// marked 'use client' cannot export `metadata`, so the page inherited the root
// layout's title while being linked from the home page and from all 16 pillar
// pages. It is now a Server Component that owns its own title + canonical.
export const metadata: Metadata = {
  title: 'Browse AI Image Prompts by Category',
  description:
    'Browse AI image prompts by category — graphic design, photography, anime, character, illustration, e-commerce, sci-fi, branding and 8 more. Copy free.',
  alternates: {
    canonical: `${SITE}/category/`,
  },
  openGraph: {
    title: 'Browse AI Image Prompts by Category | Prompt Hub',
    description:
      'Browse AI image prompts by category — graphic design, photography, anime, character, illustration, e-commerce, sci-fi, branding and more.',
    url: `${SITE}/category/`,
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function CategoryHubPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${SITE}/category/` },
    ],
  }

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Image Prompts by Category',
    description:
      'An index of every AI image prompt category on Prompt Hub, linking to each curated collection.',
    url: `${SITE}/category/`,
    hasPart: CATEGORY_ORDER.map((slug) => {
      const cfg = getCategoryConfig(slug)
      return {
        '@type': 'CollectionPage',
        name: `${cfg.label} Image Prompts`,
        url: `${SITE}/category/${slug}/`,
      }
    }),
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />

      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100 hidden sm:block">Prompt Hub</span>
          </Link>
          <div className="h-5 w-px bg-zinc-800" />
          <span className="text-sm text-zinc-400">Categories</span>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm text-zinc-500"
        >
          <Link href="/" className="transition-colors hover:text-purple-400">
            Home
          </Link>
          <span>/</span>
          <span className="text-zinc-300">Categories</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            Browse AI Image Prompts by Category
          </h1>
          {/* Static, crawlable copy. The old version of this page had a client-only
              body, so a no-JS crawler saw an empty skeleton with zero outbound links. */}
          <p className="mt-3 max-w-3xl text-zinc-400">
            Every prompt on Prompt Hub is filed under one of {CATEGORY_ORDER.length} categories.
            Pick a category to open its full curated collection — each one has a written
            introduction, FAQ and a browsable grid — or scroll down to browse all prompts and
            sort them by latest, trending or most liked.
          </p>
        </header>

        {/* Server-rendered category index. These are plain anchors in the static HTML,
            which is what lets the hub actually pass link equity to the 16 pillar pages. */}
        <section className="mb-16" aria-label="Categories">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORY_ORDER.map((slug) => {
              const cfg = getCategoryConfig(slug)
              return (
                <Link
                  key={slug}
                  href={`/category/${slug}/`}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-purple-500/50 hover:bg-zinc-900"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
                  />
                  <div className="relative flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {cfg.emoji}
                    </span>
                    <span className="font-medium text-zinc-200 transition-colors group-hover:text-white">
                      {cfg.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <Suspense
          fallback={
            <div className="py-20 text-center text-zinc-400">Loading prompts…</div>
          }
        >
          <CategoryBrowser />
        </Suspense>
      </div>
    </main>
  )
}
