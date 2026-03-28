import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockWriteText, mockWrite, mockCreateFromPath, mockExistsSync } = vi.hoisted(() => ({
  mockWriteText: vi.fn(),
  mockWrite: vi.fn(),
  mockCreateFromPath: vi.fn(),
  mockExistsSync: vi.fn()
}))

vi.mock('electron', () => ({
  clipboard: {
    writeText: mockWriteText,
    write: mockWrite
  },
  nativeImage: {
    createFromPath: mockCreateFromPath
  }
}))

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>()
  return { ...actual, existsSync: mockExistsSync }
})

import { copyPhraseToClipboard, copyImageToClipboard } from '../clipboard'

const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'base64'
)

describe('copyPhraseToClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should copy text via writeText (always only text)', () => {
    copyPhraseToClipboard({ text: '你好' })

    expect(mockWriteText).toHaveBeenCalledWith('你好')
    expect(mockWrite).not.toHaveBeenCalled()
  })

  it('should copy empty string without error', () => {
    copyPhraseToClipboard({ text: '' })

    expect(mockWriteText).toHaveBeenCalledWith('')
  })
})

describe('copyImageToClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should copy image to clipboard when file exists and is valid', () => {
    mockExistsSync.mockReturnValue(true)
    const fakeImage = { isEmpty: () => false, toPNG: () => TINY_PNG }
    mockCreateFromPath.mockReturnValue(fakeImage)

    const result = copyImageToClipboard('/path/to/photo.png')

    expect(result).toBe(true)
    expect(mockCreateFromPath).toHaveBeenCalledWith('/path/to/photo.png')
    expect(mockWrite).toHaveBeenCalledWith({ image: fakeImage })
  })

  it('should return false when file does not exist', () => {
    mockExistsSync.mockReturnValue(false)

    const result = copyImageToClipboard('/path/to/missing.png')

    expect(result).toBe(false)
    expect(mockWrite).not.toHaveBeenCalled()
  })

  it('should return false when nativeImage fails to load', () => {
    mockExistsSync.mockReturnValue(true)
    const emptyImage = { isEmpty: () => true }
    mockCreateFromPath.mockReturnValue(emptyImage)

    const result = copyImageToClipboard('/path/to/corrupt.png')

    expect(result).toBe(false)
    expect(mockWrite).not.toHaveBeenCalled()
  })
})
