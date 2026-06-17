import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Prompt Hub - AI 绘画提示词库',
    template: '%s - Prompt Hub',
  },
  description: '探索数万条 AI 绘画提示词，支持 Midjourney、Stable Diffusion 等模型',
  keywords: ['AI', 'prompt', 'Midjourney', 'Stable Diffusion', '提示词', 'AI绘画'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialised">{children}</body>
    </html>
  )
}
