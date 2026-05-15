import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Photo } from '../types'

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .order('taken_at', { ascending: false })

      if (fetchError) throw fetchError

      // Get signed URLs for all photos
      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo) => {
          try {
            const { data: signedData } = await supabase.storage
              .from('photos')
              .createSignedUrl(photo.storage_path, 3600)
            return { ...photo, url: signedData?.signedUrl ?? null }
          } catch {
            return { ...photo, url: null }
          }
        })
      )

      setPhotos(photosWithUrls)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  return { photos, loading, error, refetch: fetchPhotos }
}
