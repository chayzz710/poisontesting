import { useEffect, useState } from 'react'
import { useUser } from '../lib/auth'
import { getProfile } from '../lib/db'
import type { Profile } from '../types'

export function useProfile() {
  const { user, loading: userLoading } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    if (userLoading) return
    if (!user) { setLoading(false); return }

    getProfile(user.id)
      .then(p => {
        setProfile(p)
        setNeedsSetup(!p.display_name)
        setLoading(false)
      })
      .catch(() => {
        // No profile row yet → needs setup
        setNeedsSetup(true)
        setLoading(false)
      })
  }, [user, userLoading])

  async function refreshProfile() {
    if (!user) return
    const p = await getProfile(user.id)
    setProfile(p)
    setNeedsSetup(!p.display_name)
  }

  return { profile, loading, needsSetup, refreshProfile }
}
