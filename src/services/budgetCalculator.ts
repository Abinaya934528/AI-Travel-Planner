import type { BudgetBreakdown, Destination, TripFormData } from '../types'
import { tripDays } from '../utils/dates'

const transportBase: Record<TripFormData['transportation'], number> = {
  Flight: 8500,
  Train: 2200,
  Bus: 1200,
  Car: 3500,
  Mixed: 4000,
}

const stayNightly: Record<TripFormData['accommodation'], number> = {
  Budget: 1800,
  'Mid-range': 4200,
  Boutique: 6500,
  Luxury: 14000,
  Homestay: 2800,
}

const foodDaily: Record<TripFormData['travelStyle'], number> = {
  Adventure: 900,
  Relaxation: 1100,
  Cultural: 1000,
  Family: 950,
  Romantic: 1400,
  'Food and Culinary': 1800,
  Nature: 850,
  'Budget Travel': 600,
}

export function estimateBudget(form: TripFormData, destination?: Destination): BudgetBreakdown {
  const days = tripDays(form.departureDate, form.returnDate)
  const nights = Math.max(1, days - 1)
  const people = Math.max(1, form.travellers)
  const rooms = Math.max(1, Math.ceil(people / 2))
  const destFactor = destination ? Math.max(0.7, destination.budgetRangeInr.min / 25000) : 1
  const intlBump = destination && destination.country !== 'India' ? 1.8 : 1

  const transportation = Math.round(
    transportBase[form.transportation] * people * destFactor * intlBump,
  )
  const accommodation = Math.round(stayNightly[form.accommodation] * nights * rooms * destFactor)
  const food = Math.round(foodDaily[form.travelStyle] * days * people * destFactor)
  const activities = Math.round(days * people * (form.travelStyle === 'Adventure' ? 1600 : 1100) * destFactor)
  const shopping = Math.round(form.budgetInr * (form.travelStyle === 'Budget Travel' ? 0.05 : 0.08))
  const miscellaneous = Math.round((transportation + accommodation + food + activities) * 0.08)

  return {
    transportation,
    accommodation,
    food,
    activities,
    shopping,
    miscellaneous,
  }
}

export function budgetTotal(breakdown: BudgetBreakdown): number {
  return (
    breakdown.transportation +
    breakdown.accommodation +
    breakdown.food +
    breakdown.activities +
    breakdown.shopping +
    breakdown.miscellaneous
  )
}

export const BUDGET_LABELS: Record<keyof BudgetBreakdown, string> = {
  transportation: 'Transportation',
  accommodation: 'Accommodation',
  food: 'Food',
  activities: 'Activities and attractions',
  shopping: 'Shopping',
  miscellaneous: 'Miscellaneous',
}
