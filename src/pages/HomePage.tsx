import { ArrowRight, Compass, Shield, Sparkles, Wallet } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DestinationCard } from '../components/DestinationCard'
import { DestinationImage } from '../components/DestinationImage'
import { destinations } from '../data/destinations'
import { inspirationCards } from '../data/inspiration'
import { useFavorites } from '../hooks/useFavorites'

const HERO =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80'

const steps = [
  { title: 'Choose a destination', text: 'Browse India and selected international cities, or type your own.' },
  { title: 'Tell us how you travel', text: 'Dates, budget in rupees, style, transport, and interests.' },
  { title: 'Review a suggested itinerary', text: 'A local generator drafts days you can save, share, and refine.' },
]

export function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { isFavorite, toggleFavorite } = useFavorites()
  const featured = useMemo(() => destinations.filter((item) => item.featured), [])
  const popular = useMemo(() => destinations.filter((item) => item.popular).slice(0, 8), [])

  function onSearch(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/destinations?q=${encodeURIComponent(trimmed)}` : '/destinations')
  }

  return (
    <div>
      <section className="relative min-h-[88svh] overflow-hidden text-white">
        <DestinationImage src={HERO} alt="Travellers looking toward a mountain lake" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-4 py-24">
          <p className="animate-fade-up text-sm uppercase tracking-[0.28em] text-gold">AI Travel Planner</p>
          <h1 className="animate-fade-up mt-4 max-w-4xl font-display text-5xl leading-tight md:text-7xl">
            Your Next Adventure Starts Here.
          </h1>
          <p className="animate-fade-up mt-5 max-w-2xl text-lg text-white/85">
            Discover destinations, plan unforgettable trips, and manage your travel budget in one place.
          </p>
          <form onSubmit={onSearch} className="animate-fade-up mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="hero-search">
              Search destinations
            </label>
            <input
              id="hero-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Goa, Jaipur, Tokyo..."
              className="w-full rounded-full border-0 bg-white/95 px-5 py-3 text-ink"
            />
            <button type="submit" className="rounded-full bg-gold px-6 py-3 font-semibold text-ink">
              Search
            </button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/plan" className="rounded-full bg-ocean px-5 py-3 font-semibold text-white">
              Plan My Trip
            </Link>
            <Link to="/destinations" className="rounded-full border border-white/40 px-5 py-3 font-semibold">
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-ocean">Featured</p>
            <h2 className="font-display text-4xl">Featured destinations</h2>
          </div>
          <Link to="/destinations" className="hidden items-center gap-1 text-sm font-semibold text-ocean sm:flex">
            All destinations <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              favorite={isFavorite(destination.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-4xl">Popular destinations</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                favorite={isFavorite(destination.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-4xl">Travel inspiration</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {inspirationCards.map((card) => (
            <Link key={card.id} to={`/destinations/${card.destinationId}`} className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-sand-deep/70">
              <DestinationImage src={card.image} alt="" className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-6">
                <h3 className="font-display text-3xl">{card.title}</h3>
                <p className="mt-2 text-ink-soft">{card.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-sand">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-4xl text-white">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/10 p-6">
                <p className="text-gold">0{index + 1}</p>
                <h3 className="mt-2 font-display text-3xl text-white">{step.title}</h3>
                <p className="mt-2 text-sand/80">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-4xl">Why plan here</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-sand-deep/70">
            <Sparkles className="text-ocean" />
            <h3 className="mt-3 font-display text-2xl">Personalised outlines</h3>
            <p className="mt-2 text-sm text-ink-soft">Day counts match your dates. Activities shift with style and interests.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-sand-deep/70">
            <Wallet className="text-ocean" />
            <h3 className="mt-3 font-display text-2xl">Rupee-first budgeting</h3>
            <p className="mt-2 text-sm text-ink-soft">See estimated costs, remaining budget, and per-person spend before you book.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-sand-deep/70">
            <Shield className="text-ocean" />
            <h3 className="mt-3 font-display text-2xl">Works without paid APIs</h3>
            <p className="mt-2 text-sm text-ink-soft">The itinerary engine runs locally. Live weather and bookings are clearly marked as future integrations.</p>
          </div>
        </div>
        <Link to="/plan" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ocean px-5 py-3 font-semibold text-white">
          <Compass size={18} /> Start planning
        </Link>
      </section>
    </div>
  )
}
