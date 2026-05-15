import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { MapPin } from '../types'

export function useMapPins() {
  const [pins, setPins] = useState<MapPin[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPins = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('map_pins')
      .select('*')
      .order('created_at', { ascending: false })
    setPins(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchPins() }, [fetchPins])

  return { pins, loading, refetch: fetchPins }
}
