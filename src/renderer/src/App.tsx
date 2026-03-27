import { useState, useMemo } from 'react'
import TitleBar from './components/TitleBar'
import SearchBar from './components/SearchBar'
import CategoryTabs from './components/CategoryTabs'
import PhraseList from './components/PhraseList'
import PhraseForm from './components/PhraseForm'
import CategoryManager from './components/CategoryManager'
import { usePhrases } from './hooks/usePhrases'
import { useCategories } from './hooks/useCategories'
import type { Phrase } from '../../shared/types'

export default function App() {
  const { phrases, add: addPhrase, update: updatePhrase, remove: removePhrase } = usePhrases()
  const {
    categories,
    add: addCategory,
    update: updateCategory,
    remove: removeCategory,
    refresh: refreshCategories
  } = useCategories()

  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPhraseForm, setShowPhraseForm] = useState(false)
  const [editingPhrase, setEditingPhrase] = useState<Phrase | null>(null)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filteredPhrases = useMemo(() => {
    let result = phrases

    // Filter by category
    if (activeCategory) {
      result = result.filter((p) => p.categoryId === activeCategory)
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
      )
    }

    return result.sort((a, b) => a.order - b.order)
  }, [phrases, activeCategory, searchQuery])

  const handleSavePhrase = async (title: string, content: string, categoryId: string) => {
    if (editingPhrase) {
      await updatePhrase(editingPhrase.id, { title, content, categoryId })
    } else {
      await addPhrase(title, content, categoryId)
    }
    setShowPhraseForm(false)
    setEditingPhrase(null)
  }

  const handleEditPhrase = (phrase: Phrase) => {
    setEditingPhrase(phrase)
    setShowPhraseForm(true)
  }

  const handleDeletePhrase = (id: string) => {
    if (confirmDeleteId === id) {
      removePhrase(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
      setTimeout(() => setConfirmDeleteId(null), 3000)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    await removeCategory(id)
    if (activeCategory === id) {
      setActiveCategory(null)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#f7f8fa]">
      <TitleBar />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryTabs
        categories={categories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
        onManage={() => setShowCategoryManager(true)}
      />
      <PhraseList
        phrases={filteredPhrases}
        categories={categories}
        onEdit={handleEditPhrase}
        onDelete={handleDeletePhrase}
      />

      {/* Bottom add button */}
      <div className="px-3 py-2 bg-white border-t border-gray-100">
        <button
          onClick={() => {
            setEditingPhrase(null)
            setShowPhraseForm(true)
          }}
          className="w-full py-2 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
        >
          + 新增话术
        </button>
      </div>

      {/* Modals */}
      {showPhraseForm && (
        <PhraseForm
          phrase={editingPhrase}
          categories={categories}
          onSave={handleSavePhrase}
          onCancel={() => {
            setShowPhraseForm(false)
            setEditingPhrase(null)
          }}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAdd={async (name) => {
            await addCategory(name)
            await refreshCategories()
          }}
          onUpdate={async (id, name) => {
            await updateCategory(id, name)
            await refreshCategories()
          }}
          onDelete={handleDeleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  )
}
