import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const SITE = 'https://imgprompt.craftisle.com'

// Why this file exists instead of editing src/app/search/page.tsx directly:
// that page is a 'use client' component, and a file marked 'use client' cannot export
// `metadata`. As a result the search page shipped with no title, no description and no
// canonical at all — it silently inherited the root layout's title while being listed in
// the sitemap at priority 0.5.
//
// It is also noindex on purpose. Because this is a static export, every ?q= variant is
// served from the same index.html and differs only after client-side JS runs, so every
// search URL is a near-duplicate of every other one. The homepage tag chips and the
// prompt detail tag links both point at /search?q=..., which means those permutations are
// internally linked and will be crawled. Leaving them indexable spends crawl budget on a
// 5,209-URL site that needs it for the 5,167 real prompt pages.
//
// `follow: true` is deliberate: the page stays crawlable so link equity still flows
// through it. It must therefore be dropped from the sitemap — submitting a noindex URL
// is a contradictory signal that Search Console reports as an error.
export const metadata: Metadata = {
  title: 'Search AI Image Prompts',
  description:
    'Search thousands of curated AI image prompts by keyword, style or category. Find and copy prompts for Midjourney, DALL-E and Stable Diffusion.',
  alternates: {
    canonical: `${SITE}/search/`,
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SearchLayout({ children }: { children: ReactNode }) {
  return children
}
