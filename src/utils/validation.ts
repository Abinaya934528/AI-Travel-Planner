import { ACCOMMODATION_PREFS, INTEREST_OPTIONS, TRANSPORT_MODES, TRAVEL_STYLES } from '../types'
import type { TripFormData } from '../types'
import { nightsBetween, parseIsoDate, todayIsoDate } from './dates'

export type TripFormErrors = Partial<Record<keyof TripFormData, string>>

export function validateTripForm(form: TripFormData): TripFormErrors {
  const errors: TripFormErrors = {}

  if (!form.destinationName.trim()) {
    errors.destinationName = 'Enter a destination.'
  }

  if (!form.startingLocation.trim()) {
    errors.startingLocation = 'Enter your starting location.'
  }

  const today = todayIsoDate()
  const departure = parseIsoDate(form.departureDate)
  const ret = parseIsoDate(form.returnDate)

  if (!form.departureDate || !departure) {
    errors.departureDate = 'Choose a valid departure date.'
  } else if (form.departureDate < today) {
    errors.departureDate = 'Departure date cannot be in the past.'
  }

  if (!form.returnDate || !ret) {
    errors.returnDate = 'Choose a valid return date.'
  } else if (nightsBetween(form.departureDate, form.returnDate) < 0) {
    errors.returnDate = 'Return date must be on or after departure.'
  } else if (nightsBetween(form.departureDate, form.returnDate) > 21) {
    errors.returnDate = 'This planner supports trips up to 22 days.'
  }

  if (!Number.isInteger(form.travellers) || form.travellers < 1) {
    errors.travellers = 'At least one traveller is required.'
  } else if (form.travellers > 12) {
    errors.travellers = 'This form supports up to 12 travellers.'
  }

  if (!Number.isFinite(form.budgetInr) || form.budgetInr <= 0) {
    errors.budgetInr = 'Enter a budget greater than zero in Indian rupees.'
  } else if (form.budgetInr > 10_000_000) {
    errors.budgetInr = 'Please enter a realistic total trip budget.'
  }

  if (!TRAVEL_STYLES.includes(form.travelStyle)) {
    errors.travelStyle = 'Select a travel style.'
  }

  if (!TRANSPORT_MODES.includes(form.transportation)) {
    errors.transportation = 'Select preferred transportation.'
  }

  if (!ACCOMMODATION_PREFS.includes(form.accommodation)) {
    errors.accommodation = 'Select an accommodation preference.'
  }

  if (form.interests.length === 0) {
    errors.interests = 'Choose at least one interest.'
  } else if (form.interests.some((item) => !INTEREST_OPTIONS.includes(item))) {
    errors.interests = 'Remove invalid interests and try again.'
  }

  return errors
}

export function hasErrors(errors: TripFormErrors): boolean {
  return Object.keys(errors).length > 0
}
