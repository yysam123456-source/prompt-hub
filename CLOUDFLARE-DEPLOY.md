# Cloudflare Pages 部署指南

## 项目信息
- **项目名称**: prompt-hub
- **框架**: Next.js 15 (静态导出模式)
- **构建命令**: `npm run build`
- **输出目录**: `out`

## 部署步骤

### 1. 推送代码到 GitHub
```bash
cd /Users/Lenovo/WorkBuddy/2026-06-17-14-51-24/prompt-hub
git init
git add .
git commit -m "Initial commit: Prompt Hub"
git remote add origin https://github.com/<your-username>/prompt-hub.git
git push -u origin main
```

### 2. 在 Cloudflare Dashboard 创建 Pages 项目
1. 登录 https://dash.cloudflare.com
2. 进入 **Pages** → **Create a project**
3. 选择 **Connect to Git**
4. 授权 GitHub，选择仓库 `prompt-hub`

### 3. 配置构建设置
| 配置项 | 值 |
|--------|-----|
| **Project name** | `prompt-hub` |
| **Production branch** | `main` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Node.js version** | `22` (或 `20`) |
| **Package manager** | `npm` |

### 4. 环境变量（可选）
如果需要，在 **Settings** → **Environment variables** 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_VERSION` | `22` | 指定 Node.js 版本 |

### 5. 点击 **Save and Deploy**

Cloudflare Pages 会自动：
1. 安装依赖 (`npm install`)
2. 运行构建命令 (`npm run build`)
3. 部署 `out` 目录到 `*.pages.dev`

### 6. 部署成功后
- **预览 URL**: `https://prompt-hub.<your-account>.pages.dev`
- **自定义域名**: 在 **Custom domains** 中添加 `prompts.sorry.ink`

## 注意事项

### 静态导出限制
- ❌ 不支持 API Routes (`/app/api/...`)
- ❌ 不支持 Server Components 的动态功能
- ✅ 所有数据在构建时预渲染（适合提示词库这类静态内容）

### 图片优化
已配置 `images: { unoptimized: true }`，Cloudflare Pages 会自动处理图片。

### 构建超时
- Cloudflare Pages 构建超时：**30 分钟**
- 如果 5167 个页面构建超过 30 分钟，可以：
  1. 减少数据量（只抓取热门提示词）
  2. 使用增量静态再生成（ISR）- 但需要改为 `output: 'standalone'` 模式

## 快速验证部署

部署成功后，访问：
- 首页: `https://prompt-hub.<your-account>.pages.dev/`
- 分类页: `https://prompt-hub.<your-account>.pages.dev/category`
- 详情页: `https://prompt-hub.<your-account>.pages.dev/prompt/<slug>`
