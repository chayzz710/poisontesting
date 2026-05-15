import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { formatDate } from '../../../lib/utils'
import type { Letter } from '../../../types'

interface EnvelopeCardProps {
  letter: Letter
  onClick: () => void
}

// Soft pastel colours cycled by letter index via a hash
const envelopeColours = [
  'bg-sunflower/20 border-sunflower/40',
  'bg-orchid/10 border-orchid/30',
  'bg-riptide/10 border-riptide/30',
  'bg-pink-100 border-pink-200',
]

function colourFor(id: string) {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return envelopeColours[hash % envelopeColours.length]
}

export default function EnvelopeCard({ letter, onClick }: EnvelopeCardProps) {
  const isSealed = !letter.opened_at
  const isOpenWhen = letter.is_open_when
  const colour = colourFor(letter.id)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-2xl border-2 p-5 flex flex-col gap-3
        transition-shadow hover:shadow-polaroid ${colour}
      `}
    >
      {/* Envelope flap SVG at top */}
      <div className="w-full h-8 relative overflow-hidden -mt-1 -mx-1 mb-1">
        <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
          <polygon
            points="0,0 200,0 100,40"
            className={isSealed ? 'fill-current text-sunflower/30' : 'fill-current text-white/60'}
          />
        </svg>
      </div>

      {/* Locks / open badge */}
      <div className="flex items-center gap-2">
        {isOpenWhen && isSealed && (
          <span className="flex items-center gap-1 text-xs font-medium text-orchid bg-orchid/10 px-2 py-0.5 rounded-full">
            <Lock size={10} /> open when
          </span>
        )}
        {!isOpenWhen && !isSealed && (
          <span className="text-xs font-medium text-chocolate/40 bg-white/60 px-2 py-0.5 rounded-full">
            opened
          </span>
        )}
        {isOpenWhen && !isSealed && (
          <span className="text-xs font-medium text-chocolate/40 bg-white/60 px-2 py-0.5 rounded-full">
            opened 💌
          </span>
        )}
      </div>

      {/* Title */}
      <p className="font-display text-base text-chocolate leading-snug line-clamp-2">
        {letter.title}
      </p>

      {/* Unlock condition hint */}
      {isOpenWhen && letter.unlock_condition && (
        <p className="font-hand text-xs text-orchid/70 italic line-clamp-1">
          "{letter.unlock_condition}"
        </p>
      )}

      {/* Footer */}
      <p className="text-xs text-chocolate/30 font-hand mt-auto">
        {formatDate(letter.created_at)}
      </p>
    </motion.div>
  )
}
