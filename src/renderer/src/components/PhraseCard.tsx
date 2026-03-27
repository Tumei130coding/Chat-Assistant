import { useState } from 'react'
import type { Phrase } from '../../../shared/types'

interface Props {
  phrase: Phrase
  categoryName: string
  onEdit: (phrase: Phrase) => void
  onDelete: (id: string) => void
}

export default function PhraseCard({ phrase, categoryName, onEdit, onDelete }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await window.api.copyToClipboard(phrase.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      onClick={handleCopy}
      className="group mx-3 mb-2 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all relative"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-800 truncate">{phrase.title}</span>
            <span className="shrink-0 px-1.5 py-0.5 text-[10px] text-gray-400 bg-gray-50 rounded">
              {categoryName}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{phrase.content}</p>
        </div>
        <div
          className="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(phrase)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            title="编辑"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(phrase.id)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
            title="删除"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      {copied && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
          <span className="text-sm text-green-500 font-medium">已复制</span>
        </div>
      )}
    </div>
  )
}
