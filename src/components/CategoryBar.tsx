'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// CategoryBar: accepts categories as props (fetched by parent)
export default function CategoryBar({ categories }: { categories?: any[] }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const cats = categories || []

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {cats.map((cat: any, idx: number) => {
        const href = `/category?slug=${cat.slug}`
        return (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (idx % 5) * 0.08 }}
          >
            <Link
              href={href}
              className="group block rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="mb-3 text-3xl">
                {cat.slug === 'stable-diffusion' ? '🎨'
                  : cat.slug === 'midjourney' ? '🌌'
                  : cat.slug === 'dall-e' ? '🖼️'
                  : cat.slug === 'leonardo' ? '✨'
                  : cat.slug === 'firefly' ? '🔥'
                  : '💡'}
              </div>
              <h3 className="font-semibold text-zinc-100 group-hover:text-purple-400 transition-colors">
                {cat.name}
              </h3>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
