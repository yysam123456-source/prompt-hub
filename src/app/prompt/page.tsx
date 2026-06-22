'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PromptDetailClient from '@/components/PromptDetailClient'

export default function PromptPage() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')
  
  const [detail, setDetail] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) {
      setNotFound(true)
      setLoading(false)
      return
    }

    async function loadData() {
      try {
        const res = await fetch('/data/prompts.json')
        const data = await res.json()
        
        const prompts = Array.isArray(data) ? data : (data.prompts || [])
        const prompt = prompts.find((p: any) => p.slug === slug)
        
        if (!prompt) {
          setNotFound(true)
          return
        }
        
        setDetail(prompt)
        
        const relatedPrompts = prompts
          .filter((p: any) => p.category === prompt.category && p.slug !== slug)
          .slice(0, 8)
        setRelated(relatedPrompts)
        
      } catch (error) {
        console.error('Failed to load prompt:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (notFound || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">Prompt not found</p>
        </div>
      </div>
    )
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
