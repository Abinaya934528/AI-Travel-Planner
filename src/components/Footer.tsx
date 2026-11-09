import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-sand-deep bg-ink text-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="flex items-center gap-2 font-display text-3xl">
            <Compass className="h-6 w-6 text-gold" />
            AI Travel Planner
          </p>
          <p className="mt-3 max-w-md text-sm text-sand/80">
            A local demo for discovering destinations, drafting itineraries, and tracking budgets in Indian rupees.
            Suggestions are not live bookings.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Explore</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/destinations">Destinations</Link>
            <Link to="/plan">Trip planner</Link>
            <Link to="/budget">Budget planner</Link>
            <Link to="/packing">Packing checklist</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Your trips</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/saved">Saved trips</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="/itinerary">Current itinerary</Link>
            <Link to="/about">About this demo</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-sand/60">
        Portfolio demo. Estimates only. Verify all travel details independently.
      </div>
    </footer>
  )
}
