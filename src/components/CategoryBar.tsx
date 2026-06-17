'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CategoryBar({ currentCategory }: { currentCategory?: string }) {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetch('/data/meta.json')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error('Failed to load categories', err))
  }, [])

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Link
        href="/search"
        className={`px-4 py-2 rounded-full text-sm transition ${
          !currentCategory ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        全部
      </Link>
      {categories.slice(0, 10).map((cat: any) => (
        <Link
          key={cat.slug}
          href={`/search?category=${cat.slug}`}
          className={`px-4 py-2 rounded-full text-sm transition ${
            currentCategory === cat.slug ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {cat.name_zh} ({cat.count})
        </Link>
      ))}
    </div>
  )
}
