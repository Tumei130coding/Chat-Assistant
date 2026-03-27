import type { Category } from '../../../shared/types'

interface Props {
  categories: Category[]
  activeId: string | null // null means "全部"
  onSelect: (id: string | null) => void
  onManage: () => void
}

export default function CategoryTabs({ categories, activeId, onSelect, onManage }: Props) {
  const sorted = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-white border-b border-gray-100 overflow-x-auto">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          activeId === null
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        全部
      </button>
      {sorted.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            activeId === cat.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
      <button
        onClick={onManage}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        title="管理分类"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  )
}
