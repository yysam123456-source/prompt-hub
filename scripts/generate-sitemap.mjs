// Generates a static, comprehensive sitemap.xml for imgprompt.craftisle.com
// Coverage: home, search, 16 category pages, 22 template pages, all approved prompt detail pages.
// Run: node scripts/generate-sitemap.mjs  (outputs public/sitemap.xml)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const BASE = 'https://imgprompt.craftisle.com';

const prompts = JSON.parse(readFileSync(join(root, 'public/data/prompts.json'), 'utf8'));
const templates = JSON.parse(readFileSync(join(root, 'public/data/templates.json'), 'utf8'));

// Must stay identical to CATEGORY_ORDER in src/lib/categories.ts — that list is what
// generateStaticParams() enumerates, and the route sets `dynamicParams = false`, so a
// slug listed here but missing there would be a hard 404 in the sitemap.
// This file is .mjs and cannot import the .ts module, so instead of trusting the copy
// we assert against the dataset and fail loudly on drift.
const CATEGORY_SLUGS = [
  'other', 'graphic_design', 'photography', 'anime_game', 'character', 'ecommerce',
  'illustration', 'tech_scifi', 'branding_visual', 'novel_story', 'landscape_scene',
  'architecture_interior', 'product_design', 'food', 'cultural_products', 'creative_play',
];

{
  const inData = new Set(prompts.map((p) => p.category).filter(Boolean));
  const inList = new Set(CATEGORY_SLUGS);
  const missingFromList = [...inData].filter((s) => !inList.has(s));
  const missingFromData = [...inList].filter((s) => !inData.has(s));
  if (missingFromList.length || missingFromData.length) {
    console.error('[sitemap] CATEGORY_SLUGS has drifted from the dataset.');
    if (missingFromList.length) console.error('  in prompts.json but not in list:', missingFromList.join(', '));
    if (missingFromData.length) console.error('  in list but not in prompts.json:', missingFromData.join(', '));
    console.error('  Update CATEGORY_SLUGS here AND CATEGORY_ORDER in src/lib/categories.ts.');
    process.exit(1);
  }
}

const enc = (v) => encodeURIComponent(v);

const urls = [];

// Static entry points. next.config sets `trailingSlash: true`, so every canonical URL
// ends in a slash — listing the slash-less form here would make every crawl of this
// entry cost an extra 308 redirect hop.
//
// /search/ is deliberately absent: src/app/search/layout.tsx marks it `noindex, follow`
// (all ?q= variants are near-duplicates of one static file), and a sitemap must not
// submit URLs that are marked noindex.
urls.push({ loc: `${BASE}/`, priority: '1.0', changefreq: 'daily' });
urls.push({ loc: `${BASE}/category/`, priority: '0.8', changefreq: 'weekly' });
urls.push({ loc: `${BASE}/template/`, priority: '0.7', changefreq: 'weekly' });

// Category pillar (cornerstone) pages — clean static silo URLs
for (const cat of CATEGORY_SLUGS) {
  urls.push({ loc: `${BASE}/category/${cat}/`, priority: '0.8', changefreq: 'weekly' });
}

// Template pages
for (const t of templates) {
  const id = t.templateId || t.id;
  if (!id) continue;
  // 静态路径（不再是 ?id= 查询参数）：查询参数 URL 不被 Google 当作可索引内容页，
  // 这是此前 5000+ 页面零曝光的直接原因之一。
  urls.push({ loc: `${BASE}/template/${enc(id)}/`, priority: '0.7', changefreq: 'weekly' });
}

// Prompt detail pages (approved only)
let approved = 0;
for (const p of prompts) {
  if (!p.approvedAt || !p.slug) continue;
  urls.push({ loc: `${BASE}/prompt/${enc(p.slug)}/`, priority: '0.5', changefreq: 'monthly' });
  approved++;
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => {
    const lastmod = u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : '';
    return `  <url>\n    <loc>${u.loc}</loc>\n${lastmod}    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
  }),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(root, 'public/sitemap.xml'), xml, 'utf8');
console.log(`Sitemap written: ${urls.length} URLs (${approved} approved prompts + ${templates.length} templates + ${CATEGORY_SLUGS.length} categories + 3 static).`);
