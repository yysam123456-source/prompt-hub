import Link from 'next/link'
import CategoryBar from '@/components/CategoryBar'
import PromptGrid from '@/components/PromptGrid'
import { loadStats, loadCategories, loadTrending, loadLatest } from '@/lib/staticData.server'
import type { SiteStats, Category, PromptCard } from '@/lib/types'
import AnimatedGradientText from '@/components/animata/text/animated-gradient-text'
import Grid from '@/components/animata/background/grid'
import HomePageClient, { SearchBox, AnimateOnView, AnimateCard } from './HomePageClient'

// ======== Hero Section (Server Component — 静态渲染) ========
function HeroSection({ stats }: { stats: SiteStats }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-20">
        <Grid color="#3b82f6" size={40} style={{ backgroundColor: 'transparent' }} />
      </div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl -z-10" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl -z-10" />

      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center sm:py-28">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-full w-2 rounded-full bg-purple-400" />
          </span>
          {stats.totalPrompts}+ curated GPT Image 2 prompts
        </div>

        {/* 主标题 */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
          探索{' '}
          <AnimatedGradientText className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            AI 提示词
          </AnimatedGradientText>
          <br />
          激发创作灵感
        </h1>

        {/* 副标题 */}
        <p className="mb-8 max-w-xl text-base text-zinc-400 sm:text-lg">
          免费使用高质量 GPT Image 2 提示词，复制即可生成惊艳 AI 图像
        </p>

        {/* 搜索框 — Client Component */}
        <SearchBox />

        {/* 快捷标签 */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['海报设计', '赛博朋克', '头像', '科幻', '水彩'].map(tag => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm transition-colors hover:border-purple-500/50 hover:text-purple-300"
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
    { label: '提示词总数', value: stats.totalPrompts, suffix: '+' },
    { label: '分类数量', value: stats.totalCategories, suffix: '' },
    { label: '贡献者', value: stats.totalContributors, suffix: '+' },
  ]

  return (
    <section className="border-y border-zinc-800/50 bg-zinc-900/30 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-4 text-center">
          {items.map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-bold text-purple-400 sm:text-3xl">
                {item.value}{item.suffix}
              </div>
              <div className="mt-1 text-xs text-zinc-500 sm:text-sm">{item.label}</div>
            </div>
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
              查看全部 →
            </Link>
          }
        />
        <PromptGrid items={items} />
      </div>
    </section>
  )
}

// ======== Categories Section ========
function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-zinc-100">探索分类</h2>
          <p className="mt-2 text-zinc-400">按分类浏览，找到你需要的提示词</p>
        </div>
        <CategoryBar categories={categories} />
      </div>
    </section>
  )
}

// ======== How To Use Section (with animation via client wrapper) ========
function HowToUseSection() {
  const steps = [
    { icon: '🔍', title: '搜索提示词', desc: '在搜索框输入关键词，或点击分类浏览，找到你想要的提示词' },
    { icon: '📋', title: '复制提示词', desc: '点击提示词卡片进入详情页，复制完整提示词文本（支持参数替换）' },
    { icon: '🎨', title: '生成图像', desc: '将复制的提示词粘贴到 GPT Image 2 或其他 AI 图像生成平台，开始创作' },
  ]

  return (
    <section className="border-t border-zinc-800/50 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <AnimateOnView className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-100">如何使用</h2>
          <p className="mt-2 text-zinc-400">3 步快速上手，复制即使用</p>
        </AnimateOnView>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <AnimateCard key={i} delay={i * 0.15}>
              <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center transition-colors hover:border-purple-500/30">
                <div className="mb-4 text-4xl">{step.icon}</div>
                <div className="mb-2 text-lg font-semibold text-zinc-100">
                  {i + 1}. {step.title}
                </div>
                <p className="text-sm text-zinc-400">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-0.5 w-6 bg-zinc-700 sm:block" />
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
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <AnimateOnView>
          <h2 className="mb-4 text-3xl font-bold text-zinc-100 sm:text-4xl">
            开始你的 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI 创作之旅</span>
          </h2>
        </AnimateOnView>
        <AnimateOnView delay={0.15}>
          <p className="mb-8 text-zinc-400">
            免费使用，无需注册。立即探索 {new Date().getFullYear()} 最热门的 GPT Image 2 提示词
          </p>
        </AnimateOnView>
        <AnimateOnView delay={0.3}>
          <Link
            href="/category"
            className="inline-block rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            开始探索
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">P</div>
          <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
        </div>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Prompt Hub · 数据来源：
          <a href="https://youmind.com/gpt-image-2-prompts" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 ml-1">YouMind</a>
          {' / '}
          <a href="https://prompts.sorry.ink" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Image-Prompts</a>
        </p>
        <div className="flex gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 transition-colors hover:text-purple-400">GitHub</a>
          <Link href="/about" className="text-sm text-zinc-500 transition-colors hover:text-purple-400">关于</Link>
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm transition-transform group-hover:scale-105">P</div>
          <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
        </Link>
        <form action="/search" method="GET" className="flex gap-2 flex-1 max-w-lg ml-auto">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input name="q" type="text" placeholder="搜索提示词..." className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20" />
          </div>
          <button type="submit" className="rounded-xl bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700">搜索</button>
        </form>
      </div>
    </nav>
  )
}

// ======== Main Page (Server Component) ========
export default async function HomePage() {
  // 服务端加载数据
  const [statsData, catData, trendingData, latestData] = await Promise.all([
    loadStats(),
    loadCategories(),
    loadTrending(8),
    loadLatest(8),
  ])

  return (
    <main className="min-h-screen bg-zinc-950">
      <NavBar />

      {/* Hero — 服务端渲染，数据直接可用 */}
      <HeroSection stats={statsData} />

      {/* 统计栏 — 服务端渲染 */}
      <StatsSection stats={statsData} />

      {/* 分类入口 — 服务端渲染 */}
      <CategoriesSection categories={catData} />

      <div className="border-t border-zinc-800/50" />

      {/* 热门提示词 — 服务端渲染 */}
      <PromptListSection items={trendingData} title="🔥 热门提示词" subtitle="浏览量最高的提示词" />

      <div className="border-t border-zinc-800/50" />

      {/* 最新提示词 — 服务端渲染 */}
      <PromptListSection items={latestData} title="🆕 最新提示词" subtitle="最新收录的优质提示词" />

      <div className="border-t border-zinc-800/50" />

      {/* 精选 — 复用热门数据前4条 */}
      {trendingData.length > 0 && (
        <>
          <PromptListSection items={trendingData.slice(0, 4)} title="✨ 编辑精选" subtitle="优质提示词精选推荐" />
          <div className="border-t border-zinc-800/50" />
        </>
      )}

      {/* 如何使用 — 带动画的客户端组件 */}
      <HowToUseSection />

      <div className="border-t border-zinc-800/50" />

      {/* CTA — 带动画 */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
