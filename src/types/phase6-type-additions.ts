// Additions to src/types/index.ts for Phase 6
// Merge these into your existing types file.

export interface MapPin {
  id: string
  added_by: string
  lat: number
  lng: number
  title: string
  story: string | null
  pin_type: string | null   // 'first_date' | 'favourite' | 'adventure' | 'default'
  photo_url: string | null
  visited_on: string | null // ISO date string
  created_at: string
}

export interface Song {
  id: string
  added_by: string
  spotify_track_id: string
  note: string | null
  is_anthem: boolean
  created_at: string
}

export interface BucketItem {
  id: string
  added_by: string
  title: string
  description: string | null
  is_done: boolean
  done_at: string | null
  created_at: string
}
