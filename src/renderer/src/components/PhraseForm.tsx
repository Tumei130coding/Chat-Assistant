import { useState, useEffect } from 'react'
import type { Phrase, Category } from '../../../shared/types'

interface Props {
  phrase: Phrase | null // null = add mode
  categories: Category[]
  onSave: (title: string, content: string, categoryId: string) => void
  onCancel: () => void
}

export default function PhraseForm({ phrase, categories, onSave, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    if (phrase) {
      setTitle(phrase.title)
      setContent(phrase.content)
      setCategoryId(phrase.categoryId)
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id)
    }
  }, [phrase, categories])

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !categoryId) return
    onSave(title.trim(), content.trim(), categoryId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[300px] bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {phrase ? '编辑话术' : '新增话术'}
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">分类</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="如：欢迎语"
              className="w-full px-2.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入话术内容..."
              rows={4}
              className="w-full px-2.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-400 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || !categoryId}
            className="px-3 py-1.5 text-xs text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {phrase ? '保存' : '添加'}
          </button>
        </div>
      </div>
    </div>
  )
}
