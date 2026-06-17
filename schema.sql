-- Cloudflare D1 数据库Schema
-- 基于Image-Prompts结构简化

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Prompts表（核心）
CREATE TABLE IF NOT EXISTS prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  
  -- 标题（中英文）
  title_zh TEXT,
  title_en TEXT,
  
  -- Prompt文本（中英文）
  prompt_zh TEXT NOT NULL,
  prompt_en TEXT NOT NULL,
  
  -- 负面提示词
  negative_prompt_zh TEXT,
  negative_prompt_en TEXT,
  
  -- 分类（外键）
  category_id INTEGER REFERENCES categories(id),
  
  -- 图片URL
  image_url TEXT,
  image_width INTEGER,
  image_height INTEGER,
  
  -- 来源
  source_site TEXT,
  source_url TEXT,
  
  -- 统计
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Prompt-Tag关联表
CREATE TABLE IF NOT EXISTS prompt_tags (
  prompt_id INTEGER REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, tag_id)
);

-- 全文搜索索引（FTS5）
CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
  title_zh, title_en, prompt_zh, prompt_en,
  content='prompts',
  content_rowid='id'
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_like_count ON prompts(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_view_count ON prompts(view_count DESC);

-- 初始化分类数据
INSERT OR IGNORE INTO categories (slug, name_zh, name_en) VALUES
('photography', '摄影写真', 'Photography'),
('illustration', '风格插画', 'Illustration'),
('anime_game', '动漫游戏', 'Anime & Game'),
('graphic_design', '平面设计', 'Graphic Design'),
('architecture_interior', '建筑室内', 'Architecture & Interior'),
('branding_visual', '品牌视觉', 'Branding & Visual'),
('creative_play', '创意玩法', 'Creative Play'),
('other', '其他', 'Other');

-- 初始化常用标签
INSERT OR IGNORE INTO tags (slug, name_zh, name_en) VALUES
('character', '角色人物', 'Character'),
('game', '游戏', 'Game'),
('fantasy', '游戏幻想', 'Fantasy'),
('portrait', '人像', 'Portrait'),
('product', '产品', 'Product'),
('poster', '海报', 'Poster'),
('ui', 'UI界面', 'UI'),
('pixel', '像素风', 'Pixel Art'),
('chibi', 'Q版', 'Chibi'),
('cartoon', '卡通', 'Cartoon');
