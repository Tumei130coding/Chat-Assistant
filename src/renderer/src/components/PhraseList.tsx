import type { Phrase, Category } from '../../../shared/types'
import PhraseCard from './PhraseCard'

interface Props {
  phrases: Phrase[]
  categories: Category[]
  onEdit: (phrase: Phrase) => void
  onDelete: (id: string) => void
}

export default function PhraseList({ phrases, categories, onEdit, onDelete }: Props) {
  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name ?? '未分类'
  }

  if (phrases.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        暂无话术
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {phrases.map((phrase) => (
        <PhraseCard
          key={phrase.id}
          phrase={phrase}
          categoryName={getCategoryName(phrase.categoryId)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
