/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ITINERARY_API_URL?: string
  readonly VITE_WEATHER_API_URL?: string
  readonly VITE_MAPS_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
