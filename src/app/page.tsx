import Link from 'next/link'
import CategoryBar from '@/components/CategoryBar'
import PromptGrid, { PromptCard } from '@/components/PromptGrid'
import { loadStats, loadCategories, loadTrending, loadLatest, loadCategoryImages } from '@/lib/staticData.server'
import type { SiteStats, Category } from '@/lib/types'
import AnimatedGradientText from '@/components/animata/text/animated-gradient-text'
import { SearchBox, AnimateOnView, AnimateCard } from './HomePageClient'
import {
  AuroraBackground,
  ParticleField,
  MorphingBlob,
  TiltCard,
  AnimatedCounter,
  MagneticButton,
  TypewriterText,
} from '@/components/animata/effects'

// ======== Hero Section ========
function HeroSection({ stats }: { stats: SiteStats }) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Aurora + Particles */}
      <AuroraBackground>
        <ParticleField />
      </AuroraBackground>

      {/* Morphing blobs */}
      <div className="absolute left-[-10%] top-[-10%] w-[500px] h-[500px] -z-10 pointer-events-none">
        <MorphingBlob color1="#a855f7" color2="#06b6d4" />
      </div>
      <div className="absolute right-[-5%] bottom-[-15%] w-[400px] h-[400px] -z-10 pointer-events-none">
        <MorphingBlob color1="#ec4899" color2="#6366f1" />
      </div>

      {/* Center content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center">
        {/* Live badge */}
        <div className="animate-scale-in mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-400" />
          </span>
          {stats.totalPrompts}+ curated GPT Image 2 prompts
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-7xl">
          Explore{' '}
          <AnimatedGradientText className="text-4xl font-bold sm:text-5xl lg:text-7xl">
            AI Prompts
          </AnimatedGradientText>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            <TypewriterText texts={['Ignite Creativity', 'Create Art', 'Build Worlds', 'Dream in Prompt']} />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-delay-2 mb-8 max-w-xl text-base text-zinc-400 sm:text-lg">
          Free high-quality GPT Image 2 prompts. Copy and generate stunning AI images instantly.
        </p>

        {/* Search */}
        <div className="animate-fade-in-delay-3 w-full max-w-lg">
          <SearchBox />
        </div>

        {/* Quick tags */}
        <div className="animate-fade-in-delay-4 mt-6 flex flex-wrap justify-center gap-2">
          {['Poster Design', 'Cyberpunk', 'Portrait', 'Sci-Fi', 'Watercolor'].map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="tag-hover rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm hover:border-purple-500/50 hover:text-purple-300"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======== Stats Section ========
function StatsSection({ stats }: { stats: SiteStats }) {
  const items = [
    { label: 'Total Prompts', value: stats.totalPrompts, suffix: '+' },
    { label: 'Categories', value: stats.totalCategories, suffix: '' },
    { label: 'Contributors', value: stats.totalContributors, suffix: '+' },
  ]

  return (
    <section className="border-y border-zinc-800/50 bg-zinc-900/30 px-4 py-14">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-8 text-center">
          {items.map((item) => (
            <AnimateCard key={item.label}>
              <TiltCard className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 backdrop-blur-sm">
                <div className="stat-number-glow inline-block">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                    <AnimatedCounter end={item.value} suffix={item.suffix} />
                  </span>
                </div>
                <div className="mt-2 text-xs text-zinc-500 uppercase tracking-wider sm:text-sm">
                  {item.label}
                </div>
              </TiltCard>
            </AnimateCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======== Section Header ========
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ======== Prompt List Section ========
function PromptListSection({
  items,
  title,
  subtitle,
}: {
  items: any[]
  title: string
  subtitle?: string
}) {
  if (items.length === 0) return null
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          action={
            <Link href="/category" className="group text-sm text-purple-400 transition-colors hover:text-purple-300">
              View All →
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <AnimateCard key={item.slug} delay={i * 0.08}>
              <TiltCard className="h-full">
                <div className="prompt-card-v2 h-full">
                  <PromptCard item={item} index={i} />
                </div>
              </TiltCard>
            </AnimateCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======== Categories Section ========
function CategoriesSection({ categories, categoryImages }: { categories: Category[]; categoryImages?: Record<string, string> }) {
  return (
    <section className="relative px-4 py-20 overflow-hidden">
      {/* Morphing blob decoration */}
      <div className="absolute right-[-8%] top-[20%] w-[350px] h-[350px] -z-10 pointer-events-none opacity-40">
        <MorphingBlob color1="#6366f1" color2="#a855f7" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <AnimateOnView className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-100">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Explore
            </span>{' '}
            Categories
          </h2>
          <p className="mt-2 text-zinc-400">Browse by category to find the perfect prompt</p>
        </AnimateOnView>
        <CategoryBar categories={categories} categoryImages={categoryImages} />
      </div>
    </section>
  )
}

// ======== How To Use Section ========
function HowToUseSection() {
  const steps = [
    { icon: '🔍', title: 'Search', desc: 'Enter keywords or browse categories' },
    { icon: '📋', title: 'Copy', desc: 'Click card to view & copy full prompt' },
    { icon: '🎨', title: 'Create', desc: 'Paste into GPT Image 2 & create' },
  ]

  return (
    <section className="relative border-t border-zinc-800/50 px-4 py-24 overflow-hidden">
      <ParticleField className="opacity-30" />

      <div className="mx-auto max-w-4xl relative z-10">
        <AnimateOnView className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-zinc-100">How It Works</h2>
          <p className="mt-2 text-zinc-400">3 simple steps to create stunning AI art</p>
        </AnimateOnView>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <AnimateCard key={i} delay={i * 0.15}>
              <TiltCard className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur-sm">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-0.5 text-[11px] font-bold text-white shadow-lg shadow-purple-500/20">
                  Step {i + 1}
                </div>
                <div className="mb-4 text-5xl transition-transform duration-300 hover:scale-125">
                  {step.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-100 group-hover:text-purple-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>

                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div className="hidden absolute -right-4 top-1/2 h-0.5 w-8 bg-gradient-to-r from-purple-500/40 to-transparent sm:block" />
                )}
              </TiltCard>
            </AnimateCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======== CTA Section ========
function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-zinc-800/50 px-4 py-24">
      <AuroraBackground>
        <ParticleField className="opacity-20" />
      </AuroraBackground>

      <div className="relative z-20 mx-auto max-w-2xl text-center">
        <AnimateOnView>
          <h2 className="mb-4 text-3xl font-bold text-zinc-100 sm:text-4xl">
            Start Your{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              AI Creative Journey
            </span>
          </h2>
        </AnimateOnView>
        <AnimateOnView delay={0.15}>
          <p className="mb-10 text-zinc-400">
            Free to use, no registration required. Explore the hottest GPT Image 2 prompts of {new Date().getFullYear()}
          </p>
        </AnimateOnView>
        <AnimateOnView delay={0.3}>
          <Link href="/category">
            <MagneticButton className="inline-block rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 text-base font-medium text-white transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-purple-500/25">
              Start Exploring →
            </MagneticButton>
          </Link>
        </AnimateOnView>
      </div>
    </section>
  )
}

// ======== Footer ========
function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-4 py-12">
      <div className="mx-auto max-w-7xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white transition-transform hover:scale-105">
            P
          </div>
          <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
        </div>
        <p className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Prompt Hub &middot; Data source:{' '}
          <a href="https://youmind.com/gpt-image-2-prompts" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 ml-1">
            YouMind
          </a>
          {' / '}
          <a href="https://prompts.sorry.ink" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
            Image-Prompts
          </a>
        </p>
        <div className="flex gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 transition-colors hover:text-purple-400">
            GitHub
          </a>
          <Link href="/about" className="text-sm text-zinc-500 transition-colors hover:text-purple-400">
            About
          </Link>
        </div>
      </div>
    </footer>
  )
}

// ======== NavBar ========
function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/30">
            P
          </div>
          <span className="text-lg font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
            Prompt Hub
          </span>
        </Link>
        <form action="/search" method="GET" className="flex gap-2 flex-1 max-w-lg ml-auto">
          <div className="relative flex-1 group">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              name="q"
              type="text"
              placeholder="Search prompts..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 focus:bg-zinc-900 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-purple-600 px-5 py-2 text-sm text-white font-medium transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  )
}

// ======== Main Page (Server Component) ========
export default async function HomePage() {
  const [statsData, catData, trendingData, latestData, catImages] = await Promise.all([
    loadStats(),
    loadCategories(),
    loadTrending(8),
    loadLatest(8),
    loadCategoryImages(),
  ])

  return (
    <main className="min-h-screen bg-zinc-950">
      <NavBar />
      <HeroSection stats={statsData} />
      <StatsSection stats={statsData} />
      <CategoriesSection categories={catData} categoryImages={catImages} />
      <div className="border-t border-zinc-800/50" />
      <PromptListSection items={trendingData} title="🔥 Trending Prompts" subtitle="Most viewed prompts" />
      <div className="border-t border-zinc-800/50" />
      <PromptListSection items={latestData} title="✨ Latest Prompts" subtitle="Newly added quality prompts" />
      <div className="border-t border-zinc-800/50" />
      {trendingData.length > 0 && (
        <>
          <PromptListSection items={trendingData.slice(0, 4)} title="💎 Editor's Picks" subtitle="Curated quality prompts" />
          <div className="border-t border-zinc-800/50" />
        </>
      )}
      <HowToUseSection />
      <div className="border-t border-zinc-800/50" />
      <CTASection />
      <Footer />
    </main>
  )
}
