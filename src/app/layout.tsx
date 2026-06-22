import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prompt Hub - GPT Image 2 Prompts',
  description: 'Discover and copy high-quality GPT Image 2 prompts for AI image generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialised bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  )
}
