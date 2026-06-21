import type { Metadata, ResolvingMetadata } from 'next'
import PromptDetailClient from './PromptDetailClient'

function loadPromptData() {
  try {
    const { readFileSync, existsSync } = require('fs')
    const { join } = require('path')
    const possiblePaths = [
      join(process.cwd(), 'public', 'data', 'prompts.json'),
      '/Users/Lenovo/WorkBuddy/2026-06-17-14-51-24/prompt-hub/public/data/prompts.json',
    ]
    for (const p of possiblePaths) {
      if (existsSync(p)) {
        const raw = readFileSync(p, 'utf-8')
        const data = JSON.parse(raw)
        return data.items || []
      }
    }
    return []
  } catch (e) {
    console.error('Failed to load prompts:', e)
    return []
  }
}

export async function generateStaticParams() {
  const items = loadPromptData()
  return items.map((item: any) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const items = loadPromptData()
  const item = items.find((i: any) => i.slug === slug)
  if (!item) return { title: 'Prompt Not Found - Prompt Hub' }
  const title = item.title?.en || item.title || 'Untitled'
  return {
    title: `${title} - Prompt Hub`,
    description: `AI prompt: ${title}`,
  }
}

export default async function PromptDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const items = loadPromptData()
  const detail = items.find((i: any) => i.slug === slug)

  if (!detail) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-zinc-400 mb-4">Prompt not found</p>
          <a href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    )
  }

  const title = detail.title?.en || detail.title || 'Untitled'
  const promptText = detail.prompt || ''
  const category = detail.category || 'other'
  const tags = detail.tags || []
  const imageUrl = detail.primaryImage?.remoteUrl

  return (
    <PromptDetailClient
      title={title}
      promptText={promptText}
      category={category}
      tags={tags}
      imageUrl={imageUrl}
    />
  )
}
