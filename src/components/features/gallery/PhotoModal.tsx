import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Button } from '../../ui/Button'
import { Textarea } from '../../ui/Input'
import { ChocolateRating } from '../../ui/ChocolateRating'
import { toast } from 'sonner'
import type { Photo } from '../../../types'

interface PhotoModalProps {
  photo: Photo
  onClose: () => void
  onUpdate: () => void
}

export default function PhotoModal({ photo, onClose, onUpdate }: PhotoModalProps) {
  const { user } = useUser()
  const [editing, setEditing] = useState(false)
  const [caption, setCaption] = useState(photo.caption ?? '')
  const [chocolateRating, setChocolateRating] = useState<number>(photo.chocolate_rating ?? 0)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isOwner = user?.id === photo.uploaded_by

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('photos')
        .update({
          caption: caption.trim() || null,
          chocolate_rating: chocolateRating || null,
        })
        .eq('id', photo.id)

      if (error) throw error
      toast.success('updated! ✨')
      setEditing(false)
      onUpdate()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      // Delete from storage
      await supabase.storage.from('photos').remove([photo.storage_path])
      // Delete from DB
      const { error } = await supabase.from('photos').delete().eq('id', photo.id)
      if (error) throw error
      toast.success('photo deleted')
      onClose()
      onUpdate()
    } catch {
      toast.error('could not delete — try again')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-chocolate/60 backdrop-blur-sm" />

        {/* Panel */}
        <motion.div
          className="relative z-10 bg-surface rounded-3xl shadow-polaroid overflow-hidden flex max-w-3xl w-full max-h-[90vh]"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="w-1/2 bg-chocolate/5 flex items-center justify-center flex-shrink-0">
            {photo.url ? (
              <img
                src={photo.url}
                alt={photo.caption || 'memory'}
                className="w-full h-full object-contain max-h-[90vh]"
              />
            ) : (
              <div className="text-6xl">📷</div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 p-6 flex flex-col overflow-y-auto">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-chocolate/10 hover:bg-chocolate/20 flex items-center justify-center text-sm transition"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                {(photo as any).profiles?.avatar_url ? (
                  <img
                    src={(photo as any).profiles.avatar_url}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg">🌻</span>
                )}
                <span className="font-hand text-orchid">
                  {(photo as any).profiles?.nickname || (photo as any).profiles?.display_name || 'someone'}
                </span>
              </div>
              {photo.taken_at && (
                <p className="text-xs text-chocolate/40 font-hand">
                  {format(parseISO(photo.taken_at), 'MMMM d, yyyy')}
                </p>
              )}
            </div>

            {/* Caption */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <Textarea
                    label="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    placeholder="what's happening here?"
                  />
                  <ChocolateRating value={chocolateRating} onChange={setChocolateRating} />
                </div>
              ) : (
                <div>
                  {photo.caption ? (
                    <p className="font-hand text-lg text-chocolate leading-relaxed">{photo.caption}</p>
                  ) : (
                    <p className="font-hand text-chocolate/30 italic">no caption yet</p>
                  )}
                  {photo.chocolate_rating && (
                    <p className="mt-2 text-xl">{'🍫'.repeat(photo.chocolate_rating)}</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {isOwner && (
              <div className="mt-6 pt-4 border-t border-sunflower/20 space-y-2">
                {editing ? (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={saving}>
                      cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                      {saving ? 'saving…' : 'save'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                      ✏️ edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                      🗑 delete
                    </Button>
                  </div>
                )}

                {/* Delete confirm */}
                {confirmDelete && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 rounded-xl p-3 text-sm"
                  >
                    <p className="text-red-700 mb-2 font-medium">delete this memory forever?</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                        no, keep it
                      </Button>
                      <Button variant="danger" size="sm" onClick={handleDelete}>
                        yes, delete
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
