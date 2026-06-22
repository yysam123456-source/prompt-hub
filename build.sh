#!/bin/bash
set -e

echo "=== Prompt Hub Build Script ==="

# 1. 下载提示词数据（如果不存在）
if [ ! -f "public/data/prompts.json" ]; then
  echo "📥 Downloading prompts data..."
  # 使用少量数据用于构建（避免超时）
  node -e "
    const fs = require('fs');
    const data = [];
    for (let i = 1; i <= 100; i++) {
      data.push({
        id: i.toString(),
        slug: 'sample-prompt-' + i,
        title: 'Sample Prompt ' + i,
        titleEn: 'Sample Prompt ' + i,
        category: 'portrait',
        categoryZh: '人像',
        tags: ['sample', 'test'],
        prompt: 'A sample prompt for testing',
        imageUrl: 'https://picsum.photos/seed/' + i + '/400/400',
        viewCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 100),
      });
    }
    fs.writeFileSync('public/data/prompts.json', JSON.stringify(data, null, 2));
    console.log('✅ Created sample data (100 items)');
  "
fi

# 2. 构建
echo "🔨 Building..."
npm run build

echo "✅ Build complete!"
