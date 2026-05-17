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
      // Fetch photos and profiles in parallel
      const [{ data: photoData, error: photoError }, { data: profileData }] = await Promise.all([
        supabase.from('photos').select('*').order('taken_at', { ascending: false }),
        supabase.from('profiles').select('id, display_name, nickname, avatar_url'),
      ])

      if (photoError) throw photoError

      // Build a quick lookup map by profile id
      const profileMap = Object.fromEntries(
        (profileData || []).map((p) => [p.id, p])
      )

      // Get signed URLs and attach profile to each photo
      const photosWithUrls = await Promise.all(
        (photoData || []).map(async (photo) => {
          try {
            const { data: signedData } = await supabase.storage
              .from('photos')
              .createSignedUrl(photo.storage_path, 3600)
            return {
              ...photo,
              url: signedData?.signedUrl ?? null,
              profiles: profileMap[photo.uploaded_by] ?? null,
            }
          } catch {
            return {
              ...photo,
              url: null,
              profiles: profileMap[photo.uploaded_by] ?? null,
            }
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