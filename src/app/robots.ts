import type { MetadataRoute } from 'next';

// Required for static export (output: 'export') under Next 16.
export const dynamic = 'force-static';

// AI crawlers are declared explicitly (generative engine optimization):
// the wildcard Allow already covers them, but a named group makes crawls
// auditable in server logs and survives any future tightening of `*`.
const AI_AGENTS = ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot', 'Google-Extended'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://imgprompt.craftisle.com/sitemap.xml',
  };
}
