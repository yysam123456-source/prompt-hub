'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { getFilteredSuggestions, getSearchHistory, addSearchHistory, removeSearchHistory, clearSearchHistory, HOT_SEARCHES } from '@/lib/search'

export default function HomePageClientWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// ======== 搜索框（客户端交互 + 自动补全） ========
export function SearchBox() {
  const [query, setQuery] = useState('')
  const [allPrompts, setAllPrompts] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<{ text: string; type: 'title' | 'tag' | 'category' }[]>([])
  const [showSugg, setShowSugg] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggBoxRef = useRef<HTMLDivElement>(null)

  // Load prompts data for suggestions
  useEffect(() => {
    fetch('/data/prompts.json')
      .then(res => res.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.prompts || [])
        setAllPrompts(items)
      })
      .catch(() => {})
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      addSearchHistory(query.trim())
      window.location.href = '/search?q=' + encodeURIComponent(query.trim())
    }
  }

  const handleSuggestionClick = (text: string) => {
    setQuery(text)
    setShowSugg(false)
    setShowHistory(false)
    addSearchHistory(text)
    window.location.href = '/search?q=' + encodeURIComponent(text)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (val.length >= 1 && allPrompts.length > 0) {
      const sugg = getFilteredSuggestions(allPrompts, val, 6)
      setSuggestions(sugg)
      setShowSugg(true)
    } else {
      setShowSugg(false)
    }
  }

  const handleInputFocus = () => {
    if (query.length >= 1) {
      const sugg = getFilteredSuggestions(allPrompts, query, 6)
      setSuggestions(sugg)
      setShowSugg(true)
    } else {
      setShowHistory(true)
    }
  }

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggBoxRef.current &&
        !suggBoxRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSugg(false)
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const history = getSearchHistory()

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      onSubmit={handleSearch}
      className="w-full max-w-lg relative"
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            type="text"
            placeholder="Search prompts... e.g. poster, cyberpunk, portrait"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 py-3.5 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-500 backdrop-blur-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            autoComplete="off"
          />

          {/* Suggestions / History dropdown */}
          {(showSugg || showHistory) && (
            <div
              ref={suggBoxRef}
              className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl z-50 max-h-72 overflow-y-auto"
            >
              {/* Suggestions */}
              {showSugg && suggestions.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-xs font-medium text-zinc-500 uppercase">Suggestions</div>
                  {suggestions.map((s, i) => (
                    <button
                      key={'sugg-' + i}
                      type="button"
                      onClick={() => handleSuggestionClick(s.text)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      {s.type === 'title' && <span className="text-purple-400 text-xs font-bold">T</span>}
                      {s.type === 'tag' && <span className="text-blue-400 text-xs font-bold">#</span>}
                      {s.type === 'category' && <span className="text-green-400 text-xs font-bold">C</span>}
                      <span className="truncate">{s.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Search history */}
              {showHistory && history.length > 0 && (
                <div className="p-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between px-3 py-1">
                    <span className="text-xs font-medium text-zinc-500 uppercase">Recent</span>
                    <button
                      type="button"
                      onClick={() => { clearSearchHistory(); setShowHistory(false); }}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {history.map((h, i) => (
                    <div key={'hist-' + i} className="flex items-center group">
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(h)}
                        className="flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
                      >
                        <svg className="h-4 w-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">{h}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { removeSearchHistory(h); }}
                        className="px-2 py-1 text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Hot searches */}
              {showHistory && history.length === 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-xs font-medium text-zinc-500 uppercase">Trending</div>
                  {HOT_SEARCHES.slice(0, 6).map((term, i) => (
                    <button
                      key={'hot-' + i}
                      type="button"
                      onClick={() => handleSuggestionClick(term)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      <span className={'text-xs font-bold w-4 ' + (i < 3 ? 'text-orange-400' : 'text-zinc-500')}>{i + 1}</span>
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <button type="submit" className="shrink-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
          Search
        </button>
      </div>
    </motion.form>
  )
}

// ======== 进入视口动画包装器 ========
export function AnimateOnView({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ======== 卡片动画包装器 ========
export function AnimateCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
