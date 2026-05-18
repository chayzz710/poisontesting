import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { OWNERS } from '../../../types'
import { toast } from 'sonner'

// Haversine formula — straight line distance in km
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

// Geocode a city name using Open-Meteo's free geocoding API (no key needed)
async function geocodeCity(city: string): Promise<{ lat: number; lng: number; name: string } | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    )
    const data = await res.json()
    const r = data.results?.[0]
    if (!r) return null
    return { lat: r.latitude, lng: r.longitude, name: r.name }
  } catch {
    return null
  }
}

interface LocationData {
  location: string | null
  lat: number | null
  lng: number | null
}

export default function DistanceTracker() {
  const { user } = useUser()
  const [charLoc, setCharLoc] = useState<LocationData>({ location: null, lat: null, lng: null })
  const [ragLoc, setRagLoc]   = useState<LocationData>({ location: null, lat: null, lng: null })
  const [editing, setEditing] = useState(false)
  const [input, setInput]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)

  const isChar = user?.id === OWNERS.char
  const isRag  = user?.id === OWNERS.rag
  const myLoc  = isChar ? charLoc : ragLoc

  useEffect(() => {
    if (OWNERS.char === 'TBD' || OWNERS.rag === 'TBD') { setLoading(false); return }

    Promise.all([
      supabase.from('profiles').select('current_location, current_location_lat, current_location_lng').eq('id', OWNERS.char).single(),
      supabase.from('profiles').select('current_location, current_location_lat, current_location_lng').eq('id', OWNERS.rag).single(),
    ]).then(([{ data: cd }, { data: rd }]) => {
      if (cd) setCharLoc({ location: cd.current_location, lat: cd.current_location_lat, lng: cd.current_location_lng })
      if (rd) setRagLoc({ location: rd.current_location, lat: rd.current_location_lat, lng: rd.current_location_lng })
    }).finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!input.trim() || !user) return
    setSaving(true)

    const geo = await geocodeCity(input.trim())
    if (!geo) {
      toast.error("couldn't find that city — try being more specific")
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        current_location: geo.name,
        current_location_lat: geo.lat,
        current_location_lng: geo.lng,
      })
      .eq('id', user.id)

    if (error) {
      toast.error('could not save location')
      setSaving(false)
      return
    }

    const updated = { location: geo.name, lat: geo.lat, lng: geo.lng }
    if (isChar) setCharLoc(updated)
    if (isRag)  setRagLoc(updated)
    setEditing(false)
    setInput('')
    toast('location updated 📍')
    setSaving(false)
  }

  if (loading || OWNERS.char === 'TBD') return null

  const distance =
    charLoc.lat && charLoc.lng && ragLoc.lat && ragLoc.lng
      ? haversineKm(charLoc.lat, charLoc.lng, ragLoc.lat, ragLoc.lng)
      : null

  const bothSet   = charLoc.location && ragLoc.location
  const sameCity  = distance !== null && distance < 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center gap-3 text-center"
    >
      {/* City display */}
      <div className="flex items-center gap-3 font-hand text-xl text-chocolate">
        {/* Char city */}
        <span className={charLoc.location ? 'text-chocolate' : 'text-chocolate/30 italic'}>
          {charLoc.location ?? 'somewhere…'}
        </span>

        <span className="text-chocolate/30 text-base">↔</span>

        {/* Rag city */}
        <span className={ragLoc.location ? 'text-chocolate' : 'text-chocolate/30 italic'}>
          {ragLoc.location ?? 'somewhere…'}
        </span>
      </div>

      {/* Distance pill */}
      {bothSet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`px-4 py-1.5 rounded-full font-hand text-sm ${
            sameCity
              ? 'bg-sunflower/40 text-chocolate'
              : 'bg-orchid/10 text-orchid-deep'
          }`}
        >
          {sameCity
            ? 'together 💛'
            : `${distance?.toLocaleString()} km apart`}
        </motion.div>
      )}

      {/* Edit button / inline form */}
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 overflow-hidden"
          >
            <input
              autoFocus
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
              placeholder="type a city…"
              className="input-base text-sm w-40"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-xs py-1.5 px-3"
            >
              {saving ? '…' : 'set'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="btn-ghost text-xs py-1.5 px-3"
            >
              cancel
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setEditing(true); setInput(myLoc.location ?? '') }}
            className="font-hand text-xs text-chocolate/30 hover:text-chocolate/60 transition"
          >
            📍 {myLoc.location ? 'update my location' : 'set my location'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}