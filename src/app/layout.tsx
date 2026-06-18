import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Prompt Hub - AI 提示词库',
    template: '%s - Prompt Hub',
  },
  description: '探索 32,000+ AI 提示词，支持 Midjourney、Stable Diffusion、DALL-E 等模型',
  keywords: ['AI', 'prompt', 'Midjourney', 'Stable Diffusion', '提示词', 'AI绘画'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}
