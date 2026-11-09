import { Link } from 'react-router-dom'
import { DestinationCard } from '../components/DestinationCard'
import { EmptyState } from '../components/EmptyState'
import { destinations } from '../data/destinations'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'

export function FavoritesPage() {
  const { ids, isFavorite, toggleFavorite } = useFavorites()
  const { pushToast } = useToast()
  const saved = destinations.filter((item) => ids.includes(item.id))

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-ocean">Saved list</p>
      <h1 className="font-display text-5xl">Favorite destinations</h1>
      {saved.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No favorites yet"
            description="Tap the heart on any destination card to build a shortlist."
            action={
              <Link to="/destinations" className="rounded-full bg-ocean px-5 py-3 text-white">
                Explore Destinations
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              favorite={isFavorite(destination.id)}
              onToggleFavorite={(id) => {
                toggleFavorite(id)
                pushToast('success', 'Favorites updated.')
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
