import Store from 'electron-store'
import { v4 as uuidv4 } from 'uuid'
import type { Category, Phrase, AppSettings, StoreData } from '../shared/types'

const defaultCategories: Category[] = [
  { id: uuidv4(), name: '客服', order: 0, createdAt: new Date().toISOString() },
  { id: uuidv4(), name: '售后', order: 1, createdAt: new Date().toISOString() },
  { id: uuidv4(), name: '通知', order: 2, createdAt: new Date().toISOString() }
]

const store = new Store<StoreData>({
  name: 'wechat-reply-data',
  defaults: {
    categories: defaultCategories,
    phrases: [
      {
        id: uuidv4(),
        title: '欢迎语',
        content: '您好，欢迎咨询！请问有什么可以帮您的？',
        categoryId: defaultCategories[0].id,
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: '稍等提示',
        content: '请您稍等，我马上为您查询。',
        categoryId: defaultCategories[0].id,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: '售后处理',
        content: '非常抱歉给您带来不便，我们会尽快为您处理，请您提供一下订单号。',
        categoryId: defaultCategories[1].id,
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: '活动通知',
        content: '【温馨提示】我们即将开展新一期活动，届时将有丰富优惠，敬请关注！',
        categoryId: defaultCategories[2].id,
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    settings: {
      alwaysOnTop: true,
      windowBounds: { x: 100, y: 100, width: 340, height: 560 }
    }
  }
})

// Category CRUD
export function getCategories(): Category[] {
  return store.get('categories')
}

export function addCategory(name: string): Category {
  const categories = getCategories()
  const category: Category = {
    id: uuidv4(),
    name,
    order: categories.length,
    createdAt: new Date().toISOString()
  }
  store.set('categories', [...categories, category])
  return category
}

export function updateCategory(id: string, name: string): Category | null {
  const categories = getCategories()
  const idx = categories.findIndex((c) => c.id === id)
  if (idx === -1) return null
  categories[idx] = { ...categories[idx], name }
  store.set('categories', categories)
  return categories[idx]
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories()
  store.set(
    'categories',
    categories.filter((c) => c.id !== id)
  )
  // Also delete phrases in this category
  const phrases = getPhrases()
  store.set(
    'phrases',
    phrases.filter((p) => p.categoryId !== id)
  )
  return true
}

// Phrase CRUD
export function getPhrases(): Phrase[] {
  return store.get('phrases')
}

export function addPhrase(title: string, content: string, categoryId: string): Phrase {
  const phrases = getPhrases()
  const categoryPhrases = phrases.filter((p) => p.categoryId === categoryId)
  const phrase: Phrase = {
    id: uuidv4(),
    title,
    content,
    categoryId,
    order: categoryPhrases.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  store.set('phrases', [...phrases, phrase])
  return phrase
}

export function updatePhrase(
  id: string,
  data: Partial<Pick<Phrase, 'title' | 'content' | 'categoryId'>>
): Phrase | null {
  const phrases = getPhrases()
  const idx = phrases.findIndex((p) => p.id === id)
  if (idx === -1) return null
  phrases[idx] = { ...phrases[idx], ...data, updatedAt: new Date().toISOString() }
  store.set('phrases', phrases)
  return phrases[idx]
}

export function deletePhrase(id: string): boolean {
  const phrases = getPhrases()
  store.set(
    'phrases',
    phrases.filter((p) => p.id !== id)
  )
  return true
}

// Settings
export function getSettings(): AppSettings {
  return store.get('settings')
}

export function updateSettings(data: Partial<AppSettings>): AppSettings {
  const settings = { ...getSettings(), ...data }
  store.set('settings', settings)
  return settings
}
