import { useState, useEffect, useCallback } from 'react'
import type { Category } from '../../../shared/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await window.api.getCategories()
    setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const add = async (name: string) => {
    await window.api.addCategory(name)
    await refresh()
  }

  const update = async (id: string, name: string) => {
    await window.api.updateCategory(id, name)
    await refresh()
  }

  const remove = async (id: string) => {
    await window.api.deleteCategory(id)
    await refresh()
  }

  return { categories, loading, add, update, remove, refresh }
}
