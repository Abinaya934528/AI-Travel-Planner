import { Heart, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DestinationImage } from '../components/DestinationImage'
import { EmptyState } from '../components/EmptyState'
import { getDestinationById } from '../data/destinations'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { mapsStatusMessage, openStreetMapEmbedUrl, openStreetMapLink } from '../services/maps'
import { getWeatherSnapshot } from '../services/weather'
import { formatInr } from '../utils/currency'

export function DestinationDetailPage() {
  const { id } = useParams()
  const destination = id ? getDestinationById(id) : undefined
  const { isFavorite, toggleFavorite } = useFavorites()
  const { pushToast } = useToast()

  if (!destination) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Destination not found"
          description="That place is not in this catalogue yet. You can still plan a custom trip."
          action={
            <Link to="/plan" className="rounded-full bg-ocean px-5 py-3 text-white">
              Plan a custom trip
            </Link>
          }
        />
      </div>
    )
  }

  const weather = getWeatherSnapshot(destination)
  const embed = openStreetMapEmbedUrl(destination)
  const favorite = isFavorite(destination.id)

  return (
    <div>
      <section className="relative h-[48vh] min-h-80">
        <DestinationImage src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 py-8 text-white">
          <p className="flex items-center gap-2 text-gold">
            <MapPin size={16} /> {destination.region}, {destination.country}
          </p>
          <h1 className="font-display text-5xl">{destination.name}</h1>
          <p className="mt-2 max-w-2xl text-white/85">{destination.tagline}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-lg text-ink-soft">{destination.description}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {destination.images.map((src) => (
              <DestinationImage key={src} src={src} alt="" className="h-48 w-full rounded-3xl object-cover" />
            ))}
          </div>
          <section>
            <h2 className="font-display text-3xl">Suggested activities</h2>
            <ul className="mt-3 list-disc pl-5 text-ink-soft">
              {destination.activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl bg-white p-5 ring-1 ring-sand-deep/70">
            <h2 className="font-display text-3xl">Weather and climate</h2>
            <p className="mt-2 font-medium">{weather.headline}</p>
            <p className="mt-2 text-sm text-ink-soft">{weather.detail}</p>
          </section>
          <section className="rounded-3xl bg-white p-5 ring-1 ring-sand-deep/70">
            <h2 className="font-display text-3xl">Map and directions</h2>
            <p className="mt-2 text-sm text-ink-soft">{mapsStatusMessage()}</p>
            {embed ? (
              <iframe
                title={`Map of ${destination.name}`}
                className="mt-4 h-72 w-full rounded-2xl border-0"
                src={embed}
              />
            ) : (
              <p className="mt-3 text-sm">A map embed is not available for this custom location.</p>
            )}
            <a className="mt-3 inline-block text-sm font-semibold text-ocean" href={openStreetMapLink(destination)} target="_blank" rel="noreferrer">
              Open in OpenStreetMap
            </a>
          </section>
        </div>
        <aside className="h-fit space-y-4 rounded-3xl bg-white p-6 ring-1 ring-sand-deep/70">
          <p className="text-sm text-ink-soft">Recommended duration</p>
          <p className="text-lg font-semibold">
            {destination.durationDays.min}–{destination.durationDays.max} days
          </p>
          <p className="text-sm text-ink-soft">Approximate budget range (per person, estimate)</p>
          <p className="text-lg font-semibold">
            {formatInr(destination.budgetRangeInr.min)} – {formatInr(destination.budgetRangeInr.max)}
          </p>
          <p className="text-sm text-ink-soft">Best-season guidance</p>
          <p>{destination.bestSeason}</p>
          <p className="text-sm text-ink-soft">Travel styles</p>
          <p>{destination.travelStyles.join(', ')}</p>
          <div className="flex flex-col gap-3 pt-2">
            <Link to={`/plan?destination=${destination.id}`} className="rounded-full bg-ocean px-4 py-3 text-center font-semibold text-white">
              Plan a trip here
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sand-deep px-4 py-3"
              onClick={() => {
                toggleFavorite(destination.id)
                pushToast('success', favorite ? 'Removed from favorites.' : 'Saved to favorites.')
              }}
            >
              <Heart size={16} className={favorite ? 'fill-coral text-coral' : ''} />
              {favorite ? 'Remove from favorites' : 'Save to favorites'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
