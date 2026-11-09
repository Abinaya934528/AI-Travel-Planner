import type { Destination } from '../types'

export function openStreetMapEmbedUrl(destination: Destination): string | null {
  if (!destination.lat && !destination.lng) return null
  const delta = 0.12
  const minLng = destination.lng - delta
  const minLat = destination.lat - delta
  const maxLng = destination.lng + delta
  const maxLat = destination.lat + delta
  const bbox = `${minLng},${minLat},${maxLng},${maxLat}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${destination.lat}%2C${destination.lng}`
}

export function openStreetMapLink(destination: Destination): string {
  return `https://www.openstreetmap.org/?mlat=${destination.lat}&mlon=${destination.lng}#map=12/${destination.lat}/${destination.lng}`
}

export function mapsStatusMessage(): string {
  const custom = import.meta.env.VITE_MAPS_API_URL as string | undefined
  if (custom) {
    return 'A maps endpoint is reserved for a future secure backend. This page currently shows an OpenStreetMap embed, which does not use a secret key in the browser.'
  }
  return 'Live turn-by-turn directions are not enabled. The map below is a static OpenStreetMap view for orientation only.'
}
