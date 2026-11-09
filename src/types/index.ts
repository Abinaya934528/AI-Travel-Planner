export const TRAVEL_STYLES = [
  'Adventure',
  'Relaxation',
  'Cultural',
  'Family',
  'Romantic',
  'Food and Culinary',
  'Nature',
  'Budget Travel',
] as const

export type TravelStyle = (typeof TRAVEL_STYLES)[number]

export const TRANSPORT_MODES = ['Flight', 'Train', 'Bus', 'Car', 'Mixed'] as const
export type TransportMode = (typeof TRANSPORT_MODES)[number]

export const ACCOMMODATION_PREFS = [
  'Budget',
  'Mid-range',
  'Boutique',
  'Luxury',
  'Homestay',
] as const
export type AccommodationPref = (typeof ACCOMMODATION_PREFS)[number]

export const INTEREST_OPTIONS = [
  'Beaches',
  'Mountains',
  'Temples and Heritage',
  'Wildlife',
  'Nightlife',
  'Shopping',
  'Photography',
  'Wellness and Spa',
  'Local Markets',
  'Hiking',
  'Water Sports',
  'Museums',
] as const
export type Interest = (typeof INTEREST_OPTIONS)[number]

export interface Destination {
  id: string
  name: string
  country: string
  region: string
  tagline: string
  description: string
  image: string
  images: string[]
  travelStyles: TravelStyle[]
  activities: string[]
  durationDays: { min: number; max: number }
  budgetRangeInr: { min: number; max: number }
  bestSeason: string
  climateNote: string
  lat: number
  lng: number
  morningIdeas: string[]
  afternoonIdeas: string[]
  eveningIdeas: string[]
  attractions: string[]
  food: string[]
  tips: string[]
  featured?: boolean
  popular?: boolean
}

export interface TripFormData {
  destinationId: string
  destinationName: string
  startingLocation: string
  departureDate: string
  returnDate: string
  travellers: number
  budgetInr: number
  travelStyle: TravelStyle
  transportation: TransportMode
  accommodation: AccommodationPref
  interests: Interest[]
  specialRequirements: string
}

export interface DayPlan {
  day: number
  date: string
  title: string
  morning: string[]
  afternoon: string[]
  evening: string[]
  attractions: string[]
  food: string[]
  activityCostInr: number
  transportCostInr: number
  tips: string[]
}

export interface BudgetBreakdown {
  transportation: number
  accommodation: number
  food: number
  activities: number
  shopping: number
  miscellaneous: number
}

export interface GeneratedItinerary {
  form: TripFormData
  days: DayPlan[]
  budget: BudgetBreakdown
  summary: string
  disclaimer: string
  generatedAt: string
  source: 'local-demo' | 'remote-api'
}

export interface SavedTrip {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  itinerary: GeneratedItinerary
}

export interface PackingItem {
  id: string
  label: string
  category: PackingCategory
  packed: boolean
  custom: boolean
}

export type PackingCategory =
  | 'Documents'
  | 'Clothing'
  | 'Electronics'
  | 'Toiletries'
  | 'Medicines'
  | 'Travel essentials'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}
