import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <EmptyState
        title="Page not found"
        description="That route is not part of AI Travel Planner."
        action={
          <Link to="/" className="rounded-full bg-ocean px-5 py-3 text-white">
            Back to home
          </Link>
        }
      />
    </div>
  )
}
