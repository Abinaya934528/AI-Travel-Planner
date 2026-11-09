import type { GeneratedItinerary } from '../types'
import { itineraryPlainText } from './itineraryGenerator'

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fallback below */
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', 'true')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

export async function shareItinerary(itinerary: GeneratedItinerary): Promise<'shared' | 'copied' | 'failed'> {
  const text = itineraryPlainText(itinerary)
  const title = `Trip to ${itinerary.form.destinationName}`
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text })
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'failed'
      }
    }
  }
  const copied = await copyText(text)
  return copied ? 'copied' : 'failed'
}

export function printItinerary(): void {
  window.print()
}
