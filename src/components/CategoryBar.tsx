'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CategoryBar({ currentCategory }: { currentCategory?: string }) {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetch('/data/meta.json')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error('Failed to load categories', err))
  }, [])

  const allCategories = [{ slug: '', name_zh: '全部', count: 0 }, ...categories]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-wrap gap-2 justify-center"
    >
      {allCategories.slice(0, 17).map((cat: any, idx: number) => {
        const isActive = !currentCategory && !cat.slug || currentCategory === cat.slug
        return (
          <motion.div
            key={cat.slug || 'all'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.03 }}
          >
            <Link
              href={cat.slug ? `/search?category=${cat.slug}` : '/search'}
              className={`inline-block rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300'
              }`}
            >
              {cat.name_zh} {cat.count ? `(${cat.count})` : ''}
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
