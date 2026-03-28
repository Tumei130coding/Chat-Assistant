export interface Category {
  id: string
  name: string
  order: number
  createdAt: string
}

export interface Attachment {
  id: string
  originalName: string
  storedFileName: string
  mimeType: string
  size: number
  addedAt: string
}

export interface Phrase {
  id: string
  title: string
  content: string
  categoryId: string
  order: number
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}

export interface WindowBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface AppSettings {
  alwaysOnTop: boolean
  attachToWeChat: boolean
  windowBounds: WindowBounds
}

export interface StoreData {
  categories: Category[]
  phrases: Phrase[]
  settings: AppSettings
}
