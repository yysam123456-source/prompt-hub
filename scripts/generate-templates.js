/**
 * P1: Generate templates.json from upstream style-library.json.
 * Strips attribution, maps categories, English-only output.
 */
const fs = require('fs')
const crypto = require('crypto')

const src = process.argv[2] || 'public/data/style-library.json'
const dst = process.argv[3] || 'public/data/templates.json'

// Deterministic, UUID-shaped id derived from the stable templateId.
//
// This was crypto.randomUUID(), which meant every build — including every Cloudflare
// Pages build, since this script runs in `prebuild` — rewrote public/data/templates.json
// with 22 brand-new ids. Two consequences, both bad: a permanently dirty working tree,
// and two builds from identical source producing different bytes, so build output could
// never be diffed or reproduced.
//
// `id` carries no navigation: routes, sitemap and internal links all key off `templateId`
// (see slugOf() in src/app/template/[id]/page.tsx). Its only consumers are React list
// keys. So a hash of templateId is strictly better than a random value.
function stableId(seed) {
  const h = crypto.createHash('sha256').update(String(seed)).digest('hex')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`
}

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

// guidance/pitfalls in style-library are {en: [...], zh: [...]} objects, not arrays
function extractList(val) {
  if (!val) return []
  if (Array.isArray(val)) return val.map(toEN).filter(Boolean)
  if (typeof val === 'object' && Array.isArray(val.en)) return val.en.filter(Boolean)
  return []
}

function mapImage(url) {
  if (!url) return ''
  if (url.startsWith('/images/')) return GITHUB_RAW_IMAGES + url
  if (url.startsWith('/data/images/')) return GITHUB_RAW_IMAGES + '/data' + url.replace('/data', '')
  return url
}

const templates = raw.templates.map((t, i) => ({
  id: stableId(t.id || `index-${i}`),
  templateId: t.id || '',       // original id from style-library (unique, e.g. "infographic-engine")
  anchor: t.anchor || '',       // category-level grouping key (e.g. "tpl-infographic")
  title: toEN(t.title) || 'Untitled Template',
  description: toEN(t.description) || '',
  category: CATEGORY_MAP[t.category] || 'other',
  cover: mapImage(t.cover),
  styles: (t.styles || []).filter(Boolean),
  scenes: (t.scenes || []).filter(Boolean),
  tags: (t.tags || []).filter(Boolean),
  useWhen: toEN(t.useWhen),
  guidance: extractList(t.guidance),
  pitfalls: extractList(t.pitfalls),
  exampleCases: (t.exampleCases || []),
}))

fs.writeFileSync(dst, JSON.stringify(templates, null, 1))
console.log(`Generated ${dst}: ${templates.length} templates, ${(fs.statSync(dst).size / 1024).toFixed(1)} KB`)

// Sample
console.log('\nSample:', JSON.stringify(templates[0], null, 1).substring(0, 300))
