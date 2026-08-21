import type { MetadataRoute } from 'next';

// Required for static export (output: 'export') under Next 16.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://imgprompt.craftisle.com/sitemap.xml',
  };
}
