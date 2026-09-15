/**
 * 遗留的 /prompt?slug=xxx 入口 —— 只保留给旧链接，不再对外暴露为可索引页。
 *
 * 此前本文件是 'use client'，读 ?slug= 后渲染 PromptDetailClient：
 *   - 'use client' 文件无法导出 metadata ⇒ 本页没有 title / description / canonical，
 *     静默继承根 layout 的标题（与 /category、/search 是同一类缺陷）；
 *   - ?slug= 形式与规范页 /prompt/<slug>/ 是同一份内容，构成重复；
 *   - 不带 slug 时渲染的是一个「404 Prompt not found」薄页。
 * ⇒ 三种情况都不该被索引，故声明 noindex, follow（保留 follow 让权重继续传导）。
 *
 * ⚠️ 本页不能用「同级 layout.tsx」的方式修（/search 用的是那种方式）：
 * src/app/prompt/layout.tsx 会同时包住 src/app/prompt/[slug]/page.tsx，
 * 而 Next 的 metadata 是就近覆盖、支柱页没有显式声明 robots，
 * 父 layout 的 noindex 会原样泄漏到全部 5,167 个 prompt 支柱页。
 * 因此只能把客户端部分拆成组件（见 @/components/PromptQueryClient），
 * 让本路由回到服务端组件、自己持有 metadata。
 */
import type { Metadata } from 'next'
import { Suspense } from 'react'
import PromptQueryClient from '@/components/PromptQueryClient'

const SITE = 'https://imgprompt.craftisle.com'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Image Prompt',
  description:
    'Legacy prompt permalink. Browse the full curated collection of AI image prompts by category instead.',
  alternates: {
    canonical: `${SITE}/prompt/`,
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function PromptQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PromptQueryClient />
    </Suspense>
  )
}
