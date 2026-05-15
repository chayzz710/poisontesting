import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Song } from '../types'

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSongs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
    setSongs(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSongs() }, [fetchSongs])

  return { songs, loading, refetch: fetchSongs }
}
