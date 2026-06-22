'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CategoryBar from '@/components/CategoryBar'
import PromptGrid from '@/components/PromptGrid'
import { loadStats, loadCategories, loadTrending, loadLatest, loadRelated } from '@/lib/staticData'
import type { PromptCard, SiteStats, Category } from '@/lib/types'
import AnimatedGradientText from '@/components/animata/text/animated-gradient-text'
import Grid from '@/components/animata/background/grid'

// ======== Hero Section ========
function HeroSection({ stats }: { stats: SiteStats | null }) {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <section className="relative overflow-hidden">
      {/* animata Grid 背景 */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <Grid color="#3b82f6" size={40} />
      </div>

      {/* 渐变背景 */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl -z-10" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl -z-10" />

      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center sm:py-28">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-400" />
          </span>
          {stats ? `${stats.totalPrompts}+ curated GPT Image 2 prompts` : 'Loading...'}
        </motion.div>

        {/* 主标题 - 使用 animata AnimatedGradientText */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-4 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl"
        >
          探索{' '}
          <AnimatedGradientText className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            AI 提示词
          </AnimatedGradientText>
          <br />
          激发创作灵感
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 max-w-xl text-base text-zinc-400 sm:text-lg"
        >
          免费使用高质量 GPT Image 2 提示词，复制即可生成惊艳 AI 图像
        </motion.p>

        {/* 搜索框 */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={handleSearch}
          className="w-full max-w-lg"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                type="text"
                placeholder="搜索提示词... 如：海报、赛博朋克、头像"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 py-3.5 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-500 backdrop-blur-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <button type="submit" className="shrink-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
              搜索
            </button>
          </div>
        </motion.form>

        {/* 快捷标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {['海报设计', '赛博朋克', '头像', '科幻', '水彩'].map(tag => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm transition-colors hover:border-purple-500/50 hover:text-purple-300"
            >
              {tag}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ======== Stats Section ========
function StatsSection({ stats }: { stats: SiteStats | null }) {
  if (!stats) return null

  const items = [
    { label: '提示词总数', value: stats.totalPrompts, suffix: '+' },
    { label: '分类数量', value: stats.totalCategories, suffix: '' },
    { label: '贡献者', value: stats.totalContributors, suffix: '+' },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="border-y border-zinc-800/50 bg-zinc-900/30 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-4 text-center">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-2xl font-bold text-purple-400 sm:text-3xl">
                {item.value}{item.suffix}
              </div>
              <div className="mt-1 text-xs text-zinc-500 sm:text-sm">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======== Section Header ========
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="mb-8 flex items-end justify-between"
    >
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {action}
    </motion.div>
  )
}

// ======== Trending Section ========
function TrendingSection({ items }: { items: PromptCard[] }) {
  if (items.length === 0) return null
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="🔥 热门提示词"
          subtitle="浏览量最高的提示词"
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

// ======== Latest Section ========
function LatestSection({ items }: { items: PromptCard[] }) {
  if (items.length === 0) return null
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="🆕 最新提示词"
          subtitle="最新收录的优质提示词"
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

// ======== Featured Section ========
function FeaturedSection({ items }: { items: PromptCard[] }) {
  if (items.length === 0) return null
  return (
    <section className="px-4 py-16 bg-zinc-900/20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="✨ 编辑精选"
          subtitle="优质提示词精选推荐"
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

// ======== How To Use Section ========
function HowToUseSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const steps = [
    {
      icon: '🔍',
      title: '搜索提示词',
      desc: '在搜索框输入关键词，或点击分类浏览，找到你想要的提示词',
    },
    {
      icon: '📋',
      title: '复制提示词',
      desc: '点击提示词卡片进入详情页，复制完整提示词文本（支持参数替换）',
    },
    {
      icon: '🎨',
      title: '生成图像',
      desc: '将复制的提示词粘贴到 GPT Image 2 或其他 AI 图像生成平台，开始创作',
    },
  ]

  return (
    <section ref={ref} className="border-t border-zinc-800/50 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-zinc-100">如何使用</h2>
          <p className="mt-2 text-zinc-400">3 步快速上手，复制即使用</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center transition-colors hover:border-purple-500/30"
            >
              <div className="mb-4 text-4xl">{step.icon}</div>
              <div className="mb-2 text-lg font-semibold text-zinc-100">
                {i + 1}. {step.title}
              </div>
              <p className="text-sm text-zinc-400">{step.desc}</p>
              {/* 步骤连接线 */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-0.5 w-6 bg-zinc-700 sm:block" />
              )}
            </motion.div>
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
        >
          开始你的 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI 创作之旅</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-zinc-400"
        >
          免费使用，无需注册。立即探索 {new Date().getFullYear()} 最热门的 GPT Image 2 提示词
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/category"
            className="inline-block rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            开始探索
          </Link>
        </motion.div>
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
            P
          </div>
          <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
        </div>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Prompt Hub · 数据来源：
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
            关于
          </Link>
        </div>
      </div>
    </footer>
  )
}

// ======== Main Page ========
export default function HomePage() {
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [trending, setTrending] = useState<PromptCard[]>([])
  const [latest, setLatest] = useState<PromptCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsData, catData, trendingData, latestData] = await Promise.all([
          loadStats(),
          loadCategories(),
          loadTrending(8),
          loadLatest(8),
        ])
        setStats(statsData)
        setCategories(catData)
        setTrending(trendingData)
        setLatest(latestData)
      } catch (e) {
        console.error('Failed to load homepage data', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
          </Link>
          <form action="/search" method="GET" className="flex gap-2 flex-1 max-w-lg ml-auto">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                name="q"
                type="text"
                placeholder="搜索提示词..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
              />
            </div>
            <button type="submit" className="rounded-xl bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700">
              搜索
            </button>
          </form>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection stats={stats} />

      {/* 统计栏 */}
      <StatsSection stats={stats} />

      {/* 分类入口 */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-zinc-100">探索分类</h2>
            <p className="mt-2 text-zinc-400">按分类浏览，找到你需要的提示词</p>
          </div>
          <CategoryBar categories={categories} />
        </div>
      </section>

      <div className="border-t border-zinc-800/50" />

      {/* 热门提示词 */}
      {loading ? (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-zinc-900 animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <TrendingSection items={trending} />
      )}

      <div className="border-t border-zinc-800/50" />

      {/* 最新提示词 */}
      {!loading && <LatestSection items={latest} />}

      <div className="border-t border-zinc-800/50" />

      {/* Featured 精选 */}
      <FeaturedSection items={trending.slice(0, 4)} />

      <div className="border-t border-zinc-800/50" />

      {/* 如何使用 */}
      <HowToUseSection />

      <div className="border-t border-zinc-800/50" />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
