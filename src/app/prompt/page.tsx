'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function PromptDetailContent() {
  // Read slug from URL search params (client-side)
  const [slug, setSlug] = useState<string | null>(null)
  const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Read slug from URL on mount and on URL change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSlug(params.get('slug'))
  }, [])

  useEffect(() => {
    if (!slug) return
    async function load() {
      try {
        const res = await fetch(`/api/prompts/${slug}`)
        if (res.ok) {
          const data = await res.json()
          // Transform API response to display format
          const transformed = {
            title_en: data.title?.en || '',
            title_zh: data.title?.zh || '',
            prompt_en: data.prompt?.en || '',
            prompt_zh: data.prompt?.zh || '',
            category_name_en: data.category?.name?.en || '',
            category_name_zh: data.category?.name?.zh || '',
            tags_en: data.tags?.map((t: any) => t.name?.en || '').filter(Boolean) || [],
            tags_zh: data.tags?.map((t: any) => t.name?.zh || '').filter(Boolean) || [],
            primaryImage: data.primaryImage || {},
            view_count: data.viewCount || 0,
            like_count: data.likeCount || 0,
            sourceUrl: data.sourceUrl || '',
          }
          setDetail(transformed)
        } else if (res.status === 404) {
          setDetail(null)
        }
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

  const displayTitle = detail.title_en || detail.title_zh || 'Untitled'
  const displayPrompt = detail.prompt_en || detail.prompt_zh || ''

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
            {displayTitle}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-8">
            {detail.category_name_en && (
              <span className="flex items-center gap-1">
                📂 {detail.category_name_en}
              </span>
            )}
            {detail.view_count !== undefined && (
              <span className="flex items-center gap-1">👁️ {detail.view_count}</span>
            )}
            {detail.like_count !== undefined && (
              <span className="flex items-center gap-1">❤️ {detail.like_count}</span>
            )}
          </div>
        </motion.div>

        {/* Image */}
        {detail.primaryImage?.remoteUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 overflow-hidden rounded-2xl border border-zinc-800"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={detail.primaryImage.remoteUrl}
              alt={displayTitle}
              className="w-full"
            />
          </motion.div>
        )}

        {/* Tags */}
        {detail.tags_en && detail.tags_en.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10 flex flex-wrap gap-2"
          >
            {detail.tags_en.map((tag: string) => (
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
        {displayPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10"
          >
            <h2 className="mb-4 text-xl font-semibold text-zinc-100">Prompt</h2>
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300 font-mono">
                {displayPrompt}
              </pre>
              <button
                onClick={async () => {
                  const text = displayPrompt;
                  if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                  } else {
                    // Fallback for non-HTTPS or older browsers
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

        {/* Source link */}
        {detail.sourceUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href={detail.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-3 text-sm text-purple-400 transition-colors hover:border-purple-500/50"
            >
              View Source →
            </a>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function PromptPage() {
  return <PromptDetailContent />
}
