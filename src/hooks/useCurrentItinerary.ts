import { useCallback, useState } from 'react'
import type { GeneratedItinerary } from '../types'
import { readJson, removeKey, STORAGE_KEYS, writeJson } from '../services/storage'

function isItinerary(value: unknown): value is GeneratedItinerary {
  if (!value || typeof value !== 'object') return false
  const item = value as GeneratedItinerary
  return Boolean(item.form) && Array.isArray(item.days)
}

export function useCurrentItinerary() {
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(() => {
    const stored = readJson<unknown>(STORAGE_KEYS.currentItinerary, null)
    return isItinerary(stored) ? stored : null
  })

  const saveCurrent = useCallback((value: GeneratedItinerary) => {
    setItinerary(value)
    writeJson(STORAGE_KEYS.currentItinerary, value)
  }, [])

  const clearCurrent = useCallback(() => {
    setItinerary(null)
    removeKey(STORAGE_KEYS.currentItinerary)
  }, [])

  return { itinerary, saveCurrent, clearCurrent }
}
