export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Prompt Hub</h1>
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          AI生图提示词库 — 3.2万条精选提示词，免费开源，直接抄作业就能出图
        </p>
        
        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto">
          <form action="/" method="GET">
            <div className="flex gap-2">
              <input
                type="text"
                name="q"
                placeholder="搜索提示词...（例如：游戏角色、像素风、奇幻场景）"
                className="flex-1 p-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
              >
                搜索
              </button>
            </div>
          </form>
        </div>
        
        {/* 统计数字 */}
        <div className="flex justify-center gap-12 mt-12">
          <div>
            <div className="text-3xl font-bold">32,000+</div>
            <div className="text-blue-200">提示词</div>
          </div>
          <div>
            <div className="text-3xl font-bold">10+</div>
            <div className="text-blue-200">分类</div>
          </div>
          <div>
            <div className="text-3xl font-bold">50+</div>
            <div className="text-blue-200">标签</div>
          </div>
        </div>
      </div>
    </section>
  )
}
