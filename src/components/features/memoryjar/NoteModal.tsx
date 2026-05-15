import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { Button } from '../../ui/Button'
import type { MemoryJarNote } from '../../../types'

interface NoteModalProps {
  note: MemoryJarNote
  onClose: () => void
}

export default function NoteModal({ note, onClose }: NoteModalProps) {
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
        {/* Paper note */}
        <div className="bg-cream rounded-2xl shadow-polaroid overflow-hidden">
          {/* Triangle flap top */}
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

            <div className="mt-4 pt-4 border-t border-sunflower/20 flex items-center justify-between">
              <p className="font-hand text-xs text-chocolate/30">
                {format(parseISO(note.created_at), 'MMMM d, yyyy')}
              </p>
              <Button variant="ghost" size="sm" onClick={onClose}>
                fold it up
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
