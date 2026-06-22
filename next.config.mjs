/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  // 开发模式下禁用静态导出（避免 generateStaticParams 错误）
  ...(isDev ? {} : { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '',
}

export default nextConfig
