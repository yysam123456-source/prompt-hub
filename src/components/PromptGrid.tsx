import Link from 'next/link'

export default function PromptGrid({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-4">📂</div>
        <p>暂无数据</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item: any) => (
        <Link
          key={item.slug}
          href={`/prompt/${item.slug}`}
          className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100"
        >
          <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">
            🖼️
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm text-gray-800 line-clamp-2">
              {item.title_zh || item.title_en}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span>👁️ {item.view_count || 0}</span>
              <span>❤️ {item.like_count || 0}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
