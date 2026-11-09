import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DestinationCard } from '../components/DestinationCard'
import { EmptyState } from '../components/EmptyState'
import { destinations } from '../data/destinations'
import { useFavorites } from '../hooks/useFavorites'
import { TRAVEL_STYLES, type TravelStyle } from '../types'

type SortKey = 'name' | 'budget-asc' | 'budget-desc' | 'duration'

export function DestinationsPage() {
  const [params, setParams] = useSearchParams()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [style, setStyle] = useState<TravelStyle | 'All'>('All')
  const [budget, setBudget] = useState<'All' | 'under-40k' | '40-90k' | 'over-90k'>('All')
  const [sort, setSort] = useState<SortKey>('name')
  const query = params.get('q') ?? ''

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = destinations.filter((item) => {
      const matchesQuery =
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        item.country.toLowerCase().includes(needle) ||
        item.region.toLowerCase().includes(needle)
      const matchesStyle = style === 'All' || item.travelStyles.includes(style)
      const mid = (item.budgetRangeInr.min + item.budgetRangeInr.max) / 2
      const matchesBudget =
        budget === 'All' ||
        (budget === 'under-40k' && mid < 40000) ||
        (budget === '40-90k' && mid >= 40000 && mid <= 90000) ||
        (budget === 'over-90k' && mid > 90000)
      return matchesQuery && matchesStyle && matchesBudget
    })
    list = [...list].sort((a, b) => {
      if (sort === 'budget-asc') return a.budgetRangeInr.min - b.budgetRangeInr.min
      if (sort === 'budget-desc') return b.budgetRangeInr.max - a.budgetRangeInr.max
      if (sort === 'duration') return a.durationDays.min - b.durationDays.min
      return a.name.localeCompare(b.name)
    })
    return list
  }, [budget, query, sort, style])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-ocean">Explore</p>
      <h1 className="font-display text-5xl">Destination explorer</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Search India favourites and selected international cities. Prices are approximate ranges per person, not live quotes.
      </p>

      <div className="mt-8 grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-sand-deep/70 md:grid-cols-4">
        <label className="grid gap-1 text-sm">
          Search by name
          <input
            value={query}
            onChange={(event) => {
              const next = new URLSearchParams(params)
              if (event.target.value) next.set('q', event.target.value)
              else next.delete('q')
              setParams(next, { replace: true })
            }}
            className="rounded-xl border border-sand-deep px-3 py-2"
            placeholder="Chennai, Goa, Paris..."
          />
        </label>
        <label className="grid gap-1 text-sm">
          Travel style
          <select value={style} onChange={(event) => setStyle(event.target.value as TravelStyle | 'All')} className="rounded-xl border border-sand-deep px-3 py-2">
            <option value="All">All styles</option>
            {TRAVEL_STYLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Budget filter
          <select value={budget} onChange={(event) => setBudget(event.target.value as typeof budget)} className="rounded-xl border border-sand-deep px-3 py-2">
            <option value="All">All budgets</option>
            <option value="under-40k">Under ₹40,000</option>
            <option value="40-90k">₹40,000 – ₹90,000</option>
            <option value="over-90k">Over ₹90,000</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Sort
          <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className="rounded-xl border border-sand-deep px-3 py-2">
            <option value="name">Name</option>
            <option value="budget-asc">Budget: low to high</option>
            <option value="budget-desc">Budget: high to low</option>
            <option value="duration">Suggested duration</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No destinations match" description="Try a different name, style, or budget range." />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              favorite={isFavorite(destination.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}
