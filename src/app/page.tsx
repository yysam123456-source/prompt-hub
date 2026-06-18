'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimatedBeam from '@/components/animata/background/animated-beam'
import AnimatedText from '@/components/animata/text/animated-text'
import { BentoGrid, BentoCard } from '@/components/animata/bento/bento-grid'
import ShinyButton from '@/components/animata/button/shiny-button'
import CategoryBar from '@/components/CategoryBar'
import PromptGrid from '@/components/PromptGrid'

// ======== Hero Section =======
function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Meteor background */}
      <AnimatedBeam beamCount={8} />

      {/* Hero content */}
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-400"></span>
          </span>
          32,000+ curated prompts, free to use
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="gradient-text">AI Prompts</span>
          <br />
          <AnimatedText
            text="Explore Infinite Possibilities"
            className="text-zinc-100"
          />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-10 max-w-2xl text-lg text-zinc-400"
        >
          Explore over 32,000 high-quality AI art prompts
          <br className="hidden sm:block" />
          Supports Midjourney, Stable Diffusion, DALL-E and other mainstream models
        </motion.p>

        {/* Search box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-full max-w-2xl"
        >
          <form action="/search" method="GET" className="flex gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                name="q"
                type="text"
                placeholder="Search prompts... e.g. cyberpunk, fantasy landscape"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 py-4 pl-12 pr-6 text-sm text-zinc-100 placeholder-zinc-500 backdrop-blur-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <ShinyButton type="submit" className="rounded-2xl px-8 py-4 text-base">
              Search
            </ShinyButton>
          </form>
        </motion.div>

        {/* Quick tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {['cyberpunk', 'fantasy landscape', 'portrait photography', 'sci-fi city', 'watercolor'].map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-sm text-zinc-400 backdrop-blur-sm transition-colors hover:border-purple-500/50 hover:text-purple-300"
            >
              {tag}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ======== Category Section (Bento Grid) =======
function CategorySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            Explore <span className="gradient-text">Categories</span>
          </h2>
          <p className="mt-3 text-zinc-400">
            Browse prompts by category, find the creative inspiration you need
          </p>
        </motion.div>

        <CategoryBar hideChinese />
      </div>
    </section>
  )
}

// ======== Latest Prompts =======
function LatestSection({ items }: { items: any[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
              🆕 Latest Prompts
            </h2>
            <p className="mt-2 text-zinc-400">Freshly added curated prompts</p>
          </div>
          <Link
            href="/search"
            className="text-sm text-purple-400 transition-colors hover:text-purple-300"
          >
            View All →
          </Link>
        </motion.div>

        <PromptGrid items={items} hideChinese />
      </div>
    </section>
  )
}

// ======== Hottest Prompts =======
function HottestSection({ items }: { items: any[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
              🔥 Hottest Prompts
            </h2>
            <p className="mt-2 text-zinc-400">Most popular prompts in the community</p>
          </div>
          <Link
            href="/search?sort=hot"
            className="text-sm text-purple-400 transition-colors hover:text-purple-300"
          >
            View All →
          </Link>
        </motion.div>

        <PromptGrid items={items} hideChinese />
      </div>
    </section>
  )
}

// ======== CTA Section =======
function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10" />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-4xl font-bold text-zinc-100 sm:text-5xl"
        >
          Start Your <span className="gradient-text">AI Creative Journey</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 text-lg text-zinc-400"
        >
          Free to use, no registration required. Start exploring now.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-4"
        >
          <Link href="/search">
            <ShinyButton className="rounded-2xl px-10 py-4 text-lg">
              Start Exploring
            </ShinyButton>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ======== Footer =======
function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-4 py-12">
      <div className="mx-auto max-w-7xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
        </div>
        <p className="text-sm text-zinc-500">
          © 2026 Prompt Hub. Free AI Prompt Library.
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-zinc-500 transition-colors hover:text-purple-400">
            GitHub
          </a>
          <a href="#" className="text-zinc-500 transition-colors hover:text-purple-400">
            About
          </a>
        </div>
      </div>
    </footer>
  )
}

// ======== Main Page =======
export default function HomePage() {
  const [latest, setLatest] = useState<any[]>([])
  const [hottest, setHottest] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res1 = await fetch('/api/prompts?page=1&pageSize=20&sort=latest')
        const latestData = await res1.json()
        setLatest(latestData.items || [])

        const res2 = await fetch('/api/prompts?page=1&pageSize=20&sort=hot')
        const hottestData = await res2.json()
        setHottest(hottestData.items || [])
      } catch (e) {
        console.error('Failed to load home data', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Navigation bar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
          </Link>
          <form action="/search" method="GET" className="flex gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                name="q"
                type="text"
                placeholder="Search prompts..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
              />
            </div>
            <button type="submit" className="rounded-xl bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700">
              Search
            </button>
          </form>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection />

      {/* Divider */}
      <div className="mx-auto max-w-7xl border-t border-zinc-800/50" />

      {/* Categories */}
      <CategorySection />

      <div className="mx-auto max-w-7xl border-t border-zinc-800/50" />

      {/* Latest */}
      {loading ? (
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-zinc-900 animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <LatestSection items={latest} />
      )}

      <div className="mx-auto max-w-7xl border-t border-zinc-800/50" />

      {/* Hottest */}
      {!loading && <HottestSection items={hottest} />}

      <div className="border-t border-zinc-800/50" />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
