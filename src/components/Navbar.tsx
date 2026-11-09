import { Compass, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/plan', label: 'Plan a trip' },
  { to: '/budget', label: 'Budget' },
  { to: '/saved', label: 'Saved trips' },
  { to: '/packing', label: 'Packing' },
  { to: '/favorites', label: 'Favorites' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-ink/80 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 font-display text-2xl tracking-tight">
          <Compass className="h-6 w-6 text-gold" />
          AI Travel Planner
        </NavLink>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm ${isActive ? 'text-gold' : 'text-white/80 hover:text-white'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/plan"
            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink"
          >
            Plan My Trip
          </NavLink>
        </nav>
        <button
          type="button"
          className="rounded-full p-2 lg:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <nav className="grid gap-2 border-t border-white/10 px-4 py-4 lg:hidden" aria-label="Mobile">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="rounded-xl px-3 py-2 text-white/90 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
