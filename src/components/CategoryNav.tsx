'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = [
  { slug: '', name: '全部' },
  { slug: '动漫游戏', name: '动漫游戏' },
  { slug: '风格插画', name: '风格插画' },
  { slug: '摄影写真', name: '摄影写真' },
  { slug: '平面设计', name: '平面设计' },
  { slug: '建筑室内', name: '建筑室内' },
  { slug: '品牌视觉', name: '品牌视觉' },
  { slug: '创意玩法', name: '创意玩法' },
]

export default function CategoryNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''
  
  // 只在首页显示
  if (pathname !== '/') {
    return null
  }
  
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full transition-colors ${
              currentCategory === cat.slug
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-blue-600 hover:text-white'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
