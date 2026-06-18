'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const CATEGORY_CONFIG: Record<string, { name: string; emoji: string }> = {
  'portrait':    { name: 'Portrait', emoji: '👤' },
  'landscape':   { name: 'Landscape', emoji: '🏔️' },
  'fantasy':     { name: 'Fantasy', emoji: '🐉' },
  'sci-fi':      { name: 'Sci-Fi', emoji: '🚀' },
  'anime':       { name: 'Anime', emoji: '🎌' },
  'abstract':    { name: 'Abstract', emoji: '🎨' },
  'architecture':{ name: 'Architecture', emoji: '🏛️' },
  'animal':      { name: 'Animal', emoji: '🦁' },
  'food':        { name: 'Food', emoji: '🍜' },
  'fashion':     { name: 'Fashion', emoji: '👗' },
  'horror':      { name: 'Horror', emoji: '👻' },
  'cyberpunk':   { name: 'Cyberpunk', emoji: '🌆' },
}

function getConfig(category: string) {
  return CATEGORY_CONFIG[category] || { name: category, emoji: '💡' }
}


function PromptDetailContent() {
  const [slug, setSlug] = useState<string | null>(null)
  const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imgFailed, setImgFailed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSlug(params.get('slug'))
  }, [])

  useEffect(() => {
    if (!slug) return
    async function load() {
      try {
        const res = await fetch('/data/prompts.json')
        const data = await res.json()
        const items = data.items || []
        const found = items.find((item: any) => item.slug === slug)
        setDetail(found || null)
      } catch (e) {
        console.error('Failed to load detail', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  // Reset image state when detail changes
  useEffect(() => {
    setImgFailed(false)
    setCopied(false)
  }, [detail?.slug])

  if (!slug) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">No prompt specified</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-zinc-400 mb-4">Prompt not found</p>
          <button
            onClick={() => window.history.back()}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  const title = detail.title?.en || detail.title || 'Untitled'
  const promptText = detail.prompt || ''
  const category = detail.category || 'other'
  const tags = detail.tags || []
  const config = getConfig(category)
  const imageUrl = detail.primaryImage?.remoteUrl

  async function handleCopy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(promptText)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = promptText
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silent fail
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100 hidden sm:block">Prompt Hub</span>
          </Link>

          <div className="h-5 w-px bg-zinc-800" />

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* ====== Image Section (Top) ====== */}
        {imageUrl && !imgFailed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50"
          >
            <div className="relative aspect-[16/9] w-full max-h-[60vh] mx-auto">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-contain bg-zinc-900"
                onError={() => setImgFailed(true)}
              />
            </div>
          </motion.div>
        )}

        {/* ====== Title & Meta ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-sm text-zinc-300 capitalize">
              {config.emoji} {config.name}
            </span>
            <span className="flex items-center gap-1 text-sm text-zinc-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
              {detail.viewCount?.toLocaleString() ?? 0}
            </span>
            <span className="flex items-center gap-1 text-sm text-zinc-500">
              ❤️ {detail.likeCount?.toLocaleString() ?? 0}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-100 leading-tight">
            {title}
          </h1>
        </motion.div>

        {/* ====== Tags ====== */}
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            {tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-purple-500/50 hover:text-purple-300 hover:bg-purple-500/5"
              >
                #{tag}
              </Link>
            ))}
          </motion.div>
        )}

        {/* ====== Prompt Text ====== */}
        {promptText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                <span className="text-purple-400">✦</span> Prompt Text
              </h2>
              <button
                onClick={handleCopy}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  copied
                    ? 'border-green-500/50 bg-green-500/10 text-green-400'
                    : 'border-zinc-700 bg-zinc-900/80 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
                }`}
              >
                {copied ? (
                  <>✅ Copied!</>
                ) : (
                  <>📋 Copy</>
                )}
              </button>
            </div>

            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6">
              <pre className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-zinc-300 font-mono overflow-x-auto">
                {promptText}
              </pre>
            </div>

            {/* Usage hint */}
            <p className="mt-3 text-xs text-zinc-600 text-center">
              Use this prompt with Midjourney, Stable Diffusion, DALL·E, or any AI image generator
            </p>
          </motion.div>
        )}

        {/* ====== Related actions ====== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 pt-4 border-t border-zinc-800/50"
        >
          <Link
            href={`/search?q=${encodeURIComponent(category)}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-sm text-zinc-400 transition-all hover:border-purple-500/50 hover:text-purple-300"
          >
            View more {config.name} prompts →
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-sm text-zinc-400 transition-all hover:border-purple-500/50 hover:text-purple-300"
          >
            🏠 Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}


export default function PromptPage() {
  return <PromptDetailContent />
}
