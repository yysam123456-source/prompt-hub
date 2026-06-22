'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function PromptDetailClient({
  title,
  promptText,
  promptZh,
  category,
  categoryZh,
  tags,
  imageUrl,
  images = [],
  negativePrompt,
  viewCount = 0,
  likeCount = 0,
  sourceSite = '',
  sourceUrl = '',
  slug = '',
  related = [],
}: {
  title: string
  promptText: string
  promptZh?: string
  category: string
  categoryZh?: string
  tags: string[]
  imageUrl: string | undefined
  images?: string[]
  negativePrompt?: string
  viewCount?: number
  likeCount?: number
  sourceSite?: string
  sourceUrl?: string
  slug?: string
  related?: any[]
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showZh, setShowZh] = useState(false)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  // Use pre-rendered related data (passed as props for static export)
  const displayRelated = related || []

  async function handleCopy(text: string) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = text
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

  const displayPrompt = showZh && promptZh ? promptZh : promptText

  // Detect if prompt is structured JSON format (check original promptText)
  const isJsonPrompt = (() => {
    const trimmed = (promptText || '').trim()
    if (!trimmed) return false
    return (trimmed.startsWith('{') || trimmed.startsWith('['))
  })()

  // Pretty-print JSON prompts for display only (not for copy)
  function tryPrettyPrint(text: string): string {
    try {
      const parsed = JSON.parse(text)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return text
    }
  }

  const formattedDisplay = isJsonPrompt
    ? tryPrettyPrint(displayPrompt)
    : displayPrompt

  // Parse argument placeholders from the ORIGINAL English prompt (for copy)
  const argRegex = /\{argument\s+name="([^"]+)"(?:\s+default="([^"]*)")?\s*\}/g
  const args: Array<{name: string, defaultValue: string}> = []
  let match
  const promptTextCopy = promptText
  while ((match = argRegex.exec(promptTextCopy)) !== null) {
    args.push({
      name: match[1],
      defaultValue: match[2] || '',
    })
  }
  const hasArguments = args.length > 0
  const [argValues, setArgValues] = useState<Record<string, string>>({})
  useEffect(() => {
    if (hasArguments) {
      const initial: Record<string, string> = {}
      args.forEach(arg => {
        initial[arg.name] = arg.defaultValue
      })
      setArgValues(initial)
    }
  }, [hasArguments])

  // getFinalPrompt: always returns English prompt with arguments filled in (for copy)
  function getFinalPrompt(): string {
    let final = promptText
    if (hasArguments) {
      args.forEach(arg => {
        const placeholder = `{argument name="${arg.name}"${arg.defaultValue ? ` default="${arg.defaultValue}"` : ''}}`
        final = final.replace(placeholder, argValues[arg.name] || arg.defaultValue)
      })
    }
    return final
  }

  // Category config — all categories with English labels
  const categoryConfig: Record<string, { name: string; emoji: string }> = {
    'article-covers': { name: 'Article Covers', emoji: '📖' },
    'profile-avatar': { name: 'Profile Avatar', emoji: '👤' },
    'social-media-post': { name: 'Social Media Post', emoji: '📱' },
    'infographic': { name: 'Infographic', emoji: '📊' },
    'youtube-thumbnail': { name: 'YouTube Thumbnail', emoji: '🎬' },
    'comic': { name: 'Comic', emoji: '📚' },
    'poster': { name: 'Poster', emoji: '🎨' },
    'app-web-design': { name: 'App Web Design', emoji: '💻' },
    'anime_game': { name: 'Anime & Game', emoji: '🎮' },
    'character': { name: 'Character', emoji: '👤' },
    'product-photography': { name: 'Product Photography', emoji: '📷' },
    'fashion': { name: 'Fashion', emoji: '👗' },
    'architecture': { name: 'Architecture', emoji: '🏛️' },
    'food-drink': { name: 'Food & Drink', emoji: '🍜' },
    'nature-landscape': { name: 'Nature & Landscape', emoji: '🌿' },
    'abstract-geometric': { name: 'Abstract & Geometric', emoji: '🔷' },
    'vintage-retro': { name: 'Vintage & Retro', emoji: '📻' },
    'other': { name: 'Other', emoji: '💡' },
  }
  // Fallback: format slug to readable English (no Chinese)
  const config = categoryConfig[category] || {
    name: category.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    emoji: '💡',
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
          <Link href="/" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-400 transition-colors">
            ← Back
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500 animate-fade-in">
          <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category?cat=${category}`} className="hover:text-purple-400 transition-colors">
            {config.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-400 truncate max-w-[200px]">{title}</span>
        </nav>

        {/* Image Section - click to enlarge */}
        {imageUrl && !imgFailed && (
          <div
            className="mb-8 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50 animate-fade-in cursor-pointer"
            onClick={() => setLightboxImg(imageUrl)}
          >
            <div className="relative aspect-[16/9] w-full max-h-[60vh] mx-auto">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-contain bg-zinc-900 hover:scale-[1.02] transition-transform duration-300"
                onError={() => setImgFailed(true)}
              />
            </div>
            <div className="text-center py-2 text-xs text-zinc-600">Click image to enlarge</div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxImg && (
          <div
            className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <img
              src={lightboxImg}
              alt="Enlarged"
              className="max-h-full max-w-full object-contain rounded-xl"
            />
            <button
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-zinc-900/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxImg(null) }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Title & Meta */}
        <div className="mb-6 animate-fade-in-delay-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-sm text-zinc-300 capitalize">
              {config.emoji} {config.name}
            </span>
            {viewCount > 0 && (
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                👁️ {viewCount.toLocaleString()}
              </span>
            )}
            {likeCount > 0 && (
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                ❤️ {likeCount.toLocaleString()}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-100 leading-tight">
            {title}
          </h1>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 animate-fade-in-delay-2">
            {tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-purple-500/50 hover:text-purple-300 hover:bg-purple-500/5"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Prompt Text */}
        {promptText && (
          <div className="mb-8 animate-fade-in-delay-3">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                <span className="text-purple-400">✦</span> Prompt Text
                {isJsonPrompt && (
                  <span className="text-xs rounded-full bg-amber-500/20 text-amber-400 px-2 py-0.5 border border-amber-500/30">
                    Structured JSON
                  </span>
                )}
              </h2>
              <div className="flex gap-2">
                {promptZh && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowZh(!showZh)}
                    className="text-xs border-zinc-700 text-zinc-400 hover:text-purple-300 gap-1"
                  >
                    {showZh ? '🇺🇸 EN' : '🇨🇳 中文'}
                  </Button>
                )}
                <Button
                  variant={copied ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCopy(getFinalPrompt())}
                  className={copied ? "bg-green-600 hover:bg-green-700" : "border-zinc-700 text-zinc-400 hover:text-purple-300"}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </Button>
              </div>
            </div>

            {/* Argument inputs */}
            {hasArguments && (
              <div className="mb-6 space-y-4">
                <h3 className="text-sm font-medium text-zinc-400">Customize Parameters:</h3>
                {args.map((arg: any) => (
                  <div key={arg.name} className="flex items-center gap-3">
                    <label className="text-sm text-zinc-400 min-w-[120px]">{arg.name}:</label>
                    <input
                      type="text"
                      value={argValues[arg.name] || ''}
                      onChange={(e) => setArgValues(prev => ({ ...prev, [arg.name]: e.target.value }))}
                      placeholder={arg.defaultValue}
                      className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6">
              <pre className={`whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-zinc-300 overflow-x-auto ${isJsonPrompt ? 'text-xs' : 'font-mono'}`}>
                {formattedDisplay}
              </pre>
            </div>

            <p className="mt-3 text-xs text-zinc-600 text-center">
              Use this prompt with GPT Image 2, Midjourney, Stable Diffusion, or any AI image generator
            </p>
          </div>
        )}

        {/* Negative Prompt */}
        {negativePrompt && (
          <div className="mb-8 animate-fade-in-delay-3">
            <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2 mb-4">
              <span className="text-red-400">✖</span> Negative Prompt
            </h2>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400 font-mono">
                {negativePrompt}
              </pre>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {images.length > 1 && (
          <div className="mb-8 animate-fade-in-delay-4">
            <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2 mb-4">
              <span className="text-blue-400">🖼️</span> More Images
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.slice(1).map((img: string, i: number) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 cursor-pointer"
                  onClick={() => setLightboxImg(img)}
                >
                  <img src={img} alt={`${title} ${i + 2}`} className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source Info */}
        {(sourceSite || sourceUrl) && (
          <div className="mb-8 animate-fade-in-delay-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 flex items-center gap-4 text-sm">
              {sourceSite && (
                <span className="text-zinc-500">
                  Source: <span className="text-zinc-400">{sourceSite}</span>
                </span>
              )}
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View Original →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Try it now button */}
        <div className="mb-8 animate-fade-in-delay-4">
          <a
            href={`https://chat.openai.com/?prompt=${encodeURIComponent(promptText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-center text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            🚀 Try it now in ChatGPT
          </a>
          <p className="mt-2 text-center text-xs text-zinc-600">
            Click to open ChatGPT with this prompt pre-filled
          </p>
        </div>

        {/* Related Prompts */}
        {displayRelated.length > 0 && (
          <div className="mb-8 animate-fade-in-delay-4">
            <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2 mb-4">
              <span className="text-purple-400">🔗</span> Related Prompts
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {related.map((item: any) => (
                  <Link
                    key={item.slug}
                    href={`/prompt?slug=${item.slug}`}
                    className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-purple-500/30 transition-colors"
                  >
                  <div className="aspect-square overflow-hidden">
                    <img src={item.imageUrl || item.images?.[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium text-zinc-200 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related actions */}
        <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-zinc-800/50 animate-fade-in-delay-4">
          <Link
            href={`/category?cat=${category}`}
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
        </div>
      </div>
    </div>
  )
}
