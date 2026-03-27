import Store from 'electron-store'
import { v4 as uuidv4 } from 'uuid'
import { app } from 'electron'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { Category, Phrase, Attachment, AppSettings, StoreData } from '../shared/types'

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
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: '稍等提示',
        content: '请您稍等，我马上为您查询。',
        categoryId: defaultCategories[0].id,
        order: 1,
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: '售后处理',
        content: '非常抱歉给您带来不便，我们会尽快为您处理，请您提供一下订单号。',
        categoryId: defaultCategories[1].id,
        order: 0,
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: '活动通知',
        content: '【温馨提示】我们即将开展新一期活动，届时将有丰富优惠，敬请关注！',
        categoryId: defaultCategories[2].id,
        order: 0,
        attachments: [],
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

// Attachments directory
function getAttachmentsDir(): string {
  const dir = path.join(app.getPath('userData'), 'attachments')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf'
}

export function saveAttachmentFile(sourcePath: string): Attachment {
  const ext = path.extname(sourcePath).toLowerCase()
  const storedFileName = `${uuidv4()}${ext}`
  const destPath = path.join(getAttachmentsDir(), storedFileName)
  fs.copyFileSync(sourcePath, destPath)
  const stats = fs.statSync(destPath)
  return {
    id: uuidv4(),
    originalName: path.basename(sourcePath),
    storedFileName,
    mimeType: mimeTypes[ext] || 'application/octet-stream',
    size: stats.size,
    addedAt: new Date().toISOString()
  }
}

export function deleteAttachmentFile(storedFileName: string): void {
  const filePath = path.join(getAttachmentsDir(), storedFileName)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

export function getAttachmentPath(storedFileName: string): string {
  return path.join(getAttachmentsDir(), storedFileName)
}

export function getAttachmentsBasePath(): string {
  return getAttachmentsDir()
}

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
  // Also delete phrases and their attachment files
  const phrases = getPhrases()
  const toDelete = phrases.filter((p) => p.categoryId === id)
  for (const p of toDelete) {
    for (const att of p.attachments) {
      deleteAttachmentFile(att.storedFileName)
    }
  }
  store.set(
    'phrases',
    phrases.filter((p) => p.categoryId !== id)
  )
  return true
}

// Phrase CRUD
export function getPhrases(): Phrase[] {
  const phrases = store.get('phrases')
  // Backward compatibility: ensure attachments field exists
  return phrases.map((p) => ({ ...p, attachments: p.attachments ?? [] }))
}

export function addPhrase(
  title: string,
  content: string,
  categoryId: string,
  attachments: Attachment[] = []
): Phrase {
  const phrases = getPhrases()
  const categoryPhrases = phrases.filter((p) => p.categoryId === categoryId)
  const phrase: Phrase = {
    id: uuidv4(),
    title,
    content,
    categoryId,
    order: categoryPhrases.length,
    attachments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  store.set('phrases', [...phrases, phrase])
  return phrase
}

export function updatePhrase(
  id: string,
  data: Partial<Pick<Phrase, 'title' | 'content' | 'categoryId' | 'attachments'>>
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
  const phrase = phrases.find((p) => p.id === id)
  if (phrase) {
    for (const att of phrase.attachments) {
      deleteAttachmentFile(att.storedFileName)
    }
  }
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
