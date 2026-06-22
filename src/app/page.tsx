import Link from 'next/link'
import CategoryBar from '@/components/CategoryBar'
import PromptGrid, { PromptCard } from '@/components/PromptGrid'
import { loadStats, loadCategories, loadTrending, loadLatest, loadCategoryImages } from '@/lib/staticData.server'
import type { SiteStats, Category } from '@/lib/types'
import {
  NeonText,
  GlitchText,
  TypewriterLoop,
  ParticleCanvas,
  MeshGradient,
  Starfield,
  TiltNeonCard,
  MagneticBtn,
  CounterRoll,
  GlowCard,
  ShimmerText,
} from '@/components/animata/effects/v2'
import { SearchBox, AnimateOnView } from './HomePageClient'

// ======== Hero Section ========
function HeroSection({ stats }: { stats: SiteStats }) {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Unified smooth background — no patchy aurora blobs */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0c0c22] to-[#0e0e28]" />

      {/* Smooth mesh gradient overlay */}
      <MeshGradient intensity="medium" className="opacity-60" />

      {/* Visible starfield animation */}
      <Starfield density={150} className="opacity-70" />

      {/* Center content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center">
        {/* Live badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 text-sm text-purple-300 backdrop-blur-md badge-glow">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-400" />
          </span>
          <span className="font-medium">{stats.totalPrompts}+ curated GPT Image 2 prompts</span>
        </div>

        {/* Main heading — neon + glitch */}
        <h1 className="hero-heading mb-6 text-5xl font-black tracking-tight text-zinc-100 sm:text-6xl lg:text-8xl">
          <NeonText color="purple" size="text-5xl sm:text-6xl lg:text-8xl">
            Explore{' '}
          </NeonText>
          <br />
          <span className="neon-accent">
            <GlitchText className="text-4xl sm:text-5xl lg:text-7xl">
              AI Prompts
            </GlitchText>
          </span>
        </h1>

        {/* Typewriter subtitle */}
        <div className="mb-10 h-8 text-lg text-zinc-400 sm:text-xl">
          <TypewriterLoop
            texts={['Ignite Creativity', 'Create Stunning Art', 'Build Imaginary Worlds', 'Dream in Prompt']}
            className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-text-shimmer"
          />
        </div>

        {/* Search */}
        <div className="w-full max-w-xl mb-8">
          <SearchBox />
        </div>

        {/* Quick tags */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {['Poster Design', 'Cyberpunk', 'Portrait', 'Sci-Fi', 'Watercolor', 'Anime', 'Fantasy'].map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="quick-tag rounded-full border border-zinc-700/40 bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-sm hover:border-purple-500/50 hover:text-purple-300 transition-all duration-300"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0c0c24] to-transparent pointer-events-none" />
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
    <section className="relative px-4 py-20 overflow-hidden bg-[#0b0b20]">
      {/* Subtle mesh gradient for depth */}
      <MeshGradient intensity="subtle" className="opacity-30" />

      <div className="mx-auto max-w-5xl relative z-10">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {items.map((item, i) => (
            <AnimateOnView key={item.label} delay={i * 0.15}>
              <TiltNeonCard className="rounded-3xl border-zinc-700/30 bg-zinc-900/50 p-8 backdrop-blur-md">
                <div className="text-5xl font-black text-zinc-100 sm:text-6xl">
                  <CounterRoll end={item.value} suffix={item.suffix} duration={2500} />
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-500 sm:text-sm">
                  {item.label}
                </div>
              </TiltNeonCard>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======== Section Header ========
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-end justify-between">
      <div>
        <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
          <ShimmerText className="text-3xl font-bold sm:text-4xl">{title}</ShimmerText>
        </h2>
        {subtitle && <p className="mt-1.5 text-sm text-zinc-400">{subtitle}</p>}
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
    <section className="relative px-4 py-24 bg-[#0a0a1e]">
      {/* Very subtle mesh for texture */}
      <MeshGradient intensity="subtle" className="opacity-15" />

      <div className="mx-auto max-w-7xl relative z-10">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          action={
            <Link href="/category" className="group text-sm text-purple-400 transition-all duration-300 hover:text-purple-300 hover:translate-x-1 inline-block">
              View All →
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <AnimateOnView key={item.slug} delay={i * 0.08}>
              <GlowCard className="h-full rounded-2xl">
                <PromptCard item={item} index={i} />
              </GlowCard>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======== Categories Section ========
function CategoriesSection({ categories, categoryImages }: { categories: Category[]; categoryImages?: Record<string, string> }) {
  return (
    <section className="relative px-4 py-24 bg-[#0b0b21]">
      {/* Subtle center glow for category section */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.06), transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        <AnimateOnView className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            <ShimmerText className="text-3xl font-bold sm:text-4xl">Explore Categories</ShimmerText>
          </h2>
          <p className="mt-3 text-zinc-400 text-base">Browse by category to find the perfect prompt style</p>
        </AnimateOnView>
        <CategoryBar categories={categories} categoryImages={categoryImages} />
      </div>
    </section>
  )
}

// ======== How To Use Section ========
function HowToUseSection() {
  const steps = [
    { icon: '🔍', title: 'Search & Browse', desc: 'Enter keywords or browse categories to discover prompts' },
    { icon: '📋', title: 'Copy Prompt', desc: 'Click any card to view & copy the full prompt instantly' },
    { icon: '🎨', title: 'Create Art', desc: 'Paste into GPT Image 2 and watch the magic happen' },
  ]

  return (
    <section className="relative px-4 py-28 bg-[#0a0a1e]">
      <MeshGradient intensity="subtle" className="opacity-25" />

      <div className="mx-auto max-w-5xl relative z-10">
        <AnimateOnView className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-text-shimmer">
              How It Works
            </span>
          </h2>
          <p className="mt-3 text-zinc-400 text-base">3 simple steps to create stunning AI art</p>
        </AnimateOnView>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <AnimateOnView key={i} delay={i * 0.2}>
              <TiltNeonCard className="relative rounded-3xl border-zinc-700/30 bg-zinc-900/50 p-10 text-center backdrop-blur-md">
                <div className="step-badge absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 text-xs font-black text-white shadow-lg shadow-purple-500/30">
                  STEP {i + 1}
                </div>
                <div className="mb-6 text-6xl transition-transform duration-500 hover:scale-125 hover:rotate-6 inline-block">
                  {step.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
                  <NeonText color="cyan" size="text-xl">{step.title}</NeonText>
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>

                {i < steps.length - 1 && (
                  <div className="hidden absolute -right-6 top-1/2 h-0.5 w-12 bg-gradient-to-r from-purple-500/40 to-transparent sm:block" />
                )}
              </TiltNeonCard>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======== CTA Section ========
function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-28 bg-[#0c0c26]">
      <MeshGradient intensity="medium" className="opacity-50" />
      <Starfield density={80} className="opacity-40" />

      <div className="relative z-20 mx-auto max-w-3xl text-center">
        <AnimateOnView>
          <h2 className="mb-6 text-4xl font-black text-zinc-100 sm:text-5xl cta-glow-text">
            Start Your{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-text-shimmer">
              AI Creative Journey
            </span>
          </h2>
        </AnimateOnView>
        <AnimateOnView delay={0.2}>
          <p className="mb-12 text-zinc-400 text-lg">
            Free to use, no registration required. Explore the hottest GPT Image 2 prompts of {new Date().getFullYear()}
          </p>
        </AnimateOnView>
        <AnimateOnView delay={0.4}>
          <Link href="/category">
            <MagneticBtn className="inline-block rounded-2xl px-12 py-4 text-lg font-bold">
              🚀 Start Exploring
            </MagneticBtn>
          </Link>
        </AnimateOnView>
      </div>
    </section>
  )
}

// ======== Footer ========
function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 px-4 py-16 bg-[#08081a]">
      <div className="mx-auto max-w-7xl flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-black text-white transition-all duration-500 hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-purple-500/40">
            P
          </div>
          <span className="text-xl font-bold text-zinc-100 hover:text-purple-300 transition-colors cursor-pointer">
            Prompt Hub
          </span>
        </div>
        <p className="text-xs text-zinc-500 text-center">
          &copy; {new Date().getFullYear()} Prompt Hub &middot; Data source:{' '}
          <a href="https://youmind.com/gpt-image-2-prompts" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
            YouMind
          </a>
          {' / '}
          <a href="https://prompts.sorry.ink" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
            Image-Prompts
          </a>
        </p>
        <div className="flex gap-6">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 transition-all duration-300 hover:text-purple-400 hover:translate-y-[-2px] inline-block">
            GitHub
          </a>
          <Link href="/about" className="text-sm text-zinc-500 transition-all duration-300 hover:text-purple-400 hover:translate-y-[-2px] inline-block">
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
    <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#09091a]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-black text-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/40">
            P
          </div>
          <span className="text-xl font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
            Prompt Hub
          </span>
        </Link>
        <form action="/search" method="GET" className="flex gap-2.5 flex-1 max-w-xl ml-auto">
          <div className="relative flex-1 group">
            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-purple-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              name="q"
              type="text"
              placeholder="Search prompts..."
              className="w-full rounded-xl border border-zinc-700/40 bg-zinc-900/60 py-2.5 pl-11 pr-5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:bg-zinc-900 transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm text-white font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 active:translate-y-0"
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
    // Unified dark base — ONE color for entire page
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0b0b20] to-[#0d0d28] overflow-hidden">
      <NavBar />
      <HeroSection stats={statsData} />
      <StatsSection stats={statsData} />
      <CategoriesSection categories={catData} categoryImages={catImages} />
      <PromptListSection items={trendingData} title="🔥 Trending Prompts" subtitle="Most viewed prompts this week" />
      <PromptListSection items={latestData} title="✨ Latest Prompts" subtitle="Newly added quality prompts" />
      {trendingData.length > 0 && (
        <PromptListSection items={trendingData.slice(0, 4)} title="💎 Editor's Picks" subtitle="Curated quality prompts" />
      )}
      <HowToUseSection />
      <CTASection />
      <Footer />
    </main>
  )
}
