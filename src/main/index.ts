import { app, shell, BrowserWindow, ipcMain, clipboard, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getPhrases,
  addPhrase,
  updatePhrase,
  deletePhrase,
  getSettings,
  updateSettings
} from './store'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  const settings = getSettings()
  const { windowBounds } = settings

  mainWindow = new BrowserWindow({
    width: windowBounds.width,
    height: windowBounds.height,
    x: windowBounds.x,
    y: windowBounds.y,
    minWidth: 280,
    minHeight: 400,
    maxWidth: 500,
    frame: false,
    transparent: false,
    alwaysOnTop: settings.alwaysOnTop,
    skipTaskbar: false,
    resizable: true,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: -100, y: -100 }, // hide native buttons on mac
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  // Save window bounds on move/resize
  const saveBounds = (): void => {
    if (!mainWindow) return
    const bounds = mainWindow.getBounds()
    updateSettings({ windowBounds: bounds })
  }
  mainWindow.on('moved', saveBounds)
  mainWindow.on('resized', saveBounds)

  // Edge snapping
  mainWindow.on('moved', () => {
    if (!mainWindow) return
    const bounds = mainWindow.getBounds()
    const display = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y })
    const workArea = display.workArea
    const snapThreshold = 20
    let snapped = false
    let newX = bounds.x
    let newY = bounds.y

    // Left edge
    if (Math.abs(bounds.x - workArea.x) < snapThreshold) {
      newX = workArea.x
      snapped = true
    }
    // Right edge
    if (Math.abs(bounds.x + bounds.width - (workArea.x + workArea.width)) < snapThreshold) {
      newX = workArea.x + workArea.width - bounds.width
      snapped = true
    }
    // Top edge
    if (Math.abs(bounds.y - workArea.y) < snapThreshold) {
      newY = workArea.y
      snapped = true
    }
    // Bottom edge
    if (Math.abs(bounds.y + bounds.height - (workArea.y + workArea.height)) < snapThreshold) {
      newY = workArea.y + workArea.height - bounds.height
      snapped = true
    }

    if (snapped) {
      mainWindow.setPosition(newX, newY, false)
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC Handlers
function registerIpcHandlers(): void {
  // Categories
  ipcMain.handle('get-categories', () => getCategories())
  ipcMain.handle('add-category', (_, name: string) => addCategory(name))
  ipcMain.handle('update-category', (_, id: string, name: string) => updateCategory(id, name))
  ipcMain.handle('delete-category', (_, id: string) => deleteCategory(id))

  // Phrases
  ipcMain.handle('get-phrases', () => getPhrases())
  ipcMain.handle('add-phrase', (_, title: string, content: string, categoryId: string) =>
    addPhrase(title, content, categoryId)
  )
  ipcMain.handle('update-phrase', (_, id: string, data) => updatePhrase(id, data))
  ipcMain.handle('delete-phrase', (_, id: string) => deletePhrase(id))

  // Clipboard
  ipcMain.handle('copy-to-clipboard', (_, text: string) => {
    clipboard.writeText(text)
    return true
  })

  // Window controls
  ipcMain.handle('window-minimize', () => mainWindow?.minimize())
  ipcMain.handle('window-close', () => mainWindow?.close())
  ipcMain.handle('window-toggle-top', () => {
    if (!mainWindow) return false
    const current = mainWindow.isAlwaysOnTop()
    mainWindow.setAlwaysOnTop(!current)
    updateSettings({ alwaysOnTop: !current })
    return !current
  })
  ipcMain.handle('get-always-on-top', () => {
    return mainWindow?.isAlwaysOnTop() ?? true
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.wechat-reply.assistant')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
