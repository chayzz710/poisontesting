import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { MemoryNote } from '../types'

export function useMemoryJar() {
  const [notes, setNotes] = useState<MemoryNote[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('memory_jar_notes')
      .select('*')
      .order('created_at', { ascending: false })
    setNotes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  return { notes, loading, refetch: fetchNotes }
}
