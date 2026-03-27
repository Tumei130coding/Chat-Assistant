import { useState } from 'react'
import type { Category } from '../../../shared/types'

interface Props {
  categories: Category[]
  onAdd: (name: string) => void
  onUpdate: (id: string, name: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export default function CategoryManager({ categories, onAdd, onUpdate, onDelete, onClose }: Props) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleAdd = () => {
    if (!newName.trim()) return
    onAdd(newName.trim())
    setNewName('')
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdate(editingId, editingName.trim())
    }
    setEditingId(null)
    setEditingName('')
  }

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
      setTimeout(() => setConfirmDeleteId(null), 3000)
    }
  }

  const sorted = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[280px] bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">管理分类</h3>

        <div className="space-y-1.5 max-h-[200px] overflow-y-auto mb-3">
          {sorted.map((cat) => (
            <div key={cat.id} className="flex items-center gap-1.5">
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    className="flex-1 px-2 py-1 text-sm bg-gray-50 border border-blue-300 rounded outline-none"
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="shrink-0 px-2 py-1 text-xs text-blue-500 hover:bg-blue-50 rounded"
                  >
                    保存
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700 truncate">{cat.name}</span>
                  <button
                    onClick={() => startEdit(cat)}
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400"
                    title="编辑"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className={`shrink-0 px-1.5 h-6 flex items-center justify-center rounded text-xs ${
                      confirmDeleteId === cat.id
                        ? 'bg-red-500 text-white'
                        : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                    }`}
                    title="删除"
                  >
                    {confirmDeleteId === cat.id ? (
                      '确认'
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    )}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="新分类名称..."
            className="flex-1 px-2.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="shrink-0 px-3 py-1.5 text-xs text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            添加
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
