'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
}

export default function AnimatedText({ text, className = '', once = true }: AnimatedTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setStarted(true)
  }, [])

  const letters = text.split('')

  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: i * 0.03,
            ease: 'easeOut',
          }}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  )
}
