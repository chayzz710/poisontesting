import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import NoteModal from '../components/features/memoryjar/NoteModal'
import AddNoteModal from '../components/features/memoryjar/AddNoteModal'
import KinderJarSVG from '../components/features/memoryjar/KinderJarSVG'
import { useMemoryJar } from '../hooks/useMemoryJar'
import { Button } from '../components/ui/Button'
import { seededTilt, seededOffset } from '../lib/utils'
import type { MemoryNote } from '../types'

export default function MemoryJarPage() {
  const { notes, loading, refetch } = useMemoryJar()
  const [selectedNote, setSelectedNote] = useState<MemoryNote | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [shaking, setShaking] = useState(false)

  const shakeJar = () => {
    if (notes.length === 0) return
    setShaking(true)
    setTimeout(() => {
      setShaking(false)
      const random = notes[Math.floor(Math.random() * notes.length)]
      setSelectedNote(random)
    }, 700)
  }

  return (
    <PageWrapper pageName="jar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-chocolate">memory jar</h1>
          <p className="font-hand text-orchid text-lg mt-1">
            {notes.length} little {notes.length === 1 ? 'note' : 'notes'} inside 🥚
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={shakeJar} disabled={notes.length === 0}>
            🫙 shake the jar
          </Button>
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            + add a note
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="text-5xl animate-tilt">🌻</div>
          <p className="font-hand text-orchid text-xl">rustling through the jar…</p>
        </div>
      ) : (
        <div className="relative flex flex-col items-center">
          {/* The jar SVG */}
          <motion.div
            animate={shaking ? {
              rotate: [0, -8, 8, -6, 6, -3, 3, 0],
              transition: { duration: 0.6 }
            } : {}}
          >
            <KinderJarSVG noteCount={notes.length} />
          </motion.div>

          {/* Notes scattered around */}
          {notes.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="font-hand text-chocolate/40 text-xl">the jar is empty…</p>
              <p className="font-hand text-orchid text-base mt-1">add the first memory 🌻</p>
            </div>
          ) : (
            <div className="relative w-full mt-8" style={{ minHeight: Math.ceil(notes.length / 5) * 120 + 60 }}>
              {notes.map((note, i) => {
                const tilt = seededTilt(note.id)
                const col = i % 5
                const row = Math.floor(i / 5)
                const x = col * 200 + seededOffset(note.id + 'x', -20, 20)
                const y = row * 110 + seededOffset(note.id + 'y', -10, 10)

                return (
                  <motion.button
                    key={note.id}
                    className="absolute focus:outline-none"
                    style={{ left: x, top: y }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: tilt }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 18 }}
                    whileHover={{ scale: 1.15, rotate: 0, zIndex: 20 }}
                    onClick={() => setSelectedNote(note)}
                  >
                    {/* Folded note triangle */}
                    <div className="relative w-14 h-14">
                      <svg viewBox="0 0 56 56" className="w-full h-full drop-shadow-md">
                        <polygon points="28,4 52,52 4,52" fill="#FFFDF4" stroke="#F5C842" strokeWidth="2" />
                        <polygon points="28,4 52,52 28,34" fill="#F5C842" opacity="0.3" />
                      </svg>
                      {note.chocolate_rating && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">
                          {'🍫'.repeat(Math.min(note.chocolate_rating, 3))}
                        </span>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Note reading modal */}
      <AnimatePresence>
        {selectedNote && (
          <NoteModal
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
          />
        )}
      </AnimatePresence>

      {/* Add note modal */}
      {showAdd && (
        <AddNoteModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); refetch() }}
        />
      )}
    </PageWrapper>
  )
}
