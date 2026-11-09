import { useCallback, useMemo, useState } from 'react'
import { createDefaultPackingList } from '../data/packingDefaults'
import type { PackingCategory, PackingItem } from '../types'
import { readJson, STORAGE_KEYS, writeJson } from '../services/storage'

function isItem(value: unknown): value is PackingItem {
  if (!value || typeof value !== 'object') return false
  const item = value as PackingItem
  return typeof item.id === 'string' && typeof item.label === 'string' && typeof item.category === 'string'
}

export function usePacking() {
  const [items, setItems] = useState<PackingItem[]>(() => {
    const stored = readJson<unknown>(STORAGE_KEYS.packing, null)
    if (Array.isArray(stored) && stored.some(isItem)) {
      return stored.filter(isItem)
    }
    return createDefaultPackingList()
  })

  const persist = useCallback((next: PackingItem[]) => {
    setItems(next)
    writeJson(STORAGE_KEYS.packing, next)
  }, [])

  const togglePacked = useCallback(
    (id: string) => {
      persist(items.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)))
    },
    [items, persist],
  )

  const addItem = useCallback(
    (label: string, category: PackingCategory) => {
      const trimmed = label.trim()
      if (!trimmed) return
      persist([
        ...items,
        { id: crypto.randomUUID(), label: trimmed, category, packed: false, custom: true },
      ])
    },
    [items, persist],
  )

  const removeItem = useCallback(
    (id: string) => {
      persist(items.filter((item) => item.id !== id))
    },
    [items, persist],
  )

  const resetList = useCallback(() => {
    persist(createDefaultPackingList())
  }, [persist])

  const completion = useMemo(() => {
    if (items.length === 0) return 0
    return Math.round((items.filter((item) => item.packed).length / items.length) * 100)
  }, [items])

  return { items, togglePacked, addItem, removeItem, resetList, completion }
}
