import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Prompt Hub - AI Prompt Library',
    template: '%s - Prompt Hub',
  },
  description: 'Explore 32,000+ AI prompts for Midjourney, Stable Diffusion, DALL-E and more',
  keywords: ['AI', 'prompt', 'Midjourney', 'Stable Diffusion', 'AI art', 'prompt library'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}
