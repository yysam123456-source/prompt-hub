'use client'

import { useState } from 'react'

export default function PromptDetailClient({
  title,
  promptText,
  category,
  tags,
  imageUrl,
}: {
  title: string
  promptText: string
  category: string
  tags: string[]
  imageUrl: string | undefined
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const [copied, setCopied] = useState(false)

  const config: { name: string; emoji: string } = (() => {
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
    return CATEGORY_CONFIG[category] || { name: category, emoji: '💡' }
  })()

  async function handleCopy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(promptText)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = promptText
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center gap-4 px-4 py-3">
          <a href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              P
            </div>
            <span className="text-lg font-bold text-zinc-100 hidden sm:block">Prompt Hub</span>
          </a>

          <div className="h-5 w-px bg-zinc-800" />

          <a href="/" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-400 transition-colors">
            ← Back
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Image Section */}
        {imageUrl && !imgFailed && (
          <div
            className="mb-8 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50 animate-fade-in"
          >
            <div className="relative aspect-[16/9] w-full max-h-[60vh] mx-auto">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-contain bg-zinc-900"
                onError={() => setImgFailed(true)}
              />
            </div>
          </div>
        )}

        {/* Title & Meta */}
        <div
          className="mb-6 animate-fade-in-delay-1"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-sm text-zinc-300 capitalize">
              {config.emoji} {config.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-100 leading-tight">
            {title}
          </h1>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div
            className="mb-8 flex flex-wrap gap-2 animate-fade-in-delay-2"
          >
            {tags.map((tag: string) => (
              <a
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-purple-500/50 hover:text-purple-300 hover:bg-purple-500/5"
              >
                #{tag}
              </a>
            ))}
          </div>
        )}

        {/* Prompt Text */}
        {promptText && (
          <div
            className="mb-8 animate-fade-in-delay-3"
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
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>

            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6">
              <pre className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-zinc-300 font-mono overflow-x-auto">
                {promptText}
              </pre>
            </div>

            <p className="mt-3 text-xs text-zinc-600 text-center">
              Use this prompt with Midjourney, Stable Diffusion, DALL·E, or any AI image generator
            </p>
          </div>
        )}

        {/* Related actions */}
        <div
          className="flex flex-wrap justify-center gap-3 pt-4 border-t border-zinc-800/50 animate-fade-in-delay-4"
        >
          <a
            href={`/search?q=${encodeURIComponent(category)}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-sm text-zinc-400 transition-all hover:border-purple-500/50 hover:text-purple-300"
          >
            View more {config.name} prompts →
          </a>
          <a
            href="/"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-sm text-zinc-400 transition-all hover:border-purple-500/50 hover:text-purple-300"
          >
            🏠 Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
