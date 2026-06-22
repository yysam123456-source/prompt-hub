import Link from 'next/link'
import CategoryBar from '@/components/CategoryBar'
import PromptGrid from '@/components/PromptGrid'
import { loadStats, loadCategories, loadTrending, loadLatest, loadCategoryImages } from '@/lib/staticData.server'
import type { SiteStats, Category, PromptCard } from '@/lib/types'
import AnimatedGradientText from '@/components/animata/text/animated-gradient-text'
import Grid from '@/components/animata/background/grid'
import { SearchBox, AnimateOnView, AnimateCard } from './HomePageClient'

// ======== Hero Section (Server Component — static render) ========
function HeroSection({ stats }: { stats: SiteStats }) {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background layers */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <Grid color="#a855f7" size={40} style={{ backgroundColor: 'transparent' }} />
      </div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
      {/* Enhanced floating orbs */}
      <div className="hero-orb absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl -z-10" />
      <div className="hero-orb-delay absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl -z-10" />
      <div className="animate-float-subtle absolute left-1/2 top-1/3 h-48 w-48 rounded-full bg-indigo-500/8 blur-3xl -z-10" />

      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center sm:py-28">
        {/* Badge — animated glow */}
        <div className="animate-scale-in mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 backdrop-blur-sm animate-glow-pulse">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-full w-2 rounded-full bg-purple-400" />
          </span>
          {stats.totalPrompts}+ curated GPT Image 2 prompts
        </div>

        {/* Main heading with gradient animation */}
        <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
          Explore{' '}
          <AnimatedGradientText className="animate-text-shimmer text-4xl font-bold sm:text-5xl lg:text-6xl">
            AI Prompts
          </AnimatedGradientText>
          <br />
          <span className="animate-fade-in-delay-2">Ignite Your Creativity</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-delay-3 mb-8 max-w-xl text-base text-zinc-400 sm:text-lg">
          Free high-quality GPT Image 2 prompts. Copy and generate stunning AI images instantly.
        </p>

        {/* Search box — Client Component */}
        <SearchBox />

        {/* Quick tags */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['Poster Design', 'Cyberpunk', 'Portrait', 'Sci-Fi', 'Watercolor'].map(tag => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="tag-hover rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm"
            >
              {tag}
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
    <section className="border-y border-zinc-800/50 bg-zinc-900/30 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-4 text-center">
          {items.map((item) => (
            <AnimateCard key={item.label}>
              <div className="group">
                <div className="stat-number text-2xl font-bold sm:text-3xl transition-all duration-300 group-hover:scale-110 inline-block">
                  {item.value}{item.suffix}
                </div>
                <div className="mt-1 text-xs text-zinc-500 sm:text-sm">{item.label}</div>
              </div>
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

// ======== Trending / Latest Sections ========
function PromptListSection({
  items,
  title,
  subtitle,
}: {
  items: PromptCard[]
  title: string
  subtitle?: string
}) {
  if (items.length === 0) return null

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          action={
            <Link href="/category" className="text-sm text-purple-400 transition-colors hover:text-purple-300">
              View All &rarr;
            </Link>
          }
        />
        <PromptGrid items={items} />
      </div>
    </section>
  )
}

// ======== Categories Section ========
function CategoriesSection({ categories, categoryImages }: { categories: Category[]; categoryImages?: Record<string, string> }) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <AnimateOnView className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-zinc-100">Explore Categories</h2>
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
    { icon: '🔍', title: 'Search', desc: 'Enter keywords in the search box or browse categories to find your ideal prompt' },
    { icon: '📋', title: 'Copy', desc: 'Click a prompt card to view details and copy the full prompt text (with parameter replacement)' },
    { icon: '🎨', title: 'Create', desc: 'Paste the copied prompt into GPT Image 2 or any AI image generator and start creating' },
  ]

  return (
    <section className="border-t border-zinc-800/50 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <AnimateOnView className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-100">How It Works</h2>
          <p className="mt-2 text-zinc-400">3 simple steps to create stunning AI art</p>
        </AnimateOnView>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <AnimateCard key={i} delay={i * 0.15}>
              <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1 animated-border">
                {/* Step number badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-0.5 text-[11px] font-bold text-white shadow-lg shadow-purple-500/20">
                  Step {i + 1}
                </div>
                <div className="mt-2 mb-4 text-4xl transition-transform duration-300 group-hover:scale-125">{step.icon}</div>
                <div className="mb-2 text-lg font-semibold text-zinc-100 group-hover:text-purple-300 transition-colors">
                  {step.title}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden absolute -right-3 top-1/2 h-0.5 w-6 bg-gradient-to-r from-purple-500/40 to-transparent sm:block" />
                )}
              </div>
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
    <section className="relative overflow-hidden border-t border-zinc-800/50 px-4 py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5" />
      {/* Decorative orbs */}
      <div className="hero-orb absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl -z-10" />
      <div className="hero-orb-delay absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl -z-10" />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <AnimateOnView>
          <h2 className="mb-4 text-3xl font-bold text-zinc-100 sm:text-4xl">
            Start Your <span className="gradient-text">AI Creative Journey</span>
          </h2>
        </AnimateOnView>
        <AnimateOnView delay={0.15}>
          <p className="mb-8 text-zinc-400">
            Free to use, no registration required. Explore the hottest GPT Image 2 prompts of {new Date().getFullYear()}
          </p>
        </AnimateOnView>
        <AnimateOnView delay={0.3}>
          <Link
            href="/category"
            className="cta-button-glow inline-block rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-base font-medium text-white transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-purple-500/25 hover:-translate-y-0.5"
          >
            Start Exploring →
          </Link>
        </AnimateOnView>
      </div>
    </section>
  )
}

// ======== Footer ========
function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-4 py-10">
      <div className="mx-auto max-w-7xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white transition-transform group-hover:scale-105">P</div>
          <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
        </div>
        <p className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Prompt Hub &middot; Data source:
          <a href="https://youmind.com/gpt-image-2-prompts" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 ml-1">YouMind</a>
          {' / '}
          <a href="https://prompts.sorry.ink" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Image-Prompts</a>
        </p>
        <div className="flex gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 transition-colors hover:text-purple-400">GitHub</a>
          <Link href="/about" className="text-sm text-zinc-500 transition-colors hover:text-purple-400">About</Link>
        </div>
      </div>
    </footer>
  )
}

// ======== Navigation ========
function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/30">P</div>
          <span className="text-lg font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">Prompt Hub</span>
        </Link>
        <form action="/search" method="GET" className="flex gap-2 flex-1 max-w-lg ml-auto">
          <div className="relative flex-1 group">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input name="q" type="text" placeholder="Search prompts..." className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 focus:bg-zinc-900 transition-all duration-200" />
          </div>
          <button type="submit" className="rounded-xl bg-purple-600 px-4 py-2 text-sm text-white font-medium transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0">Search</button>
        </form>
      </div>
    </nav>
  )
}

// ======== Main Page (Server Component) ========
export default async function HomePage() {
  // Server-side data loading
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

      {/* Hero — server rendered, data available immediately */}
      <HeroSection stats={statsData} />

      {/* Stats bar — server rendered */}
      <StatsSection stats={statsData} />

      {/* Category entry — server rendered with cover images */}
      <CategoriesSection categories={catData} categoryImages={catImages} />

      <div className="border-t border-zinc-800/50" />

      {/* Trending prompts — server rendered */}
      <PromptListSection items={trendingData} title="🔥 Trending Prompts" subtitle="Most viewed prompts" />

      <div className="border-t border-zinc-800/50" />

      {/* Latest prompts — server rendered */}
      <PromptListSection items={latestData} title="✨ Latest Prompts" subtitle="Newly added quality prompts" />

      <div className="border-t border-zinc-800/50" />

      {/* Editor's Picks — reuse top 4 from trending */}
      {trendingData.length > 0 && (
        <>
          <PromptListSection items={trendingData.slice(0, 4)} title="💎 Editor's Picks" subtitle="Curated quality prompts" />
          <div className="border-t border-zinc-800/50" />
        </>
      )}

      {/* How to use — with animations (client wrapper) */}
      <HowToUseSection />

      <div className="border-t border-zinc-800/50" />

      {/* CTA — with animations */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
