/**
 * P3: Generate style-scene-index.json for facet filtering.
 * Maps each style/scene value → array of prompt slugs that match.
 * Uses search-index.json (or prompts.json) as input.
 */
const fs = require('fs')

const promptsSrc = process.argv[2] || 'public/data/search-index.json'
const styleLibSrc = process.argv[3] || 'public/data/style-library.json'
const dst = process.argv[4] || 'public/data/style-scene-index.json'

const prompts = JSON.parse(fs.readFileSync(promptsSrc, 'utf8'))
const lib = JSON.parse(fs.readFileSync(styleLibSrc, 'utf8'))

// Extract canonical style/scene names
const styles = lib.styles.map(s => s.value)
const scenes = lib.scenes.map(s => s.value)

// Build inverted index: style/scene name → [slugs]
const styleIndex = {}
const sceneIndex = {}

for (const style of styles) {
  styleIndex[style] = []
}

for (const scene of scenes) {
  sceneIndex[scene] = []
}

for (const p of prompts) {
  const tags = (p.tags || []).map(t => {
    // Normalize: case-insensitive match
    return String(t).trim()
  })

  for (const style of styles) {
    if (tags.some(t => t.toLowerCase() === style.toLowerCase())) {
      styleIndex[style].push(p.slug)
    }
  }

  for (const scene of scenes) {
    if (tags.some(t => t.toLowerCase() === scene.toLowerCase())) {
      sceneIndex[scene].push(p.slug)
    }
  }
}

// Stats
const styleCounts = {}
for (const [k, v] of Object.entries(styleIndex)) styleCounts[k] = v.length
const sceneCounts = {}
for (const [k, v] of Object.entries(sceneIndex)) sceneCounts[k] = v.length

const output = {
  styles: Object.entries(styleCounts).map(([name, count]) => ({ name, count })),
  scenes: Object.entries(sceneCounts).map(([name, count]) => ({ name, count })),
  styleIndex,
  sceneIndex,
}

fs.writeFileSync(dst, JSON.stringify(output))
console.log('Style-scene index:', dst)
console.log('Styles:', Object.entries(styleCounts).map(([k,v]) => `${k}(${v})`).join(', '))
console.log('Scenes:', Object.entries(sceneCounts).map(([k,v]) => `${k}(${v})`).join(', '))
console.log('Size:', (fs.statSync(dst).size / 1024).toFixed(1), 'KB')
