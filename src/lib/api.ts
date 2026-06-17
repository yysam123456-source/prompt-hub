// API调用封装

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function getPrompts(params: {
  page?: number
  limit?: number
  category?: string
  search?: string
}) {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.category) searchParams.set('category', params.category)
  if (params.search) searchParams.set('q', params.search)
  
  const url = `${BASE_URL}/api/prompts?${searchParams.toString()}`
  const res = await fetch(url, { cache: 'no-store' })
  
  if (!res.ok) {
    throw new Error('Failed to fetch prompts')
  }
  
  return res.json()
}

export async function getPrompt(slug: string) {
  const url = `${BASE_URL}/api/prompts/${slug}`
  const res = await fetch(url, { cache: 'no-store' })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}
