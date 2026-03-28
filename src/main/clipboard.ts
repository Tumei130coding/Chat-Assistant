import { clipboard, nativeImage } from 'electron'
import * as fs from 'node:fs'

/**
 * Copy text to clipboard. Always text-only — no image mixing.
 */
export function copyPhraseToClipboard({ text }: { text: string }): void {
  clipboard.writeText(text)
}

/**
 * Copy a single image to clipboard.
 * Returns true on success, false if file missing or image invalid.
 */
export function copyImageToClipboard(imagePath: string): boolean {
  if (!fs.existsSync(imagePath)) return false

  const image = nativeImage.createFromPath(imagePath)
  if (image.isEmpty()) return false

  clipboard.write({ image })
  return true
}
