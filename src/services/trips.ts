import type { GeneratedItinerary, SavedTrip } from '../types'
import { readJson, STORAGE_KEYS, writeJson } from './storage'

function isSavedTrip(value: unknown): value is SavedTrip {
  if (!value || typeof value !== 'object') return false
  const trip = value as SavedTrip
  return (
    typeof trip.id === 'string' &&
    typeof trip.title === 'string' &&
    typeof trip.createdAt === 'string' &&
    Boolean(trip.itinerary?.form) &&
    Array.isArray(trip.itinerary?.days)
  )
}

export function loadSavedTrips(): SavedTrip[] {
  const parsed = readJson<unknown>(STORAGE_KEYS.trips, [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter(isSavedTrip)
}

export function persistSavedTrips(trips: SavedTrip[]): boolean {
  return writeJson(STORAGE_KEYS.trips, trips)
}

export function saveItinerary(itinerary: GeneratedItinerary, title?: string): SavedTrip | null {
  const trips = loadSavedTrips()
  const now = new Date().toISOString()
  const trip: SavedTrip = {
    id: crypto.randomUUID(),
    title: title?.trim() || `${itinerary.form.destinationName} · ${itinerary.form.departureDate}`,
    createdAt: now,
    updatedAt: now,
    itinerary,
  }
  const ok = persistSavedTrips([trip, ...trips])
  return ok ? trip : null
}

export function updateSavedTrip(id: string, patch: Partial<Pick<SavedTrip, 'title' | 'itinerary'>>): SavedTrip | null {
  const trips = loadSavedTrips()
  const index = trips.findIndex((item) => item.id === id)
  if (index < 0) return null
  const current = trips[index]
  const next: SavedTrip = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  trips[index] = next
  persistSavedTrips(trips)
  return next
}

export function deleteSavedTrip(id: string): boolean {
  const trips = loadSavedTrips().filter((item) => item.id !== id)
  return persistSavedTrips(trips)
}

export function duplicateSavedTrip(id: string): SavedTrip | null {
  const original = loadSavedTrips().find((item) => item.id === id)
  if (!original) return null
  return saveItinerary(original.itinerary, `${original.title} (copy)`)
}

export function getSavedTrip(id: string): SavedTrip | undefined {
  return loadSavedTrips().find((item) => item.id === id)
}
