import { useState, useEffect, useCallback } from 'react'
import type { Phrase } from '../../../shared/types'

export function usePhrases() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await window.api.getPhrases()
    setPhrases(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const add = async (title: string, content: string, categoryId: string) => {
    await window.api.addPhrase(title, content, categoryId)
    await refresh()
  }

  const update = async (
    id: string,
    data: { title?: string; content?: string; categoryId?: string }
  ) => {
    await window.api.updatePhrase(id, data)
    await refresh()
  }

  const remove = async (id: string) => {
    await window.api.deletePhrase(id)
    await refresh()
  }

  return { phrases, loading, add, update, remove, refresh }
}
