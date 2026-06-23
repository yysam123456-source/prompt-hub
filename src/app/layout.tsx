import type { Metadata } from 'next'
import './globals.css'
import { AdLoader } from '@/components/common/AdLoader'

export const metadata: Metadata = {
  title: {
    default: 'Prompt Hub - GPT Image 2 AI Prompts',
    template: '%s | Prompt Hub',
  },
  description: 'Discover and copy high-quality GPT Image 2 prompts for AI image generation. 16,000+ curated prompts for Midjourney, DALL-E, Stable Diffusion.',
  keywords: ['GPT Image 2 prompts', 'AI image prompts', 'Midjourney prompts', 'DALL-E prompts', 'AI art prompts', 'prompt engineering'],
  authors: [{ name: 'Prompt Hub' }],
  creator: 'Prompt Hub',
  publisher: 'Prompt Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://imgprompt.craftisle.com'),
  openGraph: {
    title: 'Prompt Hub - GPT Image 2 AI Prompts',
    description: 'Discover and copy high-quality GPT Image 2 prompts for AI image generation. 16,000+ curated prompts.',
    url: 'https://imgprompt.craftisle.com',
    siteName: 'Prompt Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prompt Hub - AI Image Prompts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Hub - GPT Image 2 AI Prompts',
    description: 'Discover and copy high-quality GPT Image 2 prompts for AI image generation. 16,000+ curated prompts.',
    images: ['https://imgprompt.craftisle.com/og-image.png'],
    creator: '@prompthub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // 替换为实际的 Google Search Console 验证代码
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://imgprompt.craftisle.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased text-zinc-100" style={{ backgroundColor: '#090916' }}>
        {children}
        <AdLoader />
      </body>
    </html>
  )
}
