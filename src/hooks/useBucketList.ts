import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { BucketItem } from '../types'

export function useBucketList() {
  const [items, setItems] = useState<BucketItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('bucket_items')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  return { items, loading, refetch: fetchItems }
}
