import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { ItineraryView } from '../components/ItineraryView'
import { useCurrentItinerary } from '../hooks/useCurrentItinerary'
import { useToast } from '../hooks/useToast'
import { itineraryPlainText } from '../services/itineraryGenerator'
import { copyText, printItinerary, shareItinerary } from '../services/share'
import { STORAGE_KEYS, writeJson } from '../services/storage'
import { getSavedTrip, updateSavedTrip } from '../services/trips'

export function TripDetailPage() {
  const { id } = useParams()
  const existing = id ? getSavedTrip(id) : undefined
  const [title, setTitle] = useState(existing?.title ?? '')
  const { pushToast } = useToast()
  const { saveCurrent } = useCurrentItinerary()
  const navigate = useNavigate()

  if (!existing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Trip not found"
          description="This saved trip may have been deleted or the stored data could not be read."
          action={
            <Link to="/saved" className="rounded-full bg-ocean px-5 py-3 text-white">
              Back to saved trips
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <label className="grid max-w-xl gap-1 text-sm">
        Trip title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-xl border border-sand-deep px-3 py-2"
        />
      </label>
      <button
        type="button"
        className="mt-3 rounded-full bg-gold px-4 py-2 text-sm text-ink"
        onClick={() => {
          const updated = updateSavedTrip(existing.id, { title })
          pushToast(updated ? 'success' : 'error', updated ? 'Trip details updated.' : 'Could not update this trip.')
        }}
      >
        Save trip information
      </button>
      <div className="mt-8">
        <ItineraryView
          itinerary={existing.itinerary}
          onCopy={async () => {
            const ok = await copyText(itineraryPlainText(existing.itinerary))
            pushToast(ok ? 'success' : 'error', ok ? 'Itinerary copied to clipboard.' : 'Could not copy itinerary.')
          }}
          onShare={async () => {
            const result = await shareItinerary(existing.itinerary)
            if (result === 'shared') pushToast('success', 'Share sheet opened.')
            else if (result === 'copied') pushToast('success', 'Itinerary copied instead of sharing.')
            else pushToast('info', 'Share was cancelled or is unavailable.')
          }}
          onPrint={printItinerary}
        />
      </div>
      <button
        type="button"
        className="mt-4 rounded-full border border-sand-deep px-4 py-2 text-sm"
        onClick={() => {
          saveCurrent(existing.itinerary)
          writeJson(STORAGE_KEYS.draftForm, existing.itinerary.form)
          navigate('/plan')
          pushToast('info', 'Loaded into the planner. Adjust details and generate again if you want a new outline.')
        }}
      >
        Edit in planner
      </button>
    </div>
  )
}
