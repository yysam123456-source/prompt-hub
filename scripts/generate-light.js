/**
 * P4 Pre-build: Generate lightweight prompts index (no prompt text)
 * for category/search listing pages. Reduces first-load from 15.7MB → 2.2MB.
 * Run before `next build` or as part of build script.
 */
const fs = require('fs')
const path = require('path')

const src = process.argv[2] || 'public/data/prompts.json'
const dst = process.argv[3] || 'public/data/prompts-light.json'

const data = JSON.parse(fs.readFileSync(src, 'utf8'))

const light = data.map(item => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  titleEn: item.titleEn,
  category: item.category,
  tags: item.tags,
  imageUrl: item.imageUrl,
  contributor: item.contributor,
  viewCount: item.viewCount,
  likeCount: item.likeCount,
}))

fs.writeFileSync(dst, JSON.stringify(light))
console.log(`Generated ${dst}: ${light.length} items, ${(fs.statSync(dst).size/1024/1024).toFixed(1)} MB`)
