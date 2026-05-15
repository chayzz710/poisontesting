import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { Button } from '../../ui/Button'
import { toast } from 'sonner'
import type { Letter } from '../../../types'

interface LetterModalProps {
  letter: Letter
  onClose: () => void
  onUpdate: () => void
}

type Stage = 'confirm' | 'opening' | 'reading'

export default function LetterModal({ letter, onClose, onUpdate }: LetterModalProps) {
  const isSealed = !letter.opened_at
  const needsConfirm = isSealed && letter.is_open_when

  const [stage, setStage] = useState<Stage>(
    needsConfirm ? 'confirm' : 'reading'
  )

  const openLetter = async () => {
    setStage('opening')
    // Animate the flap opening, then mark as opened
    setTimeout(async () => {
      const { error } = await supabase
        .from('letters')
        .update({ opened_at: new Date().toISOString() })
        .eq('id', letter.id)
      if (error) {
        toast.error('could not open letter')
        return
      }
      setStage('reading')
      onUpdate()
    }, 1200)
  }

  const handleReseal = async () => {
  const { error } = await supabase
    .from('letters')
    .update({ opened_at: null })
    .eq('id', letter.id)
  if (error) { toast.error('could not reseal'); return }
  toast.success('letter resealed 🔒')
  onClose()
  onUpdate()
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
        className="relative z-10 w-full max-w-lg"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confirm stage — "are you sure?" */}
        {stage === 'confirm' && (
          <div className="bg-cream rounded-3xl shadow-polaroid p-8 text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="font-display text-2xl text-chocolate mb-2">{letter.title}</h2>
            {letter.unlock_condition && (
              <p className="font-hand text-orchid text-lg mb-6 italic">
                "{letter.unlock_condition}"
              </p>
            )}
            <p className="text-chocolate/60 text-sm mb-6">
              Are you sure this is the right moment?<br />
              <span className="font-medium text-chocolate/80">It can only be opened once.</span>
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" onClick={onClose}>not yet</Button>
              <Button variant="primary" onClick={openLetter}>yes, open it 💌</Button>
            </div>
          </div>
        )}

        {/* Opening stage — envelope animation */}
        {stage === 'opening' && (
          <div className="bg-cream rounded-3xl shadow-polaroid overflow-hidden">
            {/* Envelope body */}
            <div className="relative bg-sunflower/20 p-8 flex flex-col items-center justify-center min-h-48">
              {/* Flap animation */}
              <motion.div
                className="absolute top-0 left-0 right-0"
                initial={{ rotateX: 0, originY: 0 }}
                animate={{ rotateX: -180 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top' }}
              >
                <svg viewBox="0 0 400 80" className="w-full">
                  <polygon points="0,0 400,0 200,80" fill="#F5C842" opacity="0.4" />
                </svg>
              </motion.div>

              {/* Paper sliding up */}
              <motion.div
                className="bg-white rounded-lg shadow px-6 py-4 mt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -10, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <p className="font-hand text-orchid text-lg">opening…</p>
              </motion.div>
            </div>
          </div>
        )}

        {/* Reading stage — full letter */}
        {stage === 'reading' && (
          <div className="bg-cream rounded-3xl shadow-polaroid overflow-hidden max-h-[80vh] flex flex-col">
            {/* Letter header */}
            <div className="bg-sunflower/20 px-8 pt-8 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-sm hover:bg-white transition"
              >
                ✕
              </button>
              <p className="font-hand text-orchid/60 text-sm mb-1">a letter</p>
              <h2 className="font-display text-2xl text-chocolate">{letter.title}</h2>
              <p className="font-hand text-xs text-chocolate/40 mt-1">
                written {format(parseISO(letter.created_at), 'MMMM d, yyyy')}
                {letter.opened_at && ` · opened ${format(parseISO(letter.opened_at), 'MMMM d, yyyy')}`}
              </p>
            </div>

            {/* Letter body */}
            <motion.div
              className="flex-1 overflow-y-auto px-8 py-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <p className="font-hand text-xl text-chocolate leading-relaxed whitespace-pre-wrap">
                {letter.body}
              </p>
            </motion.div>

            <div className="px-8 pb-6 flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={onClose}>
                tuck it away
              </Button>
              <Button variant="danger" size="sm" onClick={handleReseal}>
                reseal 🔒
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
