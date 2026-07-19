// Single source of truth for category taxonomy.
// These 16 slugs are the ONLY category values present in public/data/prompts.json.
// Both CategoryBar (home) and PromptGrid (cards) MUST read from here so their
// labels/emojis/gradients never drift out of sync with the data again.

export interface CategoryConfig {
  label: string
  gradient: string
  emoji: string
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  other:                  { label: 'Other',          gradient: 'from-zinc-600/90 to-zinc-800/90',      emoji: '📦' },
  graphic_design:         { label: 'Graphic Design', gradient: 'from-blue-600/90 to-indigo-900/90',    emoji: '✏️' },
  anime_game:             { label: 'Anime & Game',   gradient: 'from-pink-600/90 to-rose-900/90',      emoji: '🎮' },
  photography:            { label: 'Photography',    gradient: 'from-amber-600/90 to-orange-900/90',   emoji: '📷' },
  branding_visual:        { label: 'Branding',       gradient: 'from-violet-600/90 to-purple-900/90',  emoji: '🎨' },
  character:              { label: 'Character',      gradient: 'from-rose-600/90 to-red-900/90',       emoji: '👤' },
  illustration:           { label: 'Illustration',   gradient: 'from-teal-600/90 to-cyan-900/90',      emoji: '🖌️' },
  ecommerce:              { label: 'E-commerce',     gradient: 'from-green-600/90 to-emerald-900/90',  emoji: '🛒' },
  tech_scifi:             { label: 'Sci-Fi & Tech',  gradient: 'from-cyan-600/90 to-blue-900/90',      emoji: '🚀' },
  novel_story:            { label: 'Novel & Story',  gradient: 'from-fuchsia-600/90 to-pink-900/90',   emoji: '📖' },
  architecture_interior:  { label: 'Architecture',   gradient: 'from-stone-600/90 to-zinc-900/90',     emoji: '🏛️' },
  landscape_scene:        { label: 'Landscape',      gradient: 'from-emerald-600/90 to-green-900/90',  emoji: '🏔️' },
  food:                   { label: 'Food & Drink',   gradient: 'from-red-600/90 to-orange-900/90',     emoji: '🍜' },
  cultural_products:      { label: 'Cultural',       gradient: 'from-yellow-600/90 to-amber-900/90',   emoji: '🎁' },
  creative_play:          { label: 'Creative Play',  gradient: 'from-lime-600/90 to-yellow-900/90',    emoji: '💡' },
  product_design:         { label: 'Product Design', gradient: 'from-slate-600/90 to-gray-900/90',     emoji: '📱' },
}

export const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  label: 'Other',
  gradient: 'from-zinc-600/90 to-zinc-800/90',
  emoji: '💡',
}

// Ordered list of category slugs (by descending prompt count in the dataset).
export const CATEGORY_ORDER: string[] = [
  'other',
  'graphic_design',
  'photography',
  'anime_game',
  'character',
  'ecommerce',
  'illustration',
  'tech_scifi',
  'branding_visual',
  'novel_story',
  'landscape_scene',
  'architecture_interior',
  'product_design',
  'food',
  'cultural_products',
  'creative_play',
]

export function getCategoryConfig(slug: string): CategoryConfig {
  return CATEGORY_CONFIG[slug] || DEFAULT_CATEGORY_CONFIG
}
