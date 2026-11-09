import { useToast } from '../hooks/useToast'

export function ToastStack() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(100%-2rem,22rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl px-4 py-3 text-sm shadow-lg ${
            toast.type === 'error'
              ? 'bg-coral text-white'
              : toast.type === 'success'
                ? 'bg-ocean text-white'
                : 'bg-ink text-white'
          }`}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{toast.message}</p>
            <button type="button" className="text-white/80" onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
