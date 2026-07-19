/**
 * P1: Generate templates.json from upstream style-library.json.
 * Strips attribution, maps categories, English-only output.
 */
const fs = require('fs')
const crypto = require('crypto')

const src = process.argv[2] || 'public/data/style-library.json'
const dst = process.argv[3] || 'public/data/templates.json'

const raw = JSON.parse(fs.readFileSync(src, 'utf8'))

// Category mapping (same as P0)
const CATEGORY_MAP = {
  'Posters & Typography':      'graphic_design',
  'Photography & Realism':     'photography',
  'UI & Interfaces':           'tech_scifi',
  'Illustration & Art':        'illustration',
  'Charts & Infographics':     'graphic_design',
  'Products & E-commerce':     'ecommerce',
  'Other Use Cases':           'other',
  'Brand & Logos':             'branding_visual',
  'Characters & People':       'character',
  'Scenes & Storytelling':     'novel_story',
  'History & Classical Themes':'cultural_products',
  'Architecture & Spaces':     'architecture_interior',
  'Documents & Publishing':    'graphic_design',
}

const GITHUB_RAW_IMAGES = 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main'

function toEN(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  if (typeof obj.en === 'string') return obj.en
  return ''
}

function mapImage(url) {
  if (!url) return ''
  if (url.startsWith('/images/')) return GITHUB_RAW_IMAGES + url
  if (url.startsWith('/data/images/')) return GITHUB_RAW_IMAGES + '/data' + url.replace('/data', '')
  return url
}

const templates = raw.templates.map((t, i) => ({
  id: crypto.randomUUID(),
  anchor: t.anchor || '',
  title: toEN(t.title) || 'Untitled Template',
  description: toEN(t.description) || '',
  category: CATEGORY_MAP[t.category] || 'other',
  cover: mapImage(t.cover),
  styles: (t.styles || []).filter(Boolean),
  scenes: (t.scenes || []).filter(Boolean),
  tags: (t.tags || []).filter(Boolean),
  useWhen: toEN(t.useWhen),
  guidance: Array.isArray(t.guidance)
    ? t.guidance.map(toEN).filter(Boolean)
    : [],
  pitfalls: Array.isArray(t.pitfalls)
    ? t.pitfalls.map(toEN).filter(Boolean)
    : [],
  exampleCases: (t.exampleCases || []),
}))

fs.writeFileSync(dst, JSON.stringify(templates, null, 1))
console.log(`Generated ${dst}: ${templates.length} templates, ${(fs.statSync(dst).size / 1024).toFixed(1)} KB`)

// Sample
console.log('\nSample:', JSON.stringify(templates[0], null, 1).substring(0, 300))
