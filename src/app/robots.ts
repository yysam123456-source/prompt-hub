import type { MetadataRoute } from 'next';

// Required for static export (output: 'export') under Next 16.
export const dynamic = 'force-static';

// AI crawlers are declared explicitly (generative engine optimization):
// the wildcard Allow already covers them, but a named group makes crawls
// auditable in server logs and survives any future tightening of `*`.
// 🔴 OAI-SearchBot = OpenAI 官方 ChatGPT Search 收录/退出 bot，此前 8 站全漏。
//    This site has no disallow rules; if one is ever added to `*`, it MUST be
//    repeated in every group (a bot matching its own group ignores `*`).
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://imgprompt.craftisle.com/sitemap.xml',
  };
}
