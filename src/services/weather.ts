import type { Destination } from '../types'

export interface WeatherSnapshot {
  available: boolean
  headline: string
  detail: string
}

export function getWeatherSnapshot(destination?: Destination): WeatherSnapshot {
  const configuredUrl = import.meta.env.VITE_WEATHER_API_URL as string | undefined
  if (!configuredUrl) {
    return {
      available: false,
      headline: 'Live weather is not connected',
      detail: destination
        ? `Seasonal note for ${destination.name}: ${destination.climateNote} Best-season guidance: ${destination.bestSeason}. Connect a secure backend weather API later to show live conditions.`
        : 'This app does not fetch live forecasts in the browser. Seasonal notes appear on destination pages when available.',
    }
  }
  return {
    available: false,
    headline: 'Live weather is not shown in this client',
    detail:
      'A weather endpoint is configured, but forecasts must be requested through a secure backend. The frontend never stores weather API secrets.',
  }
}
