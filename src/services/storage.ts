const PREFIX = 'ai-travel-planner:'

export const STORAGE_KEYS = {
  trips: `${PREFIX}trips`,
  favorites: `${PREFIX}favorites`,
  packing: `${PREFIX}packing`,
  currentItinerary: `${PREFIX}current-itinerary`,
  draftForm: `${PREFIX}draft-form`,
} as const

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (parsed === null || parsed === undefined) return fallback
    return parsed as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore quota or privacy mode issues */
  }
}
