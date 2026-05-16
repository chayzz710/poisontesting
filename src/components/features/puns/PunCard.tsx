import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'
import { seededTilt } from '../../../lib/utils'
import type { Pun } from '../../../types'
import { AnimatePresence } from 'framer-motion'


interface PunCardProps {
  pun: Pun
  currentUserId: string
  onRate: () => void
  onDelete: () => void 
  index: number
}

const EMOJI_RATINGS = [
  { value: 1, emoji: '😩', label: 'terrible' },
  { value: 2, emoji: '😐', label: 'meh' },
  { value: 3, emoji: '🙂', label: 'okay' },
  { value: 4, emoji: '😆', label: 'good' },
  { value: 5, emoji: '🤣', label: 'got me' },
]

const NOTE_COLOURS = [
  'bg-sunflower/25',
  'bg-orchid/10',
  'bg-pink-100',
  'bg-riptide/10',
  'bg-green-100',
]

export default function PunCard({ pun, currentUserId, onRate, onDelete, index }: PunCardProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canRate = pun.author_id !== currentUserId
  const isOwner = pun.author_id === currentUserId
  const tilt = seededTilt(pun.id) * 0.4 // subtle tilt for sticky notes
  const colour = NOTE_COLOURS[index % NOTE_COLOURS.length]

  const handleRate = async (value: number) => {
    if (!canRate) return
    setRating(value)
    try {
      const { error } = await supabase
        .from('puns')
        .update({ rating: value, rated_by: currentUserId })
        .eq('id', pun.id)
      if (error) throw error
      toast.success(`rated ${EMOJI_RATINGS[value - 1].emoji}`)
      onRate()
    } catch {
      toast.error('could not save rating')
      setRating(null)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('puns')
        .delete()
        .eq('id', pun.id)
      if (error) throw error
      toast.success('pun removed 😶')
      onDelete()
    } catch {
      toast.error('could not delete')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const displayRating = rating ?? pun.rating

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85, rotate: tilt }}
      animate={{ opacity: 1, scale: 1, rotate: tilt }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
      className={`break-inside-avoid mb-5 rounded-xl shadow-soft ${colour} cursor-default group`}
    >
      <div className="p-5">
        {/* Pin dot + delete button row */}
        <div className="flex items-center justify-center relative mb-3 -mt-1">
          <div className="w-3 h-3 rounded-full bg-orchid/40" />
          {isOwner && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="absolute right-0 opacity-0 group-hover:opacity-100 text-chocolate/20 hover:text-red-400 transition text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Pun text */}
        <p className="font-hand text-lg text-chocolate leading-snug mb-4">{pun.body}</p>

        {/* Rating row */}
        <div className="flex items-center justify-between">
          {canRate ? (
            <div className="flex gap-1">
              {EMOJI_RATINGS.map(({ value, emoji, label }) => (
                <button
                  key={value}
                  title={label}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => handleRate(value)}
                  className={`text-lg transition-transform ${
                    (hoveredRating ?? displayRating ?? 0) >= value ? 'scale-125' : 'opacity-40'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-1 items-center">
              {displayRating ? (
                <>
                  <span className="text-lg">{EMOJI_RATINGS[displayRating - 1]?.emoji}</span>
                  <span className="font-hand text-xs text-chocolate/40">
                    {EMOJI_RATINGS[displayRating - 1]?.label}
                  </span>
                </>
              ) : (
                <span className="font-hand text-xs text-chocolate/30">awaiting verdict…</span>
              )}
            </div>
          )}
          <p className="font-hand text-xs text-chocolate/30">
            {format(parseISO(pun.created_at), 'MMM d')}
          </p>
        </div>
      </div>

      {/* Inline delete confirm — slides open below */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 flex items-center gap-3 border-t border-chocolate/10 pt-3">
              <p className="font-hand text-sm text-red-400 flex-1">delete this pun?</p>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="font-hand text-sm text-chocolate/40 hover:text-chocolate transition"
              >
                keep it
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="font-hand text-sm text-red-400 hover:text-red-600 font-medium transition"
              >
                {deleting ? 'removing…' : 'yes, remove'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
