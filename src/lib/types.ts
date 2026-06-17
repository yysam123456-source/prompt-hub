export interface Prompt {
  slug: string
  title_zh?: string
  title_en?: string
  prompt_zh?: string
  prompt_en?: string
  negative_prompt_zh?: string
  negative_prompt_en?: string
  category?: string
  tags?: string[]
  image_url?: string
  images?: { url: string; alt?: string }[]
  source_site?: string
  source_url?: string
  view_count?: number
  like_count?: number
  favorite_count?: number
  created_at?: string
}

export interface PromptsResponse {
  items: Prompt[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
