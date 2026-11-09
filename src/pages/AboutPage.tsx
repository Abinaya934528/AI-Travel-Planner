import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-ocean">About</p>
      <h1 className="font-display text-5xl">This is a local demo</h1>
      <p className="mt-4 text-ink-soft">
        AI Travel Planner is a portfolio web app. Itineraries, budgets, packing lists, and favorites run in your browser
        with localStorage. They are useful planning sketches, not booked travel products.
      </p>
      <p className="mt-4 text-ink-soft">
        A future AI API can be connected through a secure backend using <code>VITE_ITINERARY_API_URL</code>. Weather and
        maps endpoints are similarly reserved. This frontend never stores secret API keys.
      </p>
      <p className="mt-4 text-ink-soft">There is no user login. Clearing browser data removes locally saved trips.</p>
      <Link to="/plan" className="mt-8 inline-block rounded-full bg-ocean px-5 py-3 font-semibold text-white">
        Plan My Trip
      </Link>
    </div>
  )
}
