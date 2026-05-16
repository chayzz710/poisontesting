import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Button } from '../../ui/Button'
import { toast } from 'sonner'
import type { MemoryJarNote } from '../../../types'

interface NoteModalProps {
  note: MemoryJarNote
  onClose: () => void
  onUpdate: () => void  // ← new prop
}

export default function NoteModal({ note, onClose, onUpdate }: NoteModalProps) {
  const { user } = useUser()
  const isOwner = user?.id === note.author_id
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('memory_jar_notes')
        .delete()
        .eq('id', note.id)
      if (error) throw error
      toast.success('note removed from the jar')
      onUpdate()
      onClose()
    } catch {
      toast.error('could not delete')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-chocolate/50 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-cream rounded-2xl shadow-polaroid overflow-hidden">
          {/* Triangle flap */}
          <div className="w-full overflow-hidden h-10">
            <svg viewBox="0 0 400 40" className="w-full h-full" preserveAspectRatio="none">
              <polygon points="0,40 400,40 200,0" fill="#F5C842" opacity="0.35" />
            </svg>
          </div>

          <div className="px-7 pb-7 pt-3">
            <p className="font-hand text-2xl text-chocolate leading-relaxed whitespace-pre-wrap">
              {note.body}
            </p>

            {note.chocolate_rating && (
              <p className="mt-3 text-xl">{'🍫'.repeat(note.chocolate_rating)}</p>
            )}

            <div className="mt-4 pt-4 border-t border-sunflower/20 flex items-center justify-between gap-2">
              <p className="font-hand text-xs text-chocolate/30">
                {format(parseISO(note.created_at), 'MMMM d, yyyy')}
              </p>
              <div className="flex items-center gap-2">
                {isOwner && !confirmDelete && (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="font-hand text-xs text-chocolate/20 hover:text-red-400 transition"
                  >
                    🗑 delete
                  </button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  fold it up
                </Button>
              </div>
            </div>

            {/* Inline delete confirm */}
            <AnimatePresence>
              {confirmDelete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <div className="bg-red-50 rounded-xl p-3 flex items-center gap-3">
                    <p className="font-hand text-sm text-red-500 flex-1">remove this memory?</p>
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
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}