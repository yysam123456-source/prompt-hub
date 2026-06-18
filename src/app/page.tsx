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

// ======== Hero 区 =======
function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* 流星背景 */}
      <AnimatedBeam beamCount={8} />

      {/* Hero 内容 */}
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
        {/* 标签 */}
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
          32,000+ 精选提示词免费使用
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="gradient-text">AI 提示词</span>
          <br />
          <AnimatedText
            text="探索无限可能"
            className="text-zinc-100"
          />
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-10 max-w-2xl text-lg text-zinc-400"
        >
          免费使用超过 32,000 条高质量 AI 绘画提示词
          <br className="hidden sm:block" />
          支持 Midjourney、Stable Diffusion、DALL-E 等主流模型
        </motion.p>

        {/* 搜索框 */}
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
                placeholder="搜索提示词... 如：赛博朋克、奇幻风景"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 py-4 pl-12 pr-6 text-sm text-zinc-100 placeholder-zinc-500 backdrop-blur-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <ShinyButton type="submit" className="rounded-2xl px-8 py-4 text-base">
              搜索
            </ShinyButton>
          </form>
        </motion.div>

        {/* 快速标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {['赛博朋克', '奇幻风景', '人像摄影', '科幻城市', '水彩画'].map((tag) => (
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

// ======== 分类区（Bento Grid）========
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
            探索 <span className="gradient-text">分类</span>
          </h2>
          <p className="mt-3 text-zinc-400">
            按类别浏览提示词，找到你需要的创作灵感
          </p>
        </motion.div>

        <CategoryBar />
      </div>
    </section>
  )
}

// ======== 最新提示词 =======
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
              🆕 最新提示词
            </h2>
            <p className="mt-2 text-zinc-400">刚刚加入库中的精选提示词</p>
          </div>
          <Link
            href="/search"
            className="text-sm text-purple-400 transition-colors hover:text-purple-300"
          >
            查看全部 →
          </Link>
        </motion.div>

        <PromptGrid items={items} />
      </div>
    </section>
  )
}

// ======== 热门提示词 =======
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
              🔥 热门提示词
            </h2>
            <p className="mt-2 text-zinc-400">社区最受欢迎的提示词</p>
          </div>
          <Link
            href="/search?sort=hot"
            className="text-sm text-purple-400 transition-colors hover:text-purple-300"
          >
            查看全部 →
          </Link>
        </motion.div>

        <PromptGrid items={items} />
      </div>
    </section>
  )
}

// ======== CTA 区 =======
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
          开始你的
          <span className="gradient-text"> AI 创作之旅</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 text-lg text-zinc-400"
        >
          免费使用，无需注册，即刻开始探索
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
              开始探索
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
          © 2026 Prompt Hub. 免费 AI 提示词库。
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-zinc-500 transition-colors hover:text-purple-400">
            GitHub
          </a>
          <a href="#" className="text-zinc-500 transition-colors hover:text-purple-400">
            关于
          </a>
        </div>
      </div>
    </footer>
  )
}

// ======== 主页面 =======
export default function HomePage() {
  const [latest, setLatest] = useState<any[]>([])
  const [hottest, setHottest] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res1 = await fetch('/data/lists/latest-1.json')
        const latestData = await res1.json()
        setLatest(latestData)

        const res2 = await fetch('/data/lists/hottest-1.json')
        const hottestData = await res2.json()
        setHottest(hottestData)
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
      {/* 导航栏 */}
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
      <HeroSection />

      {/* 分割线 */}
      <div className="mx-auto max-w-7xl border-t border-zinc-800/50" />

      {/* 分类 */}
      <CategorySection />

      <div className="mx-auto max-w-7xl border-t border-zinc-800/50" />

      {/* 最新 */}
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

      {/* 热门 */}
      {!loading && <HottestSection items={hottest} />}

      <div className="border-t border-zinc-800/50" />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
