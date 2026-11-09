import { ClipboardCopy, Printer, Share2 } from 'lucide-react'
import type { GeneratedItinerary } from '../types'
import { formatInr } from '../utils/currency'
import { formatDisplayDate } from '../utils/dates'

interface ItineraryViewProps {
  itinerary: GeneratedItinerary
  onCopy: () => void
  onShare: () => void
  onPrint: () => void
  onSave?: () => void
}

export function ItineraryView({ itinerary, onCopy, onShare, onPrint, onSave }: ItineraryViewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sand-deep/70">
        <p className="text-sm uppercase tracking-[0.2em] text-ocean">
          {itinerary.source === 'local-demo' ? 'Local itinerary generator' : 'Remote itinerary'}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink">{itinerary.form.destinationName}</h1>
        <p className="mt-3 max-w-3xl text-ink-soft">{itinerary.summary}</p>
        <p className="mt-4 text-sm text-ink-soft">
          {formatDisplayDate(itinerary.form.departureDate)} – {formatDisplayDate(itinerary.form.returnDate)} ·{' '}
          {itinerary.form.travellers} traveller{itinerary.form.travellers === 1 ? '' : 's'} · {itinerary.form.travelStyle}
        </p>
        <p className="mt-4 rounded-2xl bg-sand px-4 py-3 text-sm text-ink-soft">{itinerary.disclaimer}</p>
        <div className="no-print mt-5 flex flex-wrap gap-3">
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-ocean px-4 py-2 text-sm text-white" onClick={onCopy}>
            <ClipboardCopy size={16} /> Copy itinerary
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-sand-deep px-4 py-2 text-sm" onClick={onShare}>
            <Share2 size={16} /> Share trip
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-sand-deep px-4 py-2 text-sm" onClick={onPrint}>
            <Printer size={16} /> Print-friendly view
          </button>
          {onSave ? (
            <button type="button" className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm text-ink" onClick={onSave}>
              Save trip
            </button>
          ) : null}
        </div>
      </div>

      {itinerary.days.map((day) => (
        <article key={day.day} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sand-deep/70">
          <h2 className="font-display text-3xl">{day.title}</h2>
          <p className="text-sm text-ocean">{formatDisplayDate(day.date)}</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">Morning</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">{day.morning.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">Afternoon</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">{day.afternoon.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">Evening</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">{day.evening.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <p className="text-sm"><span className="font-semibold">Suggested attractions:</span> {day.attractions.join(', ')}</p>
            <p className="text-sm"><span className="font-semibold">Food recommendations:</span> {day.food.join(', ')}</p>
            <p className="text-sm">Approximate activity cost (per person, estimate): {formatInr(day.activityCostInr)}</p>
            <p className="text-sm">Estimated local transport (per person, estimate): {formatInr(day.transportCostInr)}</p>
          </div>
          <p className="mt-3 text-sm text-ink-soft">Tips: {day.tips.join(' ')}</p>
        </article>
      ))}
    </div>
  )
}
