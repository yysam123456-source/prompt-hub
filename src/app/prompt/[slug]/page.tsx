import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import PromptDetailClient from './PromptDetailClient'
import { loadPromptsData, loadPromptDetail, loadRelated } from '@/lib/staticData'

export async function generateStaticParams() {
  const data = await loadPromptsData()
  return data.prompts.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const detail = await loadPromptDetail(slug)
  if (!detail) return { title: 'Prompt Not Found - Prompt Hub' }
  
  const baseUrl = 'https://prompt-hub.com' // 替换为实际域名
  const imageUrl = detail.imageUrl || `${baseUrl}/og-image.png`
  
  return {
    title: `${detail.title} - Prompt Hub`,
    description: detail.promptZh || detail.prompt?.slice(0, 160) || `AI prompt: ${detail.title}`,
    openGraph: {
      title: detail.title,
      description: detail.promptZh || detail.prompt?.slice(0, 160) || '',
      images: [imageUrl],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: detail.title,
      description: detail.promptZh || detail.prompt?.slice(0, 160) || '',
      images: [imageUrl],
    },
  }
}

export default async function PromptDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const detail = await loadPromptDetail(slug)
  const related = detail ? await loadRelated(slug, detail.category, 8) : []

  if (!detail) {
    notFound()
  }

  return (
    <PromptDetailClient
      title={detail.title}
      promptText={detail.prompt || ''}
      category={detail.category}
      categoryZh={detail.categoryZh}
      tags={detail.tags}
      imageUrl={detail.imageUrl}
      promptZh={detail.promptZh}
      negativePrompt={detail.negativePrompt}
      images={detail.images}
      viewCount={detail.viewCount}
      likeCount={detail.likeCount}
      sourceSite={detail.sourceSite}
      sourceUrl={detail.sourceUrl}
      slug={detail.slug}
      related={related}
    />
  )
}
