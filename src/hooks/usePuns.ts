import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Pun } from '../types'

export function usePuns() {
  const [puns, setPuns] = useState<Pun[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPuns = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('puns')
      .select('*')
      .order('created_at', { ascending: false })
    setPuns(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchPuns() }, [fetchPuns])

  return { puns, loading, refetch: fetchPuns }
}
