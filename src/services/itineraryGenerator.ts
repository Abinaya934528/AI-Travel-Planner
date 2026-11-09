import { destinations, findDestinationByName, getDestinationById } from '../data/destinations'
import type { DayPlan, Destination, GeneratedItinerary, TripFormData } from '../types'
import { addDaysIso, formatDisplayDate, tripDays } from '../utils/dates'
import { estimateBudget } from './budgetCalculator'

export const ITINERARY_DISCLAIMER =
  'These recommendations are local planning suggestions, not live bookings. Verify opening hours, tickets, weather, transport, and prices before you travel. Amounts are estimates in Indian rupees, not guaranteed quotes.'

export interface ItineraryGenerator {
  generate(form: TripFormData): Promise<GeneratedItinerary>
}

function pick<T>(items: T[], index: number, count: number): T[] {
  if (items.length === 0) return []
  const result: T[] = []
  for (let i = 0; i < count; i += 1) {
    result.push(items[(index + i) % items.length])
  }
  return result
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)]
}

function styleTitle(day: number, style: TripFormData['travelStyle'], destinationName: string): string {
  const titles: Record<TripFormData['travelStyle'], string[]> = {
    Adventure: ['Outdoor stretch', 'Active exploring', 'Trail and viewpoint day'],
    Relaxation: ['Unhurried morning', 'Slow scenic day', 'Rest-and-wander day'],
    Cultural: ['Heritage focus', 'Old-town stories', 'Craft and culture day'],
    Family: ['Easy shared sights', 'Family-friendly loop', 'Parks and simple icons'],
    Romantic: ['Scenic pair day', 'Golden-hour plan', 'Quiet corners together'],
    'Food and Culinary': ['Taste-led day', 'Markets and meals', 'Regional flavours'],
    Nature: ['Landscapes first', 'Green spaces and water', 'Outdoor quiet time'],
    'Budget Travel': ['High-value sights', 'Walkable neighbourhoods', 'Free-and-affordable finds'],
  }
  const options = titles[style]
  return `Day ${day} in ${destinationName}: ${options[(day - 1) % options.length]}`
}

function genericDestination(name: string): Destination {
  return {
    id: 'custom',
    name,
    country: 'Traveller-specified',
    region: 'Custom',
    tagline: 'A flexible plan built from your dates, budget, and interests.',
    description: `A locally generated outline for ${name}. Confirm all details with current local sources.`,
    image: '',
    images: [],
    travelStyles: ['Cultural', 'Relaxation', 'Nature', 'Food and Culinary'],
    activities: ['Neighbourhood walk', 'Signature landmark', 'Local food stop', 'Viewpoint or park'],
    durationDays: { min: 2, max: 7 },
    budgetRangeInr: { min: 15000, max: 80000 },
    bestSeason: 'Depends on region—verify seasonality',
    climateNote: 'Live weather is not connected. Check a trusted forecast before departure.',
    lat: 0,
    lng: 0,
    morningIdeas: [
      'Start with a well-known landmark or viewpoint',
      'Walk a central neighbourhood before it gets busy',
      'Visit a museum or house of worship if it matches your interests',
      'Have a simple local breakfast near your stay',
    ],
    afternoonIdeas: [
      'Visit a park, market, or craft street',
      'Choose one paid attraction and keep the rest flexible',
      'Rest during peak heat or rain',
      'Try a highly rated casual restaurant',
    ],
    eveningIdeas: [
      'Watch sunset from a public viewpoint',
      'Dinner focused on regional specialities',
      'Gentle night walk in a well-lit area',
      'Keep one evening unscheduled for rest',
    ],
    attractions: ['Main historic or natural highlight', 'Local market', 'City viewpoint', 'Neighbourhood street'],
    food: ['Regional breakfast', 'Casual lunch', 'Signature dinner dish', 'Cafe or dessert stop'],
    tips: [
      'Build buffer time between sights.',
      'Save offline maps and key addresses.',
      'Confirm transport options the night before.',
    ],
  }
}

function resolveDestination(form: TripFormData): Destination {
  return (
    getDestinationById(form.destinationId) ??
    findDestinationByName(form.destinationName) ??
    destinations.find((item) =>
      form.destinationName.toLowerCase().includes(item.name.toLowerCase()),
    ) ??
    genericDestination(form.destinationName.trim() || 'your destination')
  )
}

function extraTips(form: TripFormData, destination: Destination): string[] {
  const tips = [...destination.tips]
  if (form.specialRequirements.trim()) {
    tips.push(`You noted: “${form.specialRequirements.trim()}”. Build this into bookings and daily timing.`)
  }
  if (form.travellers > 4) {
    tips.push('Larger groups should pre-book tables and transport to avoid splits.')
  }
  if (form.travelStyle === 'Budget Travel') {
    tips.push('Prioritise walking, shared transit, and one paid highlight per day.')
  }
  if (destination.country !== 'India') {
    tips.push('International trips need extra time for immigration, SIM/eSIM, and currency.')
  }
  return uniqueStrings(tips).slice(0, 4)
}

function interestBias(form: TripFormData): string[] {
  const extras: string[] = []
  for (const interest of form.interests) {
    if (interest === 'Beaches') extras.push('Keep a flexible beach or waterfront window')
    if (interest === 'Mountains') extras.push('Add a viewpoint or short ridge walk if accessible')
    if (interest === 'Temples and Heritage') extras.push('Schedule one heritage site with modest clothing ready')
    if (interest === 'Wildlife') extras.push('Only join wildlife activities with licensed operators')
    if (interest === 'Nightlife') extras.push('Save energy for a well-reviewed evening neighbourhood')
    if (interest === 'Shopping') extras.push('Compare prices in markets and keep valuables zipped')
    if (interest === 'Photography') extras.push('Use early light for the most photogenic stop')
    if (interest === 'Wellness and Spa') extras.push('Leave an unhurried spa or rest block')
    if (interest === 'Local Markets') extras.push('Visit a market when it is typically active—verify locally')
    if (interest === 'Hiking') extras.push('Pick a trail within your fitness and the season’s safety limits')
    if (interest === 'Water Sports') extras.push('Use licensed operators and check conditions on the day')
    if (interest === 'Museums') extras.push('Pre-book timed museum tickets when they exist')
  }
  return extras
}

export function buildLocalItinerary(form: TripFormData): GeneratedItinerary {
  const destination = resolveDestination(form)
  const daysCount = tripDays(form.departureDate, form.returnDate)
  const budget = estimateBudget(form, destination.id === 'custom' ? undefined : destination)
  const people = Math.max(1, form.travellers)
  const activityShare = budget.activities / daysCount
  const transportShare = budget.transportation / daysCount
  const extras = interestBias(form)

  const days: DayPlan[] = Array.from({ length: daysCount }, (_, index) => {
    const day = index + 1
    const isArrival = index === 0
    const isDeparture = index === daysCount - 1 && daysCount > 1
    const morning = isArrival
      ? ['Arrive, check in when possible, and keep the first morning light.', ...pick(destination.morningIdeas, index, 1)]
      : pick(destination.morningIdeas, index, 2)
    const afternoon = isDeparture
      ? ['Keep this afternoon light if you have a return journey.', ...pick(destination.afternoonIdeas, index, 1)]
      : pick(destination.afternoonIdeas, index, 2)
    const evening = pick(destination.eveningIdeas, index + 1, 2)

    return {
      day,
      date: addDaysIso(form.departureDate, index),
      title: styleTitle(day, form.travelStyle, destination.name),
      morning,
      afternoon,
      evening,
      attractions: pick(destination.attractions, index, 2),
      food: pick(destination.food, index, 2),
      activityCostInr: Math.round((activityShare / people) * (isArrival || isDeparture ? 0.6 : 1)),
      transportCostInr: Math.round((transportShare / people) * (isArrival || isDeparture ? 1.2 : 0.85)),
      tips: uniqueStrings([
        ...pick(extraTips(form, destination), index, 2),
        ...(extras.length ? [extras[index % extras.length]] : []),
      ]),
    }
  })

  const summary = `${daysCount}-day ${form.travelStyle.toLowerCase()} outline for ${people} traveller${
    people === 1 ? '' : 's'
  } travelling from ${form.startingLocation} to ${destination.name}. Built locally from destination notes, your dates, budget, and interests.`

  return {
    form: {
      ...form,
      destinationId: destination.id === 'custom' ? '' : destination.id,
      destinationName: destination.name,
    },
    days,
    budget,
    summary,
    disclaimer: ITINERARY_DISCLAIMER,
    generatedAt: new Date().toISOString(),
    source: 'local-demo',
  }
}

export const localItineraryGenerator: ItineraryGenerator = {
  async generate(form) {
    await new Promise((resolve) => setTimeout(resolve, 650))
    return buildLocalItinerary(form)
  },
}

export async function generateItinerary(form: TripFormData): Promise<GeneratedItinerary> {
  const remoteUrl = import.meta.env.VITE_ITINERARY_API_URL as string | undefined
  if (remoteUrl) {
    try {
      const response = await fetch(remoteUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (response.ok) {
        const payload = (await response.json()) as GeneratedItinerary
        if (payload?.days?.length) {
          return { ...payload, source: 'remote-api' }
        }
      }
    } catch {
      /* fall back to the local generator */
    }
  }
  return localItineraryGenerator.generate(form)
}

export function itineraryPlainText(itinerary: GeneratedItinerary): string {
  const lines = [
    `AI Travel Planner — ${itinerary.form.destinationName}`,
    itinerary.summary,
    `Dates: ${formatDisplayDate(itinerary.form.departureDate)} to ${formatDisplayDate(itinerary.form.returnDate)}`,
    `Travellers: ${itinerary.form.travellers}`,
    `Style: ${itinerary.form.travelStyle}`,
    '',
    itinerary.disclaimer,
    '',
  ]
  for (const day of itinerary.days) {
    lines.push(`${day.title} (${formatDisplayDate(day.date)})`)
    lines.push(`Morning: ${day.morning.join('; ')}`)
    lines.push(`Afternoon: ${day.afternoon.join('; ')}`)
    lines.push(`Evening: ${day.evening.join('; ')}`)
    lines.push(`Food: ${day.food.join('; ')}`)
    lines.push(`Suggested attractions: ${day.attractions.join('; ')}`)
    lines.push(
      `Estimated activity cost per person (indicative): INR ${day.activityCostInr}; local transport INR ${day.transportCostInr}`,
    )
    lines.push(`Tips: ${day.tips.join('; ')}`)
    lines.push('')
  }
  return lines.join('\n')
}
