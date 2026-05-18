import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { OWNERS } from '../../../types'
import type { Profile } from '../../../types'

function Avatar({ profile }: { profile: Profile | null }) {
  const initials = profile?.display_name
    ? profile.display_name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const isEmoji = profile?.avatar_url && !profile.avatar_url.startsWith('http')

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 rounded-full border-4 border-sunflower shadow-polaroid bg-sunflower/30 flex items-center justify-center overflow-hidden">
        {isEmoji ? (
          <span className="text-4xl">{profile!.avatar_url}</span>
        ) : profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-display text-2xl text-chocolate">{initials}</span>
        )}
      </div>
      <div className="text-center">
        <p className="font-display text-lg text-chocolate leading-tight">
          {profile?.display_name ?? '…'}
        </p>
        {profile?.nickname && (
          <p className="font-hand text-orchid-deep text-base leading-tight">
            {profile.nickname}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function ProfilePair() {
  const [char, setChar] = useState<Profile | null>(null)
  const [rag, setRag]   = useState<Profile | null>(null)

  useEffect(() => {
    async function load() {
      const ids = [OWNERS.char, OWNERS.rag].filter((id) => id !== 'TBD')
      if (ids.length === 0) return
      const { data } = await supabase.from('profiles').select('*').in('id', ids)
      if (!data) return
      data.forEach((p: Profile) => {
        if (p.id === OWNERS.char) setChar(p)
        if (p.id === OWNERS.rag) setRag(p)
      })
    }
    load()
  }, [])

  return (
    <div className="flex items-center justify-center gap-10">
      <Avatar profile={char} />

      {/* Pulsing heart */}
      <motion.div
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="text-4xl"
        aria-hidden
      >
        💛
      </motion.div>

      <Avatar profile={rag} />
    </div>
  )
}