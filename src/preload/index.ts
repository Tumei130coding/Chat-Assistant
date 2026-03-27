import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // Categories
  getCategories: () => ipcRenderer.invoke('get-categories'),
  addCategory: (name: string) => ipcRenderer.invoke('add-category', name),
  updateCategory: (id: string, name: string) => ipcRenderer.invoke('update-category', id, name),
  deleteCategory: (id: string) => ipcRenderer.invoke('delete-category', id),

  // Phrases
  getPhrases: () => ipcRenderer.invoke('get-phrases'),
  addPhrase: (title: string, content: string, categoryId: string, attachments?: unknown[]) =>
    ipcRenderer.invoke('add-phrase', title, content, categoryId, attachments),
  updatePhrase: (id: string, data: { title?: string; content?: string; categoryId?: string; attachments?: unknown[] }) =>
    ipcRenderer.invoke('update-phrase', id, data),
  deletePhrase: (id: string) => ipcRenderer.invoke('delete-phrase', id),

  // Attachments
  selectAttachmentFiles: () => ipcRenderer.invoke('select-attachment-files'),
  saveAttachment: (sourcePath: string) => ipcRenderer.invoke('save-attachment', sourcePath),
  openAttachment: (storedFileName: string) => ipcRenderer.invoke('open-attachment', storedFileName),
  deleteAttachmentFile: (storedFileName: string) => ipcRenderer.invoke('delete-attachment-file', storedFileName),
  getAttachmentsBasePath: () => ipcRenderer.invoke('get-attachments-base-path'),

  // Clipboard
  copyToClipboard: (text: string) => ipcRenderer.invoke('copy-to-clipboard', text),

  // Window
  minimize: () => ipcRenderer.invoke('window-minimize'),
  close: () => ipcRenderer.invoke('window-close'),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('window-toggle-top'),
  getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top')
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
