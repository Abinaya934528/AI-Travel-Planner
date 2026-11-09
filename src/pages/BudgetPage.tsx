import { Link } from 'react-router-dom'
import { BudgetChart } from '../components/BudgetChart'
import { EmptyState } from '../components/EmptyState'
import { useCurrentItinerary } from '../hooks/useCurrentItinerary'
import { BUDGET_LABELS, budgetTotal } from '../services/budgetCalculator'
import type { BudgetBreakdown } from '../types'
import { formatInr } from '../utils/currency'

export function BudgetPage() {
  const { itinerary } = useCurrentItinerary()

  if (!itinerary) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="No trip to budget yet"
          description="Generate an itinerary to see transportation, stay, food, and activity estimates."
          action={
            <Link to="/plan" className="rounded-full bg-ocean px-5 py-3 text-white">
              Plan My Trip
            </Link>
          }
        />
      </div>
    )
  }

  const estimated = budgetTotal(itinerary.budget)
  const budget = itinerary.form.budgetInr
  const remaining = budget - estimated
  const overspend = remaining < 0 ? Math.abs(remaining) : 0
  const perPerson = estimated / Math.max(1, itinerary.form.travellers)
  const keys = Object.keys(itinerary.budget) as Array<keyof BudgetBreakdown>

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-ocean">Smart budget planner</p>
      <h1 className="font-display text-5xl">Estimated costs for {itinerary.form.destinationName}</h1>
      <p className="mt-3 text-ink-soft">All figures are estimates in Indian rupees, not live quotes or guaranteed prices.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 ring-1 ring-sand-deep/70">
          <p className="text-sm text-ink-soft">Total estimated cost</p>
          <p className="mt-2 font-display text-3xl">{formatInr(estimated)}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 ring-1 ring-sand-deep/70">
          <p className="text-sm text-ink-soft">Your budget</p>
          <p className="mt-2 font-display text-3xl">{formatInr(budget)}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 ring-1 ring-sand-deep/70">
          <p className="text-sm text-ink-soft">{remaining >= 0 ? 'Remaining budget' : 'Overspending'}</p>
          <p className={`mt-2 font-display text-3xl ${remaining >= 0 ? 'text-ocean' : 'text-coral'}`}>
            {formatInr(remaining >= 0 ? remaining : overspend)}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-5 ring-1 ring-sand-deep/70">
          <p className="text-sm text-ink-soft">Per-person estimate</p>
          <p className="mt-2 font-display text-3xl">{formatInr(perPerson)}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-sand-deep/70">
          <h2 className="font-display text-3xl">Breakdown</h2>
          <ul className="mt-4 space-y-3">
            {keys.map((key) => (
              <li key={key} className="flex justify-between text-sm">
                <span>{BUDGET_LABELS[key]}</span>
                <span className="font-medium">{formatInr(itinerary.budget[key])}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-6 ring-1 ring-sand-deep/70">
          <h2 className="font-display text-3xl">Visual mix</h2>
          <BudgetChart breakdown={itinerary.budget} />
        </div>
      </div>
    </div>
  )
}
