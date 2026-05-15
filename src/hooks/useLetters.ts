import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Letter } from '../types'

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLetters = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false })
    setLetters(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchLetters() }, [fetchLetters])

  return { letters, loading, refetch: fetchLetters }
}
