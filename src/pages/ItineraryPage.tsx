import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { ItineraryView } from '../components/ItineraryView'
import { useCurrentItinerary } from '../hooks/useCurrentItinerary'
import { useToast } from '../hooks/useToast'
import { itineraryPlainText } from '../services/itineraryGenerator'
import { copyText, printItinerary, shareItinerary } from '../services/share'
import { saveItinerary } from '../services/trips'

export function ItineraryPage() {
  const { itinerary } = useCurrentItinerary()
  const { pushToast } = useToast()

  if (!itinerary) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="No itinerary yet"
          description="Generate a trip plan first. Saved trips can also be opened from the saved list."
          action={
            <Link to="/plan" className="rounded-full bg-ocean px-5 py-3 text-white">
              Plan My Trip
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <ItineraryView
        itinerary={itinerary}
        onCopy={async () => {
          const ok = await copyText(itineraryPlainText(itinerary))
          pushToast(ok ? 'success' : 'error', ok ? 'Itinerary copied to clipboard.' : 'Could not copy itinerary.')
        }}
        onShare={async () => {
          const result = await shareItinerary(itinerary)
          if (result === 'shared') pushToast('success', 'Share sheet opened.')
          else if (result === 'copied') pushToast('success', 'Sharing is unavailable here, so the itinerary was copied instead.')
          else pushToast('info', 'Share was cancelled or is unavailable.')
        }}
        onPrint={() => {
          printItinerary()
          pushToast('info', 'Use your browser print dialog. Header and footer are hidden in print view.')
        }}
        onSave={() => {
          const saved = saveItinerary(itinerary)
          pushToast(saved ? 'success' : 'error', saved ? 'Trip saved on this device.' : 'Could not save the trip.')
        }}
      />
      <div className="no-print mt-6 flex flex-wrap gap-3">
        <Link to="/budget" className="rounded-full bg-gold px-5 py-3 font-semibold text-ink">
          Open budget dashboard
        </Link>
        <Link to="/saved" className="rounded-full border border-sand-deep px-5 py-3">
          View saved trips
        </Link>
      </div>
    </div>
  )
}
