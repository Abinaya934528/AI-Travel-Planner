import { Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Destination } from '../types'
import { formatInr } from '../utils/currency'
import { DestinationImage } from './DestinationImage'

interface DestinationCardProps {
  destination: Destination
  favorite?: boolean
  onToggleFavorite?: (id: string) => void
}

export function DestinationCard({ destination, favorite, onToggleFavorite }: DestinationCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-sand-deep/70">
      <div className="relative h-52 overflow-hidden">
        <DestinationImage
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {onToggleFavorite ? (
          <button
            type="button"
            className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-coral"
            aria-label={favorite ? `Remove ${destination.name} from favorites` : `Save ${destination.name} to favorites`}
            onClick={() => onToggleFavorite(destination.id)}
          >
            <Heart className={favorite ? 'fill-coral' : ''} size={18} />
          </button>
        ) : null}
      </div>
      <div className="p-5">
        <p className="flex items-center gap-1 text-sm text-ocean">
          <MapPin size={14} /> {destination.region}, {destination.country}
        </p>
        <h3 className="mt-1 font-display text-2xl">{destination.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{destination.tagline}</p>
        <p className="mt-3 text-sm">
          {formatInr(destination.budgetRangeInr.min)} – {formatInr(destination.budgetRangeInr.max)}{' '}
          <span className="text-ink-soft">est. per person</span>
        </p>
        <Link
          to={`/destinations/${destination.id}`}
          className="mt-4 inline-flex text-sm font-semibold text-ocean"
        >
          View destination
        </Link>
      </div>
    </article>
  )
}
