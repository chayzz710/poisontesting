import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import EnvelopeCard from '../components/features/letters/EnvelopeCard'
import LetterModal from '../components/features/letters/LetterModal'
import WriteLetterModal from '../components/features/letters/WriteLetterModal'
import { useLetters } from '../hooks/useLetters'
import { Button } from '../components/ui/Button'
import type { Letter } from '../types'

export default function LettersPage() {
  const { letters, loading, refetch } = useLetters()
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [showWrite, setShowWrite] = useState(false)

  return (
    <PageWrapper pageKey="letters">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-chocolate">letters</h1>
          <p className="font-hand text-orchid text-lg mt-1">
            words saved for the right moment 💌
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowWrite(true)}>
          ✉️ write a letter
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="text-5xl animate-tilt">🌻</div>
          <p className="font-hand text-orchid text-xl">unfolding the envelopes…</p>
        </div>
      ) : letters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <div className="text-6xl">💌</div>
          <p className="font-display text-2xl text-chocolate/60">no letters yet</p>
          <p className="font-hand text-orchid text-lg">write the first one 🌻</p>
          <Button variant="primary" onClick={() => setShowWrite(true)} className="mt-2">
            ✉️ write a letter
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
            hidden: {},
          }}
        >
          {letters.map((letter) => (
            <EnvelopeCard
              key={letter.id}
              letter={letter}
              onClick={() => setSelectedLetter(letter)}
            />
          ))}
        </motion.div>
      )}

      {/* Letter reading modal */}
      <AnimatePresence>
        {selectedLetter && (
          <LetterModal
            letter={selectedLetter}
            onClose={() => setSelectedLetter(null)}
            onUpdate={refetch }
          />
        )}
      </AnimatePresence>

      {/* Write modal */}
      {showWrite && (
        <WriteLetterModal
          onClose={() => setShowWrite(false)}
          onSuccess={() => { setShowWrite(false); refetch() }}
        />
      )}
    </PageWrapper>
  )
}
