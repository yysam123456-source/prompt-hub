/**
 * 数据类型定义 — 匹配 prompts.sorry.ink API + gpt-image-2-final.json 格式
 */

// 分类
export interface Category {
  id: string
  slug: string
  label: string      // 中文
  labelEn: string    // 英文
  count?: number
}

// 提示词列表项（卡片展示用）
export interface PromptCard {
  id: string
  slug: string
  title: string       // 中文标题
  titleEn: string     // 英文标题
  category: string    // 分类 slug
  categoryZh: string  // 分类中文名
  tags: string[]
  imageUrl: string    // 主图 URL
  contributor?: string
  viewCount: number
  likeCount: number
  aspectRatio: string
}

// 提示词详情（完整数据）
export interface PromptDetail {
  id: string
  slug: string
  title: string
  titleEn: string
  category: string
  categoryZh: string
  tags: string[]
  prompt: string           // 英文提示词（可能含 {argument} 占位符）
  promptZh: string         // 中文提示词
  negativePrompt: string
  imageUrl: string         // 主图
  images: string[]         // 所有生成图
  contributor?: string
  viewCount: number
  likeCount: number
  sourceSite: string
  sourceUrl: string
  aspectRatio: string
  approvedAt: string
  arguments: PromptArgument[]  // 解析出的参数占位符
}

// 提示词中的参数占位符
export interface PromptArgument {
  name: string
  defaultValue: string
}

// prompts.json 完整结构
export interface PromptsData {
  meta: {
    total: number
    source: string
    updated_at: string
  }
  categories: Category[]
  prompts: PromptDetail[]
}

// 网站统计
export interface SiteStats {
  totalPrompts: number
  totalCategories: number
  totalContributors: number
}
