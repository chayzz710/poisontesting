import { useState } from 'react'
import { seededRandom } from '../../lib/utils'

interface FrogEasterEggProps {
  pageKey: string // unique per page so frog appears in different spots
}

// Four corners to place the frog, keyed by page
const POSITIONS = [
  { top: '12px', left: '16px' },
  { top: '12px', right: '16px' },
  { bottom: '12px', left: '16px' },
  { bottom: '12px', right: '16px' },
]

export default function FrogEasterEgg({ pageKey }: FrogEasterEggProps) {
  const [found, setFound] = useState(false)
  const index = Math.floor(seededRandom(pageKey) * POSITIONS.length)
  const pos = POSITIONS[index]

  return (
    <div
      style={{ position: 'fixed', ...pos, zIndex: 50 }}
      className="group cursor-pointer select-none"
      onClick={() => setFound(true)}
      title="you found me 🐸"
    >
      <span
        className="text-base transition-all duration-300 opacity-10 group-hover:opacity-100 group-hover:scale-125 inline-block"
        style={{ transform: found ? 'scale(1.4)' : undefined, opacity: found ? 1 : undefined }}
      >
        🐸
      </span>
      {found && (
        <span className="absolute left-6 top-0 whitespace-nowrap font-hand text-sm text-orchid-deep bg-cream border border-orchid/20 px-3 py-1.5 rounded-full shadow-soft pointer-events-none tracking-wide">
          you found me 🐸
        </span>
      )}
    </div>
  )
}
