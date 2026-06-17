import type { Metadata } from 'next'
import { Suspense } from 'react'
import PromptList from '@/components/PromptList'
import HeroSection from '@/components/HeroSection'
import CategoryNav from '@/components/CategoryNav'

export const metadata: Metadata = {
  title: 'Prompt Hub - AI生图提示词库',
  description: '3.2万条AI生图提示词，免费开源，直接抄作业就能出图',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection />
      <Suspense fallback={<div className="text-center py-8">加载分类...</div>}>
        <CategoryNav />
      </Suspense>
      <Suspense fallback={<PromptListSkeleton />}>
        <PromptList />
      </Suspense>
    </main>
  )
}

function PromptListSkeleton() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="bg-gray-200 h-48"></div>
            <div className="p-4">
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-full mb-1"></div>
              <div className="bg-gray-200 h-3 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
