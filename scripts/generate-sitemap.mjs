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

const CATEGORY_SLUGS = [
  'other', 'graphic_design', 'photography', 'anime_game', 'character', 'ecommerce',
  'illustration', 'tech_scifi', 'branding_visual', 'novel_story', 'landscape_scene',
  'architecture_interior', 'product_design', 'food', 'cultural_products', 'creative_play',
];

const enc = (v) => encodeURIComponent(v);

const urls = [];

// Static entry points
urls.push({ loc: `${BASE}/`, priority: '1.0', changefreq: 'daily' });
urls.push({ loc: `${BASE}/search`, priority: '0.5', changefreq: 'weekly' });
urls.push({ loc: `${BASE}/category`, priority: '0.8', changefreq: 'weekly' });
urls.push({ loc: `${BASE}/template`, priority: '0.7', changefreq: 'weekly' });

// Category pages
for (const cat of CATEGORY_SLUGS) {
  urls.push({ loc: `${BASE}/category?cat=${enc(cat)}`, priority: '0.8', changefreq: 'weekly' });
}

// Template pages
for (const t of templates) {
  const id = t.templateId || t.id;
  if (!id) continue;
  urls.push({ loc: `${BASE}/template?id=${enc(id)}`, priority: '0.7', changefreq: 'weekly' });
}

// Prompt detail pages (approved only)
let approved = 0;
for (const p of prompts) {
  if (!p.approvedAt || !p.slug) continue;
  urls.push({ loc: `${BASE}/prompt?slug=${enc(p.slug)}`, priority: '0.5', changefreq: 'monthly' });
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
console.log(`Sitemap written: ${urls.length} URLs (${approved} approved prompts + ${templates.length} templates + ${CATEGORY_SLUGS.length} categories + 4 static).`);
