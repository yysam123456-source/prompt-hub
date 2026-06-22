import Fuse from 'fuse.js'

export interface PromptItem {
  id: string
  title: string
  titleEn?: string
  prompt: string
  category?: string
  tags?: string[]
  viewCount?: number
  likeCount?: number
  approvedAt?: string
  image?: string
  author?: string
}

// Fuse.js options with weighted fields
export const FUSE_OPTIONS = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'titleEn', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'prompt', weight: 0.08 },
    { name: 'category', weight: 0.02 },
  ],
  threshold: 0.4,
  distance: 100,
  includeMatches: true,
  includeScore: true,
  minMatchCharLength: 1,
}

export function createFuseIndex(data: PromptItem[]) {
  return new Fuse(data, FUSE_OPTIONS)
}

// Get search suggestions from data (titles + tags)
export function getSuggestions(data: PromptItem[], limit = 8): string[] {
  const set = new Set<string>()
  const suggestions: string[] = []

  // Add titles
  data.forEach(item => {
    if (item.title && !set.has(item.title)) {
      set.add(item.title)
      suggestions.push(item.title)
    }
  })

  // Add tags
  data.forEach(item => {
    if (suggestions.length >= limit) return
    ;(item.tags || []).forEach(tag => {
      if (!set.has(tag) && suggestions.length < limit) {
        set.add(tag)
        suggestions.push(tag)
      }
    })
  })

  return suggestions
}

// Filter suggestions based on input
export function getFilteredSuggestions(
  data: PromptItem[],
  input: string,
  limit = 8
): { text: string; type: 'title' | 'tag' | 'category' }[] {
  if (!input || input.length < 1) return []
  const q = input.toLowerCase()
  const results: { text: string; type: 'title' | 'tag' | 'category' }[] = []
  const seen = new Set<string>()

  // Match titles
  data.forEach(item => {
    if (results.length >= limit) return
    const title = item.title || ''
    if (title.toLowerCase().includes(q) && !seen.has(title)) {
      seen.add(title)
      results.push({ text: title, type: 'title' })
    }
  })

  // Match tags
  data.forEach(item => {
    if (results.length >= limit) return
    ;(item.tags || []).forEach(tag => {
      if (tag.toLowerCase().includes(q) && !seen.has(tag)) {
        seen.add(tag)
        results.push({ text: tag, type: 'tag' })
      }
    })
  })

  // Match categories
  data.forEach(item => {
    if (results.length >= limit) return
    const cat = item.category || ''
    const label = cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    if (label.toLowerCase().includes(q) && !seen.has(label)) {
      seen.add(label)
      results.push({ text: label, type: 'category' })
    }
  })

  return results
}

// Search history management (localStorage)
const HISTORY_KEY = 'prompt-hub-search-history'
const MAX_HISTORY = 12

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addSearchHistory(query: string) {
  if (typeof window === 'undefined') return
  const trimmed = query.trim()
  if (!trimmed) return
  const history = getSearchHistory()
  const filtered = history.filter(h => h !== trimmed)
  const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

export function removeSearchHistory(query: string) {
  if (typeof window === 'undefined') return
  const history = getSearchHistory()
  const updated = history.filter(h => h !== query)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

export function clearSearchHistory() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(HISTORY_KEY)
}

// Hot searches (static popular terms)
export const HOT_SEARCHES = [
  'Cyberpunk',
  'Portrait',
  'Poster',
  'Anime',
  'Product Photography',
  'Logo Design',
  'Fantasy',
  'Sci-Fi',
  'Minimalist',
  'Character Design',
  'Landscape',
  'Food Photography',
]

// Highlight matching text in a string
export function highlightText(text: string, query: string): React.ReactNode[] {
  if (!query || !text) return [text]
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const idx = lowerText.indexOf(lowerQuery)
  if (idx === -1) return [text]
  return [
    text.slice(0, idx),
    <mark key="hl" className="bg-purple-500/30 text-purple-200 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>,
    text.slice(idx + query.length),
  ]
}
