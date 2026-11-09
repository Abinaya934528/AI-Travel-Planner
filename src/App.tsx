import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AboutPage } from './pages/AboutPage'
import { BudgetPage } from './pages/BudgetPage'
import { DestinationDetailPage } from './pages/DestinationDetailPage'
import { DestinationsPage } from './pages/DestinationsPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HomePage } from './pages/HomePage'
import { ItineraryPage } from './pages/ItineraryPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PackingPage } from './pages/PackingPage'
import { PlannerPage } from './pages/PlannerPage'
import { SavedTripsPage } from './pages/SavedTripsPage'
import { TripDetailPage } from './pages/TripDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/plan" element={<PlannerPage />} />
          <Route path="/planner" element={<Navigate to="/plan" replace />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/saved" element={<SavedTripsPage />} />
          <Route path="/saved/:id" element={<TripDetailPage />} />
          <Route path="/packing" element={<PackingPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
