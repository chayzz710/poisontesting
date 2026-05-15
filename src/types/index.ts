// ── Auth ──────────────────────────────────────────────────
export interface OwnerMap {
  char: string
  rag: string
}

// Fill these in after first Google logins → Supabase → Auth → Users
export const OWNERS: OwnerMap = {
  char: 'TBD',
  rag: 'TBD',
}

// The start date of the relationship
export const RELATIONSHIP_START = new Date('2025-12-09') // 💛 update me!

// ── DB row types (mirrors Supabase schema) ────────────────
export interface Profile {
  id: string
  display_name: string | null
  nickname: string | null
  bio: string | null
  avatar_url: string | null
  love_language: string | null
  fav_things: string[] | null
  created_at: string
}

export interface Photo {
  id: string
  uploaded_by: string
  storage_path: string
  caption: string | null
  taken_at: string | null
  chocolate_rating: number | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface Letter {
  id: string
  author_id: string
  title: string
  body: string
  is_open_when: boolean
  unlock_condition: string | null
  opened_at: string | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface MemoryNote {
  id: string
  author_id: string
  body: string
  chocolate_rating: number | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface Pun {
  id: string
  author_id: string
  body: string
  rating: number | null
  rated_by: string | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface MapPin {
  id: string
  added_by: string
  lat: number
  lng: number
  title: string
  story: string | null
  pin_type: 'first_date' | 'favourite' | 'adventure' | 'home' | 'other' | null
  photo_url: string | null
  visited_on: string | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface Song {
  id: string
  added_by: string
  spotify_track_id: string
  note: string | null
  is_anthem: boolean
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface BucketItem {
  id: string
  added_by: string
  title: string
  description: string | null
  is_done: boolean
  done_at: string | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}
