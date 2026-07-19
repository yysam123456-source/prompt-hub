/**
 * P4 Pre-build: Generate search index (id, slug, title, titleEn, prompt[0:200], category, tags, imageUrl).
 * Used by /search page for Fuse.js — 76% smaller than full prompts.json.
 */
const fs = require('fs')

const src = process.argv[2] || 'public/data/prompts.json'
const dst = process.argv[3] || 'public/data/search-index.json'

const data = JSON.parse(fs.readFileSync(src, 'utf8'))

const index = data.map(item => ({
  id: item.id,
  slug: item.slug,
  title: item.title || '',
  titleEn: item.titleEn || '',
  prompt: (item.prompt || '').substring(0, 200),
  category: item.category || '',
  tags: item.tags || [],
  imageUrl: item.imageUrl || '',
  viewCount: item.viewCount || 0,
  likeCount: item.likeCount || 0,
}))

fs.writeFileSync(dst, JSON.stringify(index))
console.log(`Generated ${dst}: ${index.length} items, ${(fs.statSync(dst).size / 1024 / 1024).toFixed(1)} MB`)
