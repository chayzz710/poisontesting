import { supabase } from './supabase'

// ── Profiles ──────────────────────────────────────────────
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function upsertProfile(profile: {
  id: string
  display_name?: string
  nickname?: string
  bio?: string
  avatar_url?: string
  love_language?: string
  fav_things?: string[]
}) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Photos ────────────────────────────────────────────────
export async function getPhotos() {
  const { data, error } = await supabase
    .from('photos')
    .select('*, profiles(display_name, nickname, avatar_url)')
    .order('taken_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertPhoto(photo: {
  uploaded_by: string
  storage_path: string
  caption?: string
  taken_at?: string
  chocolate_rating?: number
}) {
  const { data, error } = await supabase.from('photos').insert(photo).select().single()
  if (error) throw error
  return data
}

export async function getPhotoUrl(path: string) {
  const { data } = await supabase.storage
    .from('photos')
    .createSignedUrl(path, 3600)
  return data?.signedUrl ?? null
}

// ── Letters ───────────────────────────────────────────────
export async function getLetters() {
  const { data, error } = await supabase
    .from('letters')
    .select('*, profiles(display_name, nickname, avatar_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertLetter(letter: {
  author_id: string
  title: string
  body: string
  is_open_when?: boolean
  unlock_condition?: string
}) {
  const { data, error } = await supabase.from('letters').insert(letter).select().single()
  if (error) throw error
  return data
}

export async function openLetter(letterId: string) {
  const { data, error } = await supabase
    .from('letters')
    .update({ opened_at: new Date().toISOString() })
    .eq('id', letterId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Memory Jar ────────────────────────────────────────────
export async function getMemoryNotes() {
  const { data, error } = await supabase
    .from('memory_jar_notes')
    .select('*, profiles(display_name, nickname, avatar_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertMemoryNote(note: {
  author_id: string
  body: string
  chocolate_rating?: number
}) {
  const { data, error } = await supabase.from('memory_jar_notes').insert(note).select().single()
  if (error) throw error
  return data
}

// ── Puns ──────────────────────────────────────────────────
export async function getPuns() {
  const { data, error } = await supabase
    .from('puns')
    .select('*, profiles(display_name, nickname, avatar_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertPun(pun: { author_id: string; body: string }) {
  const { data, error } = await supabase.from('puns').insert(pun).select().single()
  if (error) throw error
  return data
}

export async function ratePun(punId: string, rating: number, ratedBy: string) {
  const { data, error } = await supabase
    .from('puns')
    .update({ rating, rated_by: ratedBy })
    .eq('id', punId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Map Pins ──────────────────────────────────────────────
export async function getMapPins() {
  const { data, error } = await supabase
    .from('map_pins')
    .select('*, profiles(display_name, nickname, avatar_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertMapPin(pin: {
  added_by: string
  lat: number
  lng: number
  title: string
  story?: string
  pin_type?: string
  photo_url?: string
  visited_on?: string
}) {
  const { data, error } = await supabase.from('map_pins').insert(pin).select().single()
  if (error) throw error
  return data
}

// ── Songs ─────────────────────────────────────────────────
export async function getSongs() {
  const { data, error } = await supabase
    .from('songs')
    .select('*, profiles(display_name, nickname, avatar_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertSong(song: {
  added_by: string
  spotify_track_id: string
  note?: string
  is_anthem?: boolean
}) {
  const { data, error } = await supabase.from('songs').insert(song).select().single()
  if (error) throw error
  return data
}

// ── Bucket List ───────────────────────────────────────────
export async function getBucketItems() {
  const { data, error } = await supabase
    .from('bucket_items')
    .select('*, profiles(display_name, nickname, avatar_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertBucketItem(item: {
  added_by: string
  title: string
  description?: string
}) {
  const { data, error } = await supabase.from('bucket_items').insert(item).select().single()
  if (error) throw error
  return data
}

export async function completeBucketItem(itemId: string) {
  const { data, error } = await supabase
    .from('bucket_items')
    .update({ is_done: true, done_at: new Date().toISOString() })
    .eq('id', itemId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Photos ────────────────────────────────────────────────
export async function deletePhoto(photoId: string) {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)
  if (error) throw error
}

// ── Letters ───────────────────────────────────────────────
export async function deleteLetter(letterId: string) {
  const { error } = await supabase
    .from('letters')
    .delete()
    .eq('id', letterId)
  if (error) throw error
}

// ── Memory Jar ────────────────────────────────────────────
export async function deleteMemoryNote(noteId: string) {
  const { error } = await supabase
    .from('memory_jar_notes')
    .delete()
    .eq('id', noteId)
  if (error) throw error
}

// ── Puns ──────────────────────────────────────────────────
export async function deletePun(punId: string) {
  const { error } = await supabase
    .from('puns')
    .delete()
    .eq('id', punId)
  if (error) throw error
}

// ── Map Pins ──────────────────────────────────────────────
export async function deleteMapPin(pinId: string) {
  const { error } = await supabase
    .from('map_pins')
    .delete()
    .eq('id', pinId)
  if (error) throw error
}

// ── Songs ─────────────────────────────────────────────────
export async function deleteSong(songId: string) {
  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', songId)
  if (error) throw error
}

// ── Bucket List ───────────────────────────────────────────
export async function deleteBucketItem(itemId: string) {
  const { error } = await supabase
    .from('bucket_items')
    .delete()
    .eq('id', itemId)
  if (error) throw error
}

export async function uncompleteBucketItem(itemId: string) {
  const { error } = await supabase
    .from('bucket_items')
    .update({ is_done: false, done_at: null })
    .eq('id', itemId)
    .select()
    .single()
  if (error) throw error
}