import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'
import type { Song } from '../../../types'

interface SongRowProps {
  song: Song
  index: number
  onUpdate: () => void
}

export default function SongRow({ song, index, onUpdate }: SongRowProps) {
  const { user } = useUser()
  const isOwner = user?.id === song.added_by

  const handleDelete = async () => {
    if (!confirm('remove this song?')) return
    const { error } = await supabase.from('songs').delete().eq('id', song.id)
    if (error) { toast.error('could not remove'); return }
    toast.success('song removed')
    onUpdate()
  }

  const handleSetAnthem = async () => {
  // Clear anthem on all YOUR songs only
  await supabase
    .from('songs')
    .update({ is_anthem: false })
    .eq('added_by', user?.id)

  // Set this one as anthem
  const { error } = await supabase
    .from('songs')
    .update({ is_anthem: true })
    .eq('id', song.id)

  if (error) { toast.error('could not set anthem'); return }
  toast.success('anthem set 🎵')
  onUpdate()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-soft p-4 flex gap-4 items-start"
    >
      {/* Spotify embed */}
      <div className="flex-1 min-w-0">
        <iframe
          src={`https://open.spotify.com/embed/track/${song.spotify_track_id}?utm_source=generator`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
        />
        {song.note && (
          <p className="font-hand text-chocolate/60 text-sm mt-2 px-1">
            "{song.note}"
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 flex-shrink-0 mt-1">
        {/* Set as anthem */}
        <button
          onClick={handleSetAnthem}
          title="set as our song"
          className="text-xl opacity-30 hover:opacity-100 transition"
        >
          ⭐
        </button>

        {/* Delete — owner only */}
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-chocolate/20 hover:text-chocolate/50 transition text-sm"
            title="remove"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  )
}
