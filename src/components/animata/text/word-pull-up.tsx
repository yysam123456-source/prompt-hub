'use client'

import { motion } from 'framer-motion'

interface WordPullUpProps {
  words: string
  className?: string
}

export default function WordPullUp({ words, className = '' }: WordPullUpProps) {
  const wordList = words.split(' ')

  return (
    <span className={className}>
      {wordList.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
