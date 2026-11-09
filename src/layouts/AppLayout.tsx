import { useCallback, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ToastStack } from '../components/ToastStack'
import { ToastContext } from '../hooks/useToast'
import type { ToastMessage } from '../types'

export function AppLayout() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (type: ToastMessage['type'], message: string) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, type, message }])
      window.setTimeout(() => dismissToast(id), 4200)
    },
    [dismissToast],
  )

  const value = useMemo(() => ({ toasts, pushToast, dismissToast }), [toasts, pushToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ToastStack />
      </div>
    </ToastContext.Provider>
  )
}
