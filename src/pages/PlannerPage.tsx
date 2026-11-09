import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { destinations, getDestinationById } from '../data/destinations'
import { useCurrentItinerary } from '../hooks/useCurrentItinerary'
import { useToast } from '../hooks/useToast'
import { generateItinerary } from '../services/itineraryGenerator'
import { readJson, STORAGE_KEYS, writeJson } from '../services/storage'
import {
  ACCOMMODATION_PREFS,
  INTEREST_OPTIONS,
  TRANSPORT_MODES,
  TRAVEL_STYLES,
  type Interest,
  type TripFormData,
} from '../types'
import { todayIsoDate } from '../utils/dates'
import { hasErrors, validateTripForm } from '../utils/validation'

function emptyForm(destinationId = ''): TripFormData {
  const destination = getDestinationById(destinationId)
  return {
    destinationId: destination?.id ?? '',
    destinationName: destination?.name ?? '',
    startingLocation: '',
    departureDate: todayIsoDate(),
    returnDate: todayIsoDate(),
    travellers: 2,
    budgetInr: destination?.budgetRangeInr.min ?? 40000,
    travelStyle: 'Cultural',
    transportation: 'Flight',
    accommodation: 'Mid-range',
    interests: ['Photography'],
    specialRequirements: '',
  }
}

export function PlannerPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const { saveCurrent } = useCurrentItinerary()
  const initial = useMemo(() => {
    const draft = readJson<Partial<TripFormData> | null>(STORAGE_KEYS.draftForm, null)
    const requested = params.get('destination') ?? ''
    const fromQuery = emptyForm(requested)
    const merged = { ...fromQuery, ...(draft ?? {}) }
    if (requested && fromQuery.destinationId) {
      merged.destinationId = fromQuery.destinationId
      merged.destinationName = fromQuery.destinationName
    }
    return merged
  }, [params])
  const [form, setForm] = useState<TripFormData>(initial)
  const [errors, setErrors] = useState<ReturnType<typeof validateTripForm>>({})
  const [loading, setLoading] = useState(false)

  function update<K extends keyof TripFormData>(key: K, value: TripFormData[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value }
      writeJson(STORAGE_KEYS.draftForm, next)
      return next
    })
  }

  function toggleInterest(interest: Interest) {
    const next = form.interests.includes(interest)
      ? form.interests.filter((item) => item !== interest)
      : [...form.interests, interest]
    update('interests', next)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateTripForm(form)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) {
      pushToast('error', 'Please fix the highlighted fields.')
      return
    }
    setLoading(true)
    try {
      const itinerary = await generateItinerary(form)
      saveCurrent(itinerary)
      pushToast('success', 'Itinerary draft ready. Review and save if you like it.')
      navigate('/itinerary')
    } catch {
      pushToast('error', 'Could not generate an itinerary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-ocean">Trip planner</p>
      <h1 className="font-display text-5xl">Plan a trip</h1>
      <p className="mt-3 text-ink-soft">
        All fields are validated locally. The itinerary is generated on this device unless a secure backend URL is configured later.
      </p>
      {loading ? <LoadingSpinner label="Building your day-by-day outline..." /> : null}
      <form onSubmit={onSubmit} className="mt-8 grid gap-5 rounded-3xl bg-white p-6 ring-1 ring-sand-deep/70" noValidate>
        <label className="grid gap-1 text-sm">
          Destination
          <input
            list="destination-options"
            value={form.destinationName}
            onChange={(event) => {
              const name = event.target.value
              const match = destinations.find((item) => item.name.toLowerCase() === name.toLowerCase())
              update('destinationName', name)
              update('destinationId', match?.id ?? '')
            }}
            className="rounded-xl border border-sand-deep px-3 py-2"
            required
          />
          <datalist id="destination-options">
            {destinations.map((item) => (
              <option key={item.id} value={item.name} />
            ))}
          </datalist>
          {errors.destinationName ? <span className="text-coral">{errors.destinationName}</span> : null}
        </label>
        <label className="grid gap-1 text-sm">
          Starting location
          <input
            value={form.startingLocation}
            onChange={(event) => update('startingLocation', event.target.value)}
            className="rounded-xl border border-sand-deep px-3 py-2"
            placeholder="City or airport you start from"
            required
          />
          {errors.startingLocation ? <span className="text-coral">{errors.startingLocation}</span> : null}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Departure date
            <input
              type="date"
              value={form.departureDate}
              min={todayIsoDate()}
              onChange={(event) => update('departureDate', event.target.value)}
              className="rounded-xl border border-sand-deep px-3 py-2"
              required
            />
            {errors.departureDate ? <span className="text-coral">{errors.departureDate}</span> : null}
          </label>
          <label className="grid gap-1 text-sm">
            Return date
            <input
              type="date"
              value={form.returnDate}
              min={form.departureDate || todayIsoDate()}
              onChange={(event) => update('returnDate', event.target.value)}
              className="rounded-xl border border-sand-deep px-3 py-2"
              required
            />
            {errors.returnDate ? <span className="text-coral">{errors.returnDate}</span> : null}
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Number of travellers
            <input
              type="number"
              min={1}
              max={12}
              value={form.travellers}
              onChange={(event) => update('travellers', Number(event.target.value))}
              className="rounded-xl border border-sand-deep px-3 py-2"
              required
            />
            {errors.travellers ? <span className="text-coral">{errors.travellers}</span> : null}
          </label>
          <label className="grid gap-1 text-sm">
            Total budget (INR)
            <input
              type="number"
              min={1}
              value={form.budgetInr}
              onChange={(event) => update('budgetInr', Number(event.target.value))}
              className="rounded-xl border border-sand-deep px-3 py-2"
              required
            />
            {errors.budgetInr ? <span className="text-coral">{errors.budgetInr}</span> : null}
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          Travel style
          <select
            value={form.travelStyle}
            onChange={(event) => update('travelStyle', event.target.value as TripFormData['travelStyle'])}
            className="rounded-xl border border-sand-deep px-3 py-2"
          >
            {TRAVEL_STYLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Preferred transportation
          <select
            value={form.transportation}
            onChange={(event) => update('transportation', event.target.value as TripFormData['transportation'])}
            className="rounded-xl border border-sand-deep px-3 py-2"
          >
            {TRANSPORT_MODES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Accommodation preference
          <select
            value={form.accommodation}
            onChange={(event) => update('accommodation', event.target.value as TripFormData['accommodation'])}
            className="rounded-xl border border-sand-deep px-3 py-2"
          >
            {ACCOMMODATION_PREFS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend className="text-sm">Interests and activities</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <label key={interest} className="inline-flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                />
                {interest}
              </label>
            ))}
          </div>
          {errors.interests ? <span className="text-sm text-coral">{errors.interests}</span> : null}
        </fieldset>
        <label className="grid gap-1 text-sm">
          Special requirements
          <textarea
            value={form.specialRequirements}
            onChange={(event) => update('specialRequirements', event.target.value)}
            className="min-h-24 rounded-xl border border-sand-deep px-3 py-2"
            placeholder="Accessibility needs, dietary notes, or must-see requests"
          />
        </label>
        <button type="submit" className="rounded-full bg-ocean px-5 py-3 font-semibold text-white" disabled={loading}>
          Generate itinerary
        </button>
      </form>
    </div>
  )
}
