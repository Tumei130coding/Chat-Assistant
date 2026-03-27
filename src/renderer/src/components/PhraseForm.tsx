import { useState, useEffect, useRef } from 'react'
import type { Phrase, Category, Attachment } from '../../../shared/types'

interface Props {
  phrase: Phrase | null
  categories: Category[]
  onSave: (title: string, content: string, categoryId: string, attachments: Attachment[]) => void
  onCancel: () => void
}

export default function PhraseForm({ phrase, categories, onSave, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [basePath, setBasePath] = useState('')
  // Track newly added attachments so we can clean up on cancel
  const newAttachmentIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    window.api.getAttachmentsBasePath().then(setBasePath)
  }, [])

  useEffect(() => {
    if (phrase) {
      setTitle(phrase.title)
      setContent(phrase.content)
      setCategoryId(phrase.categoryId)
      setAttachments(phrase.attachments ?? [])
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id)
    }
  }, [phrase, categories])

  const handleSelectFiles = async () => {
    const filePaths = await window.api.selectAttachmentFiles()
    if (!filePaths || filePaths.length === 0) return

    const newAtts: Attachment[] = []
    for (const fp of filePaths) {
      const att = await window.api.saveAttachment(fp)
      newAtts.push(att)
      newAttachmentIds.current.add(att.id)
    }
    setAttachments((prev) => [...prev, ...newAtts])
  }

  const handleRemoveAttachment = async (att: Attachment) => {
    await window.api.deleteAttachmentFile(att.storedFileName)
    newAttachmentIds.current.delete(att.id)
    setAttachments((prev) => prev.filter((a) => a.id !== att.id))
  }

  const handleCancel = async () => {
    // Clean up newly added files that won't be saved
    for (const att of attachments) {
      if (newAttachmentIds.current.has(att.id)) {
        await window.api.deleteAttachmentFile(att.storedFileName)
      }
    }
    onCancel()
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !categoryId) return
    onSave(title.trim(), content.trim(), categoryId, attachments)
  }

  const isImage = (mimeType: string) => mimeType.startsWith('image/')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[300px] max-h-[90vh] bg-white rounded-xl shadow-lg p-4 overflow-y-auto">
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

          {/* Attachments */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              附件 ({attachments.length})
            </label>

            {attachments.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    {isImage(att.mimeType) && basePath ? (
                      <img
                        src={`file://${basePath}/${att.storedFileName}`}
                        className="w-8 h-8 rounded object-cover shrink-0"
                        alt={att.originalName}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-red-500">PDF</span>
                      </div>
                    )}
                    <span className="flex-1 text-xs text-gray-600 truncate">{att.originalName}</span>
                    <button
                      onClick={() => handleRemoveAttachment(att)}
                      className="shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                      title="移除"
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleSelectFiles}
              className="w-full py-1.5 text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              + 添加图片 / PDF
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleCancel}
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
