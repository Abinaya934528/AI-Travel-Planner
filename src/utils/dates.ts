export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function nightsBetween(start: string, end: string): number {
  const a = parseIsoDate(start)
  const b = parseIsoDate(end)
  if (!a || !b) return 0
  const diff = b.getTime() - a.getTime()
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)))
}

export function tripDays(start: string, end: string): number {
  return nightsBetween(start, end) + 1
}

export function addDaysIso(start: string, daysToAdd: number): string {
  const date = parseIsoDate(start)
  if (!date) return start
  date.setDate(date.getDate() + daysToAdd)
  return date.toISOString().slice(0, 10)
}

export function formatDisplayDate(value: string): string {
  const date = parseIsoDate(value)
  if (!date) return value
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'short',
  }).format(date)
}
