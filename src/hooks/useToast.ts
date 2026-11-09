import { createContext, useContext } from 'react'
import type { ToastMessage } from '../types'

export interface ToastContextValue {
  toasts: ToastMessage[]
  pushToast: (type: ToastMessage['type'], message: string) => void
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext)
  if (!value) {
    throw new Error('useToast must be used within AppLayout')
  }
  return value
}
