/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // 支持Cloudflare Pages
  images: {
    unoptimized: true,  // 静态导出时禁用图片优化
  },
}

module.exports = nextConfig
