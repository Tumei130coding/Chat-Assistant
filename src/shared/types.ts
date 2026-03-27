export interface Category {
  id: string
  name: string
  order: number
  createdAt: string
}

export interface Phrase {
  id: string
  title: string
  content: string
  categoryId: string
  order: number
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
  windowBounds: WindowBounds
}

export interface StoreData {
  categories: Category[]
  phrases: Phrase[]
  settings: AppSettings
}
