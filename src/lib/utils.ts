import { clsx, type ClassValue } from 'clsx'

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Seeded random — stable per-ID so gallery positions don't reshuffle
export function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  // Normalize to 0..1
  return Math.abs(hash) / 2147483647
}

// Random tilt in range [-max, +max] degrees, seeded by id
export function seededTilt(id: string, max = 8): number {
  const r = seededRandom(id + 'tilt')
  return (r * 2 - 1) * max
}

// Random offset in px range, seeded
export function seededOffset(id: string, key: string, max: number): number {
  const r = seededRandom(id + key)
  return (r * 2 - 1) * max
}

// Extract Spotify track ID from URL or bare ID
export function parseSpotifyTrackId(input: string): string | null {
  const match = input.match(/track\/([a-zA-Z0-9]+)/)
  if (match) return match[1]
  if (/^[a-zA-Z0-9]{22}$/.test(input)) return input
  return null
}

// Deterministic day-of-year index for pun of the day
export function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Format date nicely
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
