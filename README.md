# AI Travel Planner

A portfolio travel-planning web app built with React, TypeScript, Vite, and Tailwind CSS. It helps you discover destinations, draft a day-by-day itinerary, estimate a budget in Indian rupees, save trips locally, and track a packing checklist.

This is a **local demo**. Itineraries are generated in the browser. They are planning suggestions, not live bookings, guaranteed prices, or real-time availability.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## What is local vs future backend

- **Local demo:** destination catalogue, itinerary generator, budget estimates, saved trips, packing list, favorites.
- **Not included:** user accounts, paid APIs, live weather, live prices, guaranteed opening hours.
- **Later integration:** set `VITE_ITINERARY_API_URL` in a backend-fed way (see `.env.example`). Do not put secret keys in frontend environment variables.

Saved data uses `localStorage` in this browser only.

## Deploy

The app is a static Vite SPA. For Vercel, `vercel.json` rewrites unknown routes to `index.html`. Do not point the production build at `localhost` APIs.
