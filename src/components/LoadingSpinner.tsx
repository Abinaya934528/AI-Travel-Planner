interface LoadingSpinnerProps {
  label?: string
}

export function LoadingSpinner({ label = 'Loading' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ocean" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-sand-deep border-t-ocean" />
      <span>{label}</span>
    </div>
  )
}
