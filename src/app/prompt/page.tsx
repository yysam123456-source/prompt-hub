'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Client-side prompt detail: fetches from /data/prompts.json
function PromptDetailContent() {
  const [slug, setSlug] = useState<string | null>(null)
  const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Read slug from URL on mount
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
            className="text-purple-400 hover:text-purple-300"
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

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100">Prompt Hub</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="ml-4 text-sm text-zinc-400 hover:text-purple-400"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Title area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl mb-4">
            {title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-8">
            <span className="flex items-center gap-1 capitalize">
              📂 {category.replace(/-/g, ' ')}
            </span>
            <span className="flex items-center gap-1">👁️ {detail.viewCount ?? 0}</span>
            <span className="flex items-center gap-1">❤️ {detail.likeCount ?? 0}</span>
          </div>
        </motion.div>

        {/* Tags */}
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 flex flex-wrap gap-2"
          >
            {tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-purple-500/50 hover:text-purple-300"
              >
                {tag}
              </Link>
            ))}
          </motion.div>
        )}

        {/* Prompt text */}
        {promptText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="mb-4 text-xl font-semibold text-zinc-100">Prompt</h2>
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300 font-mono">
                {promptText}
              </pre>
              <button
                onClick={async () => {
                  const text = promptText;
                  if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                  } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                  }
                  alert('Copied to clipboard!');
                }}
                className="absolute right-4 top-4 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-purple-500/50 hover:text-purple-300"
              >
                📋 Copy
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function PromptPage() {
  return <PromptDetailContent />
}
