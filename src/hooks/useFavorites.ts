import { useCallback, useState } from 'react'
import { readJson, STORAGE_KEYS, writeJson } from '../services/storage'

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => {
    const stored = readJson<unknown>(STORAGE_KEYS.favorites, [])
    return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === 'string') : []
  })

  const persist = useCallback((next: string[]) => {
    setIds(next)
    writeJson(STORAGE_KEYS.favorites, next)
  }, [])

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids])

  const toggleFavorite = useCallback(
    (id: string) => {
      persist(ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id])
    },
    [ids, persist],
  )

  return { ids, isFavorite, toggleFavorite }
}
