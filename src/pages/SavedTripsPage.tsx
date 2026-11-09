import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { useCurrentItinerary } from '../hooks/useCurrentItinerary'
import { useToast } from '../hooks/useToast'
import { deleteSavedTrip, duplicateSavedTrip, loadSavedTrips } from '../services/trips'
import { formatDisplayDate } from '../utils/dates'

export function SavedTripsPage() {
  const [trips, setTrips] = useState(() => loadSavedTrips())
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const { pushToast } = useToast()
  const { saveCurrent } = useCurrentItinerary()
  const navigate = useNavigate()

  function refresh() {
    setTrips(loadSavedTrips())
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-ocean">Library</p>
      <h1 className="font-display text-5xl">Saved trips</h1>
      <p className="mt-3 text-ink-soft">Trips stay in this browser’s local storage. Clearing site data will remove them.</p>
      {trips.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No saved trips yet"
            description="Generate an itinerary and tap Save trip to keep it on this device."
            action={
              <Link to="/plan" className="rounded-full bg-ocean px-5 py-3 text-white">
                Plan My Trip
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {trips.map((trip) => (
            <article key={trip.id} className="rounded-3xl bg-white p-5 ring-1 ring-sand-deep/70">
              <h2 className="font-display text-3xl">{trip.title}</h2>
              <p className="text-sm text-ink-soft">
                {trip.itinerary.form.destinationName} · {formatDisplayDate(trip.itinerary.form.departureDate)} –{' '}
                {formatDisplayDate(trip.itinerary.form.returnDate)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/saved/${trip.id}`} className="rounded-full bg-ocean px-4 py-2 text-sm text-white">
                  Open details
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-sand-deep px-4 py-2 text-sm"
                  onClick={() => {
                    saveCurrent(trip.itinerary)
                    navigate('/itinerary')
                  }}
                >
                  Load as current
                </button>
                <button
                  type="button"
                  className="rounded-full border border-sand-deep px-4 py-2 text-sm"
                  onClick={() => {
                    const copy = duplicateSavedTrip(trip.id)
                    refresh()
                    pushToast(copy ? 'success' : 'error', copy ? 'Trip duplicated.' : 'Could not duplicate this trip.')
                  }}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  className="rounded-full border border-coral/40 px-4 py-2 text-sm text-coral"
                  onClick={() => setPendingDelete(trip.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this trip?"
        description="This cannot be undone. The itinerary will be removed from this browser only."
        confirmLabel="Delete trip"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteSavedTrip(pendingDelete)
            refresh()
            pushToast('success', 'Trip deleted.')
          }
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
